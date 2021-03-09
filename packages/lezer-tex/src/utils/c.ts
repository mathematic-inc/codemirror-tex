// ! TODO: use a pre-evaluator
export default (s: TemplateStringsArray, v?: unknown): number =>
  (v ? `${v}` : s[0]).codePointAt(0) as number;
