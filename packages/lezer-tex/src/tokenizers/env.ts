/* Hand-written tokenizers for TeX. */
import { ExternalTokenizer } from 'lezer';
import escapeRegex from '../utils/escape-regex';
import { EnvEndCommand, Environment, MismatchedEnvEndCommand } from '../gen/terms';

const leftBrace = '{'.charCodeAt(0);
const rightBrace = '}'.charCodeAt(0);
const end = Uint8Array.from('\\end', (c) => c.charCodeAt(0));

// eslint-disable-next-line import/prefer-default-export
export const envEnd = new ExternalTokenizer(
  (input, token, stack) => {
    let pos = token.start;
    let tokEnd = pos;

    for (let next = input.get(pos), i = 0; next; i += 1, next = input.get(pos)) {
      if (next !== end[i] && i < end.length) return;

      if (i === end.length) break;
      else {
        pos += 1;
        tokEnd = pos;
      }
    }

    pos += 1;

    if (input.get(pos) !== leftBrace) return;

    pos += 1;

    const nameStart = pos;

    let nestLevel = 1;

    for (let next = input.get(pos); next >= 0; pos += 1, next = input.get(pos)) {
      if (next === leftBrace) nestLevel += 1;

      if (next === rightBrace) nestLevel -= 1;

      if (nestLevel === 0) break;

      pos += 1;
    }

    if (pos > nameStart + 1) {
      const name = input.read(nameStart, pos);
      const contextStart = stack.startOf([Environment]);

      if (contextStart >= 0) {
        if (
          !new RegExp(escapeRegex(name)).exec(
            input.read(contextStart, contextStart + name.length + 14)
          )
        ) {
          token.accept(MismatchedEnvEndCommand, tokEnd);

          return;
        }
      }
    }

    token.accept(EnvEndCommand, tokEnd);
  },
  { contextual: true }
);
