/* Hand-written tokenizers for TeX. */
import { ExternalTokenizer } from "lezer";
import { VerbContent, VerbatimContent } from "./terms";

export const verbContent = new ExternalTokenizer(
  (input, token) => {
    const deliminator = input.get(token.start - 1);

    let pos = token.start;

    for (let next = input.get(pos); next >= 0; pos += 1, next = input.get(pos)) {
      if (next === deliminator) {
        return token.accept(VerbContent, pos);
      }
    }

    return undefined;
  },
  { contextual: true }
);

const endVerbatim = Uint8Array.from("\\end{verbatim", (c) => c.charCodeAt(0));

export const verbatimContent = new ExternalTokenizer(
  (input, token) => {
    let pos = token.start + 1;

    for (let i = 0, next = input.get(pos); next >= 0; pos += 1, next = input.get(pos)) {
      // eslint-disable-next-line no-labels
      maybe: if (next === endVerbatim[i]) {
        // eslint-disable-next-line no-param-reassign
        token.end = pos - 1;

        for (i += 1, pos += 1; i < endVerbatim.length; i += 1, pos += 1) {
          if (input.get(pos) !== endVerbatim[i]) {
            i = 0;
            // eslint-disable-next-line no-labels
            break maybe;
          }
        }

        switch (input.get(pos)) {
          case "}".charCodeAt(0):
            return token.accept(VerbatimContent, token.end);
          case "*".charCodeAt(0):
            pos += 1;

            if (input.get(pos) === "}".charCodeAt(0)) {
              return token.accept(VerbatimContent, token.end);
            }

            break;
          default:
        }
      }
    }

    return undefined;
  },
  { contextual: true }
);
