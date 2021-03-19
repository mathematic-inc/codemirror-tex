import { ContextTracker, Input, Stack } from 'lezer';
import Context, { BottomContext } from './context';
import { GroupType } from './enums/group-type';
import { Term } from './gen/terms';
import * as directives from './modules/directives';

// Context.primitives.insert('begingroup', [begin_group, '']);
// Context.primitives.insert('endgroup', [end_group, '']);

// Context.primitives.insert('let', [_let, '']);
// Context.primitives.insert('futurelet', [futurelet, 'future']);

// Context.primitives.insert('catcode', [def_code, 'cat']);
// Context.primitives.insert('mathcode', [def_code, 'math']);
// Context.primitives.insert('lccode', [def_code, 'lc']);
// Context.primitives.insert('uccode', [def_code, 'uc']);
// Context.primitives.insert('sfcode', [def_code, 'sf']);
// Context.primitives.insert('delcode', [def_code, 'del']);

// Context.primitives.insert('long', [prefix, 'long']);
// Context.primitives.insert('outer', [prefix, 'outer']);
// Context.primitives.insert('global', [prefix, 'global']);

// Context.primitives.insert('def', [def, '']);
// Context.primitives.insert('edef', [def, 'e']);
// Context.primitives.insert('gdef', [def, 'g']);
// Context.primitives.insert('xdef', [def, 'x']);

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

export class Tracker extends ContextTracker<Context | null> {
  constructor() {
    super({
      start: new BottomContext(),
      hash(ctx: Context) {
        return ctx.hash;
      },
      shift: (ctx: Context, term: number, input: Input, stack: Stack) => {
        return this.handleTerm(ctx, term, input, stack);
      },
      reduce: (ctx: Context, term: number, input: Input, stack: Stack) => {
        return this.handleTerm(ctx, term, input, stack);
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private handleTerm(ctx: Context, term: number, input: Input, stack: Stack): Context {
    switch (term) {
      case Term.left_brace: {
        return new Context(GroupType.Simple, ctx.depth + 1, ctx);
      }
      case Term.begin_group: {
        return new Context(GroupType.SemiSimple, ctx.depth + 1, ctx);
      }
      case Term.left_math_shift: {
        return new Context(GroupType.MathShift, ctx.depth + 1, ctx);
      }
      case Term.left_double_math_shift: {
        return new Context(GroupType.DoubleMathShift, ctx.depth + 1, ctx);
      }
      case Term.right_brace:
      case Term.end_group:
      case Term.right_math_shift:
      case Term.right_double_math_shift: {
        return ctx.parent ?? ctx;
      }
      case Term.directive: {
        const instructions = input.read(stack.ruleStart + 2, stack.pos).trim();
        for (const dir of Object.values(directives)) {
          const updatedContext = dir.exec(instructions, ctx);
          if (updatedContext !== null) {
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
