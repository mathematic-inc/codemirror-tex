import { styleTags } from '@codemirror/highlight';
import {
  foldInside,
  foldNodeProp,
  indentNodeProp,
  LanguageSupport,
  LezerLanguage,
} from '@codemirror/language';
import parser from 'lezer-tex';

/**
 * A language provider based on the [Lezer TeX
 * parser](https://github.com/mu-io/codemirror-tex/tree/main/packages/lezer-tex), extended with
 * language-specific information.
 */
export const texLanguage = LezerLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({}),
      foldNodeProp.add({
        'simple_group semi_simple_group ordinary_math_mode display_math_mode': foldInside,
      }),
      styleTags({}),
    ],
  }),
  languageData: {
    commentTokens: { line: '%' },
  },
});

// TeX language support.
export function tex(): LanguageSupport {
  return new LanguageSupport(texLanguage);
}
