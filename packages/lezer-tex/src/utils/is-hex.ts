export default function isHex(ch: number): boolean {
  return (ch > 96 && ch < 103) || (ch > 47 && ch < 58);
}
