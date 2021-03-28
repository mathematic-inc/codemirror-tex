import { ContextTracker, Input, Stack } from 'lezer';
import Context, { BottomContext } from './context';
import { GroupType } from '../constants';
import { Term } from '../gen/terms';
import * as directives from '../plugins/directives';

class TermHandler<T> {
  constructor(public run: (ctx: Context, term: number, input: Input, stack: Stack) => T) {}
}

const directiveTermHandler = new TermHandler((ctx, term, input, stack) => {
  if (term === Term.directive) {
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
  return undefined;
});

const baseTermHandler = new TermHandler((ctx, term) => {
  switch (term) {
    case Term.left_brace:
      return new Context(GroupType.Simple, ctx.depth + 1, ctx);
    case Term.begingroup:
      return new Context(GroupType.SemiSimple, ctx.depth + 1, ctx);
    case Term.left_math_shift:
      return new Context(GroupType.MathShift, ctx.depth + 1, ctx);
    case Term.left_double_math_shift:
      return new Context(GroupType.DoubleMathShift, ctx.depth + 1, ctx);
    case Term.right_brace:
    case Term.endgroup:
    case Term.right_math_shift:
    case Term.right_double_math_shift: {
      return ctx.parent ?? ctx;
    }
  }
  return undefined;
});

const handlers = [baseTermHandler, directiveTermHandler];
const allTermHandler = new TermHandler((ctx, term, input, stack) => {
  let nctx: Context | undefined;
  for (const handler of handlers) {
    nctx = handler.run(ctx, term, input, stack);
    if (nctx !== undefined) return nctx;
  }
  return ctx;
});

export default class Tracker extends ContextTracker<Context | null> {
  constructor() {
    super({
      start: new BottomContext(),
      hash(ctx: Context) {
        return ctx.hash;
      },
      shift: allTermHandler.run,
      reduce: allTermHandler.run,
    });
  }
}
