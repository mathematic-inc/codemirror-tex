import { ContextTracker, Input, Stack } from 'lezer';
import Context, { BottomContext } from './context';
import { GroupType } from './enums';
import { Term } from './gen/terms';
import * as directives from './plugins/directives';

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
      case Term.makeatletter: {
        return ctx.catcode(cp`@`, 11);
      }
      case Term.makeatother: {
        return ctx.catcode(cp`@`, 12);
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
