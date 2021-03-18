// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus, max-classes-per-file, no-param-reassign, import/prefer-default-export */
/* Hand-written tokenizers for TeX. */
import { ContextTracker, Input, Stack } from 'lezer';
import Context from './context';
import { GroupType } from './enums/group-type';
import {
  begin_group,
  def,
  def_code,
  directive_comment,
  end_group,
  futurelet,
  left_brace,
  left_double_math_shift,
  left_math_shift,
  prefix,
  right_brace,
  right_double_math_shift,
  right_math_shift,
  _let,
} from './gen/terms';
import * as directives from './modules/directives';
import Tokenizer from './tokenizer';
import cp from './utils/c';

Context.primitives.insert('begingroup', [begin_group, '']);
Context.primitives.insert('endgroup', [end_group, '']);

Context.primitives.insert('let', [_let, '']);
Context.primitives.insert('futurelet', [futurelet, 'future']);

Context.primitives.insert('catcode', [def_code, 'cat']);
Context.primitives.insert('mathcode', [def_code, 'math']);
Context.primitives.insert('lccode', [def_code, 'lc']);
Context.primitives.insert('uccode', [def_code, 'uc']);
Context.primitives.insert('sfcode', [def_code, 'sf']);
Context.primitives.insert('delcode', [def_code, 'del']);

Context.primitives.insert('long', [prefix, 'long']);
Context.primitives.insert('outer', [prefix, 'outer']);
Context.primitives.insert('global', [prefix, 'global']);

Context.primitives.insert('def', [def, '']);
Context.primitives.insert('edef', [def, 'e']);
Context.primitives.insert('gdef', [def, 'g']);
Context.primitives.insert('xdef', [def, 'x']);

// Context.primitives.insert('if', [if_cs_token, '']);
// Context.primitives.insert('ifcat', [if_cs_token, 'cat']);
// Context.primitives.insert('ifnum', [if_cs_token, 'num']);
// Context.primitives.insert('ifdim', [if_cs_token, 'dim']);
// Context.primitives.insert('ifvmode', [if_cs_token, 'vmode']);
// Context.primitives.insert('ifhmode', [if_cs_token, 'hmode']);
// Context.primitives.insert('ifmmode', [if_cs_token, 'mmode']);
// Context.primitives.insert('ifinner', [if_cs_token, 'inner']);
// Context.primitives.insert('ifvoid', [if_cs_token, 'void']);
// Context.primitives.insert('ifhbox', [if_cs_token, 'hbox']);
// Context.primitives.insert('ifvbox', [if_cs_token, 'vbox']);
// Context.primitives.insert('ifx', [if_cs_token, 'x']);
// Context.primitives.insert('ifeof', [if_cs_token, 'eof']);
// Context.primitives.insert('iftrue', [if_cs_token, 'true']);
// Context.primitives.insert('iffalse', [if_cs_token, 'false']);
// Context.primitives.insert('ifcase', [if_cs_token, 'case']);
// Context.primitives.insert('or', [or_cs_token, '']);
// Context.primitives.insert('else', [else_cs_token, '']);
// Context.primitives.insert('fi', [fi_cs_token, '']);

function createTopLevelContext(): Context {
  const baseCtx = new Context(GroupType.Bottom);
  baseCtx.defineCatCode(cp`\\`, 0);
  baseCtx.defineCatCode(cp`{`, 1);
  baseCtx.defineCatCode(cp`}`, 2);
  baseCtx.defineCatCode(cp`$`, 3);
  baseCtx.defineCatCode(cp`&`, 4);
  baseCtx.defineCatCode(cp`\r`, 5);
  baseCtx.defineCatCode(cp`\n`, 5);
  baseCtx.defineCatCode(cp`#`, 6);
  baseCtx.defineCatCode(cp`^`, 7);
  baseCtx.defineCatCode(cp`_`, 8);
  baseCtx.defineCatCode(cp`\x00`, 9);
  baseCtx.defineCatCode(cp` `, 10);
  for (let i = cp`A`; i <= cp`Z`; i++) {
    baseCtx.defineCatCode(i, 11);
    baseCtx.defineCatCode(i - cp`A` + cp`a`, 11);
  }
  baseCtx.defineCatCode(cp`~`, 13);
  baseCtx.defineCatCode(cp`%`, 14);
  baseCtx.defineCatCode(cp`\x7F`, 14);
  return baseCtx;
}

class TeXContextTracker extends ContextTracker<Context | null> {
  constructor() {
    super({
      start: createTopLevelContext(),
      hash(ctx: Context) {
        return ctx.hash;
      },
      shift: (ctx: Context, term: number, input: Input, stack: Stack) => {
        if (ctx.reset) {
          ctx = createTopLevelContext();
        }
        return this.handleTerm(ctx, term, input, stack);
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private handleTerm(ctx: Context, term: number, input: Input, stack: Stack): Context {
    if (ctx.command) {
      ctx.command.match(term, input.read(stack.ruleStart, stack.pos));
      if (ctx.command.ready) {
        return ctx.command.execute(ctx);
      }
      return ctx;
    }
    switch (term) {
      case left_brace: {
        return new Context(GroupType.Simple, ctx.depth + 1, ctx);
      }
      case begin_group: {
        return new Context(GroupType.SemiSimple, ctx.depth + 1, ctx);
      }
      case left_math_shift:
      case left_double_math_shift: {
        return ctx.groupType !== GroupType.MathShift
          ? new Context(GroupType.MathShift, ctx.depth + 1, ctx)
          : ctx;
      }
      case right_math_shift:
      case right_double_math_shift:
      case right_brace:
      case end_group: {
        return ctx.parent || ctx;
      }
      case directive_comment: {
        const instructions = input.read(stack.ruleStart + 2, stack.pos).trim();
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
  }
}

export const trackContext = new TeXContextTracker();
export const tokenizer = new Tokenizer();
