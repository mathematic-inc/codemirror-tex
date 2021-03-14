// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus, no-param-reassign, @typescript-eslint/no-shadow  */
// eslint-disable-next-line max-classes-per-file
import { ExternalTokenizer, Input, Stack, Token } from 'lezer';
import { CatCode, catcode } from './catcode';
import Context from './context.class';
import {
  control_sequence_token,
  Dialect_directives,
  directive_comment,
  line_comment,
} from './gen/terms';
import getNonEOF from './get-non-eof';
import c from './utils/c';
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

  constructor() {
    super(() => undefined, { contextual: true });
  }

  public token(buf: Input, tok: Token, stk: Stack): void {
    try {
      let dct = 0;
      if (stk.dialectEnabled(Dialect_directives)) {
        dct |= 1;
      }
      this.#state = new State({
        chr: getNonEOF(buf, tok.start),
        loc: tok.start + 1,
        buf,
        tok,
        ctx: stk.context,
        dct,
      });
      return this.getNext();
    } catch {
      return undefined;
    }
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
          let offset: number;
          [offset, this.#state.chr] = this.getExpandedCharacter();
          this.#state.loc += offset;
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
    let cat = this.#state.ctx.getCatCode(this.#state.chr);

    // Store an offset for expanded characters.
    let offset = 0;
    // If the first cs character is a sup_mark, check for an expanded character and reduce before
    // continuing.
    if (cat === CatCode.SupMark && this.nextIsExpandedCharacter()) {
      [offset, this.#state.chr] = this.getExpandedCharacter();
      this.#state.loc += offset;
      cat = this.#state.ctx.getCatCode(this.#state.chr);
    }

    // Return if the control sequence is a nonletter.
    if (cat !== CatCode.Letter) return;

    do {
      // Get the nth character and increment location.
      this.#state.chr = this.#state.buf.get(this.#state.loc++);
      // Get the nth character's category code
      cat = this.#state.ctx.getCatCode(this.#state.chr);

      // If the nth character is a sup_mark, check for an expanded character and reduce (or break) before
      // continuing.
      if (cat === CatCode.SupMark && this.nextIsExpandedCharacter()) {
        [offset, this.#state.chr] = this.getExpandedCharacter();
        cat = this.#state.ctx.getCatCode(this.#state.chr);
        if (cat === CatCode.Letter) {
          this.#state.loc += offset;
        }
      }
    } while (cat === CatCode.Letter);

    // Decrement location because the current location will always be the nonletter.
    this.#state.loc -= 1;
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
    return this.#state.buf.get(this.#state.loc) === c`!`;
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
   * @returns the offset and the code point encoded by the expanded character.
   */
  private getExpandedCharacter(): [offset: number, chr: number] {
    let o = 2;
    let c = this.#state.buf.get(this.#state.loc + 1);
    if (isHex(c)) {
      const cc = this.#state.buf.get(this.#state.loc + 2);
      if (isHex(cc)) {
        o += 1;
        c = parseInt(`0x${String.fromCharCode(c, cc)}`, 16);
        return [o, c];
      }
    }
    c = c < 0o100 ? c + 0o100 : c - 0o100;
    return [o, c];
  }
}
