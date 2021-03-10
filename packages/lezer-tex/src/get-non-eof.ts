import { Input } from 'lezer';
import EOFError from './eof.error';

export default function getNonEOF(input: Input, i: number): number {
  const cp = input.get(i);
  if (cp < 0) {
    throw new EOFError();
  }
  return cp;
}
