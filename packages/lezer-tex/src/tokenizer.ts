// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus, no-param-reassign, @typescript-eslint/no-shadow  */
// eslint-disable-next-line max-classes-per-file
import { ExternalTokenizer, Input, Stack, Token } from 'lezer';
import { CatCode, catcode } from './enums/catcode';
import Context from './context';
import {
  control_sequence_token,
  Dialect_directives,
  directive_comment,
  line_comment,
} from './gen/terms';
import cp from './utils/c';
import isHex from './utils/is-hex';

interface StateSpec {
  // The current character
  chr: number;

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
}

class State {
  public cs!: string;

  public chr: number;

  public cmd!: number;

  public loc: number;

  public buf: Input;

  public tok: Token;

  public ctx: Context;

  public dct: number;

  constructor(spec: StateSpec) {
    this.chr = spec.chr;
    this.loc = spec.loc;
    this.buf = spec.buf;
    this.tok = spec.tok;
    this.ctx = spec.ctx;
    this.dct = spec.dct;
  }
}

export default class Tokenizer extends ExternalTokenizer {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #state!: State;

  // Used for offsetting.
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #offset = 2;

  constructor() {
    super(
      (buf: Input, tok: Token, stk: Stack): void => {
        if (tok.start === 0) {
          stk.context.reset = true;
        }
        if (tok.start >= buf.length) {
          return undefined;
        }
        let dct = 0;
        if (stk.dialectEnabled(Dialect_directives)) {
          dct |= 1;
        }
        this.#state = new State({
          chr: buf.get(tok.start),
          loc: tok.start + 1,
          buf,
          tok,
          ctx: stk.context,
          dct,
        });
        return this.getNext();
      },
      { contextual: true }
    );
  }

  private getNext(): void {
    this.#state.cmd = this.#state.ctx.getCatCode(this.#state.chr);
    switch (this.#state.cmd) {
      case CatCode.LeftBrace:
      case CatCode.RightBrace:
      case CatCode.MathShift:
      case CatCode.TabMark:
      case CatCode.CarRet:
      case CatCode.MacParam:
      case CatCode.SubMark:
      case CatCode.Ignore:
      case CatCode.Spacer:
      case CatCode.Letter:
      case CatCode.OtherChar:
      case CatCode.ActiveChar:
      case CatCode.InvalidChar: {
        this.#state.tok.accept(catcode[this.#state.cmd], this.#state.loc);
        break;
      }
      case CatCode.Escape: {
        this.scanControlSequence();
        const cs = Context.primitives.lookup(this.#state.cs);
        if (cs !== null) {
          this.#state.tok.accept(cs[0], this.#state.loc);
          break;
        }
        this.#state.tok.accept(control_sequence_token, this.#state.loc);
        break;
      }
      case CatCode.Comment: {
        if ((this.#state.dct & 1) > 0 && this.nextIsDirective()) {
          this.scanComment();
          this.#state.tok.accept(directive_comment, this.#state.loc);
          break;
        }
        this.scanComment();
        this.#state.tok.accept(line_comment, this.#state.loc);
        break;
      }
      case CatCode.SupMark: {
        if (this.nextIsExpandedCharacter()) {
          this.scanExpandedCharacter();
          this.#state.loc += this.#offset;
          this.getNext();
          break;
        }
        this.#state.tok.accept(catcode[this.#state.cmd], this.#state.loc);
        break;
      }
      default: {
        throw new Error('Unknown character');
      }
    }
  }

  /**
   * Scans a control sequence.
   */
  private scanControlSequence() {
    if (this.#state.loc >= this.#state.buf.length) {
      return;
    }

    // Get the first cs character and increment location.
    this.#state.chr = this.#state.buf.get(this.#state.loc++);
    // Get the first character's category code
    this.#state.cmd = this.#state.ctx.getCatCode(this.#state.chr);
    // Add the current character to a number array.
    const cs = [this.#state.chr];

    // If the first cs character is a sup_mark, check for an expanded character and reduce before
    // continuing.
    if (this.#state.cmd === CatCode.SupMark && this.nextIsExpandedCharacter()) {
      this.scanExpandedCharacter();
      this.#state.loc += this.#offset;
      this.#state.cmd = this.#state.ctx.getCatCode(this.#state.chr);
      cs[0] = this.#state.chr;
    }

    // Return if the control sequence is a nonletter.
    if (this.#state.cmd !== CatCode.Letter) {
      this.#state.cs = String.fromCodePoint(...cs);
      return;
    }

    do {
      // Get the nth character and increment location.
      this.#state.chr = this.#state.buf.get(this.#state.loc++);
      // Get the nth character's category code.
      this.#state.cmd = this.#state.ctx.getCatCode(this.#state.chr);
      // Add the nth character to the cs string.
      cs.push(this.#state.chr);

      // If the nth character is a sup_mark, check for an expanded character and reduce (or break) before
      // continuing.
      if (this.#state.cmd === CatCode.SupMark && this.nextIsExpandedCharacter()) {
        this.scanExpandedCharacter();
        this.#state.cmd = this.#state.ctx.getCatCode(this.#state.chr);
        if (this.#state.cmd === CatCode.Letter) {
          cs.push(this.#state.chr);
          this.#state.loc += this.#offset;
        }
      }
    } while (this.#state.cmd === CatCode.Letter);

    // Decrement location because the current location will always be the nonletter.
    this.#state.loc -= 1;
    // Pop the last element because this will always be the nonletter.
    cs.pop();
    // Set the control sequence.
    this.#state.cs = String.fromCodePoint(...cs);
  }

  /**
   * Scans a comment.
   */
  private scanComment() {
    do {
      this.#state.chr = this.#state.buf.get(this.#state.loc++);
    } while (
      this.#state.chr > -1 &&
      this.#state.ctx.getCatCode(this.#state.chr) !== CatCode.CarRet
    );
  }

  /**
   * Checks if the comment is a directive.
   * @returns a flag
   */
  private nextIsDirective = (): boolean => {
    return this.#state.buf.get(this.#state.loc) === cp`!`;
  };

  /**
   * Checks if the next inputs make up an expanded character, e.g. ^^?.
   *
   * This only checks the characters after the first sup_mark, so a sup_mark check should be done
   * before calling this method.
   *
   * @returns a flag
   */
  private nextIsExpandedCharacter(): boolean {
    if (this.#state.ctx.getCatCode(this.#state.buf.get(this.#state.loc)) !== CatCode.SupMark) {
      return false;
    }
    const c = this.#state.buf.get(this.#state.loc + 1);
    return c > 0 && c < 0o200;
  }

  /**
   * Reduces an expanded character, e.g. ^^? to \<delete\>.
   *
   * @returns - The code point encoded by the expanded character.
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private scanExpandedCharacter() {
    this.#offset = 2;
    this.#state.chr = this.#state.buf.get(this.#state.loc + 1);
    if (isHex(this.#state.chr)) {
      const cc = this.#state.buf.get(this.#state.loc + 2);
      if (isHex(cc)) {
        this.#offset += 1;
        this.#state.chr = parseInt(`0x${String.fromCharCode(this.#state.chr, cc)}`, 16);
      }
    }
    this.#state.chr = this.#state.chr < 0o100 ? this.#state.chr + 0o100 : this.#state.chr - 0o100;
  }
}
