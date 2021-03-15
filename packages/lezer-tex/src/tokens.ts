// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus, max-classes-per-file, no-param-reassign, import/prefer-default-export */
/* Hand-written tokenizers for TeX. */
import { ContextTracker, Input, Stack } from 'lezer';
import Context from './context';
import {
  begingroup_cs,
  begingroup_cs_token,
  defcode_cs_token,
  def_cs_token,
  directive_comment,
  double_math_shift,
  else_cs_token,
  endgroup_cs,
  endgroup_cs_token,
  fi_cs_token,
  futurelet_cs_token,
  if_cs_token,
  left_brace,
  let_cs_token,
  or_cs_token,
  prefix_cs_token,
  right_brace,
  single_math_shift,
} from './gen/terms';
import { GroupType } from './group-type';
import * as directives from './modules/directives';
import Tokenizer from './tokenizer';
import cp from './utils/c';

Context.primitives.insert('begingroup', [begingroup_cs_token, '']);
Context.primitives.insert('endgroup', [endgroup_cs_token, '']);

Context.primitives.insert('let', [let_cs_token, '']);
Context.primitives.insert('futurelet', [futurelet_cs_token, 'future']);

Context.primitives.insert('catcode', [defcode_cs_token, 'cat']);
Context.primitives.insert('mathcode', [defcode_cs_token, 'math']);
Context.primitives.insert('lccode', [defcode_cs_token, 'lc']);
Context.primitives.insert('uccode', [defcode_cs_token, 'uc']);
Context.primitives.insert('sfcode', [defcode_cs_token, 'sf']);
Context.primitives.insert('delcode', [defcode_cs_token, 'del']);

Context.primitives.insert('long', [prefix_cs_token, 'long']);
Context.primitives.insert('outer', [prefix_cs_token, 'outer']);
Context.primitives.insert('global', [prefix_cs_token, 'global']);

Context.primitives.insert('def', [def_cs_token, '']);
Context.primitives.insert('edef', [def_cs_token, 'e']);
Context.primitives.insert('gdef', [def_cs_token, 'g']);
Context.primitives.insert('xdef', [def_cs_token, 'x']);

Context.primitives.insert('if', [if_cs_token, '']);
Context.primitives.insert('ifcat', [if_cs_token, 'cat']);
Context.primitives.insert('ifnum', [if_cs_token, 'num']);
Context.primitives.insert('ifdim', [if_cs_token, 'dim']);
Context.primitives.insert('ifvmode', [if_cs_token, 'vmode']);
Context.primitives.insert('ifhmode', [if_cs_token, 'hmode']);
Context.primitives.insert('ifmmode', [if_cs_token, 'mmode']);
Context.primitives.insert('ifinner', [if_cs_token, 'inner']);
Context.primitives.insert('ifvoid', [if_cs_token, 'void']);
Context.primitives.insert('ifhbox', [if_cs_token, 'hbox']);
Context.primitives.insert('ifvbox', [if_cs_token, 'vbox']);
Context.primitives.insert('ifx', [if_cs_token, 'x']);
Context.primitives.insert('ifeof', [if_cs_token, 'eof']);
Context.primitives.insert('iftrue', [if_cs_token, 'true']);
Context.primitives.insert('iffalse', [if_cs_token, 'false']);
Context.primitives.insert('ifcase', [if_cs_token, 'case']);
Context.primitives.insert('or', [or_cs_token, '']);
Context.primitives.insert('else', [else_cs_token, '']);
Context.primitives.insert('fi', [fi_cs_token, '']);

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

  // // eslint-disable-next-line class-methods-use-this
  // private handleTokenList(context: Context, list: List<[term: number, value: string]>): Context {
  //   let ctx = context;
  //   let term: number;
  //   let value: string;
  //   for (let n: List<[term: number, value: string]> | null = list; n !== null; n = n.next) {
  //     [term, value] = n.value;
  //     ctx = this.handleTerm(ctx, term, value);
  //   }
  //   return context;
  // }

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
      case begingroup_cs: {
        return new Context(GroupType.SemiSimple, ctx.depth + 1, ctx);
      }
      case right_brace:
      case endgroup_cs: {
        return ctx.parent || ctx;
      }
      case double_math_shift:
      case single_math_shift: {
        return ctx.groupType !== GroupType.MathShift
          ? new Context(GroupType.MathShift, ctx.depth + 1, ctx)
          : (ctx.parent as Context);
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
      // case defcode_cs: {
      //   const chr = input.read(stack.ruleStart + 1, stack.pos);
      //   switch (chr) {
      //     case 'catcode':
      //       ctx.command = new CatCodeCommand();
      //   }
      //   break;
      // }
    }
    // if (ctx.command && ctx.command.ready) {
    //   return ctx.command.execute(ctx);
    // }
    return ctx;
  }
}

export const trackContext = new TeXContextTracker();
export const tokenizer = new Tokenizer();