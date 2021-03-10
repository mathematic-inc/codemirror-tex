// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus, max-classes-per-file, no-param-reassign, import/prefer-default-export */
/* Hand-written tokenizers for TeX. */
import { ContextTracker } from 'lezer';
import Context from './context.class';
import { directive as directiveTerm, left_brace, right_brace } from './gen/terms';
import * as directives from './modules/directives';
import Tokenizer from './tex-tokenizer.class';
import c from './utils/c';

function createTopLevelContext(): Context {
  const baseCtx = new Context((null as unknown) as Context, 0);
  baseCtx.setCatCode(c`\\`, 0);
  baseCtx.setCatCode(c`{`, 1);
  baseCtx.setCatCode(c`}`, 2);
  baseCtx.setCatCode(c`$`, 3);
  baseCtx.setCatCode(c`&`, 4);
  baseCtx.setCatCode(c`\r`, 5);
  baseCtx.setCatCode(c`\n`, 5);
  baseCtx.setCatCode(c`#`, 6);
  baseCtx.setCatCode(c`^`, 7);
  baseCtx.setCatCode(c`_`, 8);
  baseCtx.setCatCode(c`\x00`, 9);
  baseCtx.setCatCode(c` `, 10);
  for (let i = c`A`; i <= c`Z`; i++) {
    baseCtx.setCatCode(i, 11);
    baseCtx.setCatCode(i - c`A` + c`a`, 11);
  }
  baseCtx.setCatCode(c`~`, 13);
  baseCtx.setCatCode(c`%`, 14);
  baseCtx.setCatCode(c`\x7F`, 14);
  return baseCtx;
}

class TeXContextTracker extends ContextTracker<Context | null> {
  constructor() {
    super({
      start: createTopLevelContext(),
      hash(ctx: Context) {
        return ctx.hash;
      },
      shift(context: Context, term) {
        if (context.reset) {
          context = createTopLevelContext();
        }
        switch (term) {
          case left_brace: {
            return new Context(context, context.depth + 1);
          }
          case right_brace: {
            return context.parent;
          }
          case directiveTerm: {
            const directiveString = context.retrieveDirective().slice(2).trim();
            for (const directive of Object.values(directives)) {
              const updatedContext = directive.exec(directiveString, context);
              if (updatedContext) {
                context = updatedContext;
                if (!directive.fallthrough) break;
              }
            }
            return context;
          }
        }
        return context;
      },
    });
  }
}

export const trackContext = new TeXContextTracker();
export const tokenizer = new Tokenizer();
