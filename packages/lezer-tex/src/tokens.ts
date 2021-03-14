// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus, max-classes-per-file, no-param-reassign, import/prefer-default-export */
/* Hand-written tokenizers for TeX. */
import { ContextTracker, Stack } from 'lezer';
import { CatCode } from './catcode';
import Context from './context.class';
import {
  begingroup_cs,
  begingroup_cs_token,
  catcode_cs_token,
  defcode_cs_token,
  def_cs_token,
  directive,
  double_math_shift,
  endgroup_cs,
  endgroup_cs_token,
  futurelet_cs_token,
  left_brace,
  let_cs_token,
  prefix_cs_token,
  right_brace,
  single_math_shift,
} from './gen/terms';
import { GroupType } from './group-type';
import * as directives from './modules/directives';
import Tokenizer from './tokenizer';
import { Trie } from './utils/trie';
import cp from './utils/c';
import isHex from './utils/is-hex';

function createTopLevelContext(): Context {
  const baseCtx = new Context(GroupType.Bottom);
  baseCtx.define(cp`\\`, 0);
  baseCtx.define(cp`{`, 1);
  baseCtx.define(cp`}`, 2);
  baseCtx.define(cp`$`, 3);
  baseCtx.define(cp`&`, 4);
  baseCtx.define(cp`\r`, 5);
  baseCtx.define(cp`\n`, 5);
  baseCtx.define(cp`#`, 6);
  baseCtx.define(cp`^`, 7);
  baseCtx.define(cp`_`, 8);
  baseCtx.define(cp`\x00`, 9);
  baseCtx.define(cp` `, 10);
  for (let i = cp`A`; i <= cp`Z`; i++) {
    baseCtx.define(i, 11);
    baseCtx.define(i - cp`A` + cp`a`, 11);
  }
  baseCtx.define(cp`~`, 13);
  baseCtx.define(cp`%`, 14);
  baseCtx.define(cp`\x7F`, 14);
  return baseCtx;
}

class TeXContextTracker extends ContextTracker<Context | null> {
  constructor() {
    super({
      start: createTopLevelContext(),
      hash(ctx: Context) {
        return ctx.hash;
      },
      shift(ctx: Context, term, input, stack) {
        if (ctx.reset) {
          ctx = createTopLevelContext();
        }
        switch (term) {
          case left_brace: {
            ctx = new Context(GroupType.Simple, ctx.depth + 1, ctx);
            break;
          }
          case begingroup_cs: {
            ctx = new Context(GroupType.SemiSimple, ctx.depth + 1, ctx);
            break;
          }
          case right_brace:
          case endgroup_cs: {
            if (!ctx.parent) return null;
            ctx = ctx.parent;
            break;
          }
          case double_math_shift:
          case single_math_shift: {
            ctx =
              ctx.groupType !== GroupType.MathShift
                ? new Context(GroupType.MathShift, ctx.depth + 1, ctx)
                : (ctx.parent as Context);
            break;
          }
          case directive: {
            const instructions = input.read(stack.ruleStart, stack.pos);
            for (const dir of Object.values(directives)) {
              const updatedContext = dir.exec(instructions, ctx);
              if (updatedContext) {
                ctx = updatedContext;
                if (!dir.fallthrough) break;
              }
            }
            return ctx;
          }
        }
        return ctx;
      },
    });
  }
}

export const trackContext = new TeXContextTracker();
export const tokenizer = new Tokenizer();

const rootCS = new Trie(-1);

rootCS.insert('begingroup', begingroup_cs_token);
rootCS.insert('endgroup', endgroup_cs_token);

rootCS.insert('let', let_cs_token);
rootCS.insert('futurelet', futurelet_cs_token);

rootCS.insert('catcode', defcode_cs_token);
rootCS.insert('mathcode', defcode_cs_token);
rootCS.insert('lccode', defcode_cs_token);
rootCS.insert('uccode', defcode_cs_token);
rootCS.insert('sfcode', defcode_cs_token);
rootCS.insert('delcode', defcode_cs_token);

rootCS.insert('long', prefix_cs_token);
rootCS.insert('outer', prefix_cs_token);
rootCS.insert('global', prefix_cs_token);

rootCS.insert('def', def_cs_token);
rootCS.insert('edef', def_cs_token);
rootCS.insert('gdef', def_cs_token);
rootCS.insert('xdef', def_cs_token);

export function specializeControlSequence(val: string, stk: Stack): number {
  const b = Uint32Array.from(val, (v) => v.codePointAt(0) as number);
  let n = rootCS;
  let o = 3;
  for (let i = 0; i < b.length; i++) {
    if (stk.context.getCatCode(b[i]) === CatCode.SupMark) {
      const c = b[i + 2];
      const cc = b[i + 3];
      if (isHex(c) && isHex(cc)) {
        b[i] = parseInt(`0x${String.fromCharCode(c, cc)}`, 16);
        o = 4;
      } else {
        b[i] = c < 0o100 ? c + 0o100 : c - 0o100;
        o = 3;
      }
      b.set(b.subarray(i + o), i + 1);
    }
    if (!(b[i] in n.c)) return -1;
    n = n.c[b[i]];
  }
  return n.v;
}
