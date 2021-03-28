import { Input, Stack, Token } from 'lezer';
import Context from '../tracker/context';

export default interface State {
  // The current control sequence
  cs: string;

  // The current character
  chr: number;

  // The current command
  cmd: number;

  // The current location
  loc: number;

  // The current input buffer
  buf: Input;

  // The current token
  tok: Token;

  // The current context
  ctx: Context;

  // The current dialects
  dct: number;

  // The current stack
  stk: Stack;
}
