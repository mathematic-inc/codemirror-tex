import { ExternalTokenizer, Input, Stack, Token } from 'lezer';
import { CatCode, GroupType } from '../constants';
import { Dialect, Term } from '../gen/terms';
import isHex from '../utils/is-hex';
import State from './state';

export default class Tokenizer extends ExternalTokenizer {
  private state = {} as State;

  // Used for offsetting expanded characters
  private offset = 2;

  constructor() {
    super(
      (buf: Input, tok: Token, stk: Stack): void => {
        if (tok.start >= buf.length) {
          return undefined;
        }
        if (tok.start === 0) {
          this.state.dct = 0;
          if (stk.dialectEnabled(Dialect.tex)) this.state.dct |= 1;
          if (stk.dialectEnabled(Dialect.etex)) this.state.dct |= 2;
          if (stk.dialectEnabled(Dialect.pdftex)) this.state.dct |= 4;
          if (stk.dialectEnabled(Dialect.xetex)) this.state.dct |= 8;
          if (stk.dialectEnabled(Dialect.luatex)) this.state.dct |= 16;
          if (stk.dialectEnabled(Dialect.latex)) this.state.dct |= 128;
          if (stk.dialectEnabled(Dialect.directives)) this.state.dct |= 1024;

          this.state.buf = buf;
          this.state.stk = stk;
        }

        this.state.loc = tok.start;
        this.state.chr = buf.get(this.state.loc++);
        this.state.tok = tok;
        this.state.ctx = stk.context;
        return this.getNext();
      },
      { contextual: true }
    );
  }

