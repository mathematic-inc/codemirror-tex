// ! TODO: use a pre-evaluator
export default function c(s: TemplateStringsArray, v?: unknown): number {
  return (v ? `${v}` : s[0]).codePointAt(0) as number;
}
