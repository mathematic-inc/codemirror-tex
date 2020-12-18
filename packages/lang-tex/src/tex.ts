import { styleTags, tags as t } from '@codemirror/highlight';
import {
  flatIndent,
  foldInside,
  foldNodeProp,
  indentNodeProp,
  LanguageSupport,
  LezerLanguage,
  TreeIndentContext,
} from '@codemirror/language';
import parser from 'lezer-tex';

function simpleIndent(units = 1) {
  return (context: TreeIndentContext) => {
    return context.baseIndent + context.unit * units;
  };
}

/**
 * A language provider based on the [Lezer TeX
 * parser](https://github.com/mu-io/codemirror-tex/tree/main/packages/lezer-tex), extended with
 * language-specific information.
 */
export const texLanguage = LezerLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        SimpleGroup: simpleIndent(),
        SemiSimpleGroup: simpleIndent(),
        MathShiftGroup: flatIndent,
      }),
      foldNodeProp.add({
        'SimpleGroup SemiSimpleGroup MathShiftGroup': foldInside,
      }),
      styleTags({
        'comment': t.lineComment,
        'directive': t.processingInstruction,

        'left_brace right_brace': t.brace,
        'begingroup endgroup': t.controlKeyword,

        'active_char': t.atom,
        'invalid_char': t.invalid,

        ['left_math_shift left_double_math_shift ' +
        'right_math_shift right_double_math_shift']: t.bracket,

        'control_sequence': t.keyword,
        'primitive': t.atom,

        'macro_parameter': t.definitionOperator,
        'optional_equal': t.definitionOperator,

        'integer': t.number,
        'sign': t.arithmeticOperator,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: '%' },
  },
});

interface LanguageOptions {
  directives?: boolean;
  dialect?: 'tex' | 'latex' | 'xetex';
}

// TeX language support.
export function tex({ directives, dialect }: LanguageOptions = {}): LanguageSupport {
  let lang = texLanguage;
  const dialects: string[] = [];
  if (directives) {
    dialects.push('directives');
  }
  switch (dialect) {
    case 'latex':
      dialects.push('latex');
      break;
    case 'xetex':
      dialects.push('xetex');
      break;
  }
  lang = texLanguage.configure({ dialect: dialects.join(' ') });
  return new LanguageSupport(lang);
}