  private getNext(): void {
    this.state.cmd = this.state.ctx.catcode(this.state.chr);
    switch (this.state.cmd) {
      case CatCode.LeftBrace: {
        this.state.tok.accept(Term.left_brace, this.state.loc);
        break;
      }
      case CatCode.RightBrace: {
        this.state.tok.accept(Term.right_brace, this.state.loc);
        break;
      }
      case CatCode.TabMark: {
        this.state.tok.accept(Term.tab_mark, this.state.loc);
        break;
      }
      case CatCode.CarRet: {
        this.state.tok.accept(Term.car_ret, this.state.loc);
        break;
      }
      case CatCode.SubMark: {
        this.state.tok.accept(Term.sub_mark, this.state.loc);
        break;
      }
      case CatCode.Ignore: {
        this.state.tok.accept(Term.ignore, this.state.loc);
        break;
      }
      case CatCode.Spacer: {
        this.state.tok.accept(Term.spacer, this.state.loc);
        break;
      }
      case CatCode.Letter: {
        this.state.tok.accept(Term.letter, this.state.loc);
        break;
      }
      case CatCode.ActiveChar: {
        this.state.tok.accept(Term.active_char, this.state.loc);
        break;
      }
      case CatCode.OtherChar: {
        this.state.tok.accept(Term.other_char, this.state.loc);
        break;
      }
      case CatCode.MacParam: {
        this.state.tok.accept(Term.mac_param, this.state.loc);
        break;
      }
      case CatCode.InvalidChar: {
        this.state.tok.accept(Term.invalid_char, this.state.loc);
        break;
      }
      case CatCode.MathShift: {
        if (this.nextIsMathShift()) {
          this.state.loc += 1;
          this.state.tok.accept(
            this.state.ctx.groupType === GroupType.DoubleMathShift
              ? Term.right_double_math_shift
              : Term.left_double_math_shift,
            this.state.loc
          );
          break;
        }
        this.state.tok.accept(
          this.state.ctx.groupType === GroupType.MathShift
            ? Term.right_math_shift
            : Term.left_math_shift,
          this.state.loc
        );
        break;
      }
      case CatCode.Escape: {
        this.scanControlSequence();
        const [code, sdct] = this.state.ctx.command(this.state.cs);
        if (!this.state.stk.canShift(code) || (sdct !== 0 && (this.state.dct & sdct) === 0)) {
          this.state.tok.accept(Term.control_sequence_token, this.state.loc);
          break;
        }
        this.state.tok.accept(code, this.state.loc);
        break;
      }
      case CatCode.Comment: {
        if ((this.state.dct & 1024) > 0 && this.nextIsDirective()) {
          this.scanComment();
          this.state.tok.accept(Term.directive_comment, this.state.loc);
          break;
        }
        this.scanComment();
        this.state.tok.accept(Term.line_comment, this.state.loc);
        break;
      }
      case CatCode.SupMark: {
        if (this.nextIsExpandedCharacter()) {
          this.scanExpandedCharacter();
          this.state.loc += this.offset;
          this.getNext();
          break;
        }
        this.state.tok.accept(Term.sup_mark, this.state.loc);
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
    if (this.state.loc >= this.state.buf.length) {
      return;
    }

    // Get the first cs character and increment location.
    this.state.chr = this.state.buf.get(this.state.loc++);
    // Get the first character's category code
    this.state.cmd = this.state.ctx.catcode(this.state.chr);
    // Add the current character to a number array.
    const cs = [this.state.chr];

    // If the first cs character is a sup_mark, check for an expanded character and reduce before
    // continuing.
    if (this.state.cmd === CatCode.SupMark && this.nextIsExpandedCharacter()) {
      this.scanExpandedCharacter();
      this.state.loc += this.offset;
      this.state.cmd = this.state.ctx.catcode(this.state.chr);
      cs[0] = this.state.chr;
    }

    // Return if the control sequence is a nonletter.
    if (this.state.cmd !== CatCode.Letter) {
      this.state.cs = String.fromCodePoint(...cs);
      return;
    }

    do {
      // Get the nth character and increment location.
      this.state.chr = this.state.buf.get(this.state.loc++);
      // Get the nth character's category code.
      this.state.cmd = this.state.ctx.catcode(this.state.chr);
      // Add the nth character to the cs string.
      cs.push(this.state.chr);

      // If the nth character is a sup_mark, check for an expanded character and reduce (or break) before
      // continuing.
      if (this.state.cmd === CatCode.SupMark && this.nextIsExpandedCharacter()) {
        this.scanExpandedCharacter();
        this.state.cmd = this.state.ctx.catcode(this.state.chr);
        if (this.state.cmd === CatCode.Letter) {
          cs.push(this.state.chr);
          this.state.loc += this.offset;
        }
      }
    } while (this.state.cmd === CatCode.Letter);

    // Decrement location because the current location will always be the nonletter.
    this.state.loc -= 1;
    // Pop the last element because this will always be the nonletter.
    cs.pop();
    // Set the control sequence.
    this.state.cs = String.fromCodePoint(...cs);
  }

  /**
   * Reduces an expanded character, e.g. ^^? to \<delete\>.
   *
   * @returns - The code point encoded by the expanded character.
   */
  private scanExpandedCharacter() {
    this.offset = 2;
    this.state.chr = this.state.buf.get(this.state.loc + 1);
    if (isHex(this.state.chr)) {
      const cc = this.state.buf.get(this.state.loc + 2);
      if (isHex(cc)) {
        this.offset += 1;
        this.state.chr = parseInt(`0x${String.fromCharCode(this.state.chr, cc)}`, 16);
        return;
      }
    }
    this.state.chr = this.state.chr < 0o100 ? this.state.chr + 0o100 : this.state.chr - 0o100;
  }

  /**
   * Scans a comment.
   */
  private scanComment() {
    do {
      this.state.chr = this.state.buf.get(this.state.loc++);
    } while (this.state.chr > -1 && this.state.ctx.catcode(this.state.chr) !== CatCode.CarRet);
  }

  /**
   * Checks if the comment is a directive.
   * @returns a flag
   */
  private nextIsDirective = (): boolean => {
    return this.state.buf.get(this.state.loc) === cp`!`;
  };

  /**
   * Checks if the next character is a math shift.
   * @returns a flag
   */
  private nextIsMathShift = (): boolean => {
    return this.state.ctx.catcode(this.state.buf.get(this.state.loc)) === CatCode.MathShift;
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
    if (this.state.ctx.catcode(this.state.buf.get(this.state.loc)) !== CatCode.SupMark) {
      return false;
    }
    const c = this.state.buf.get(this.state.loc + 1);
    return c > 0 && c < 0o200;
  }
}
