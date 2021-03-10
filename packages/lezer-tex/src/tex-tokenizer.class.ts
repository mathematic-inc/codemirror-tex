// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus, no-param-reassign, @typescript-eslint/no-shadow  */
import { ExternalTokenizer, Input, Token } from 'lezer';
import { catcode } from './catcode';
import Context from './context.class';
import {
  active_char,
  car_ret,
  comment,
  control_sequence,
  Dialect_directives,
  directive as directiveTerm,
  escape,
  ignore,
  invalid_char,
  left_brace,
  letter,
  line_comment,
  mac_param,
  math_shift,
  other_char,
  right_brace,
  spacer,
  sub_mark,
  sup_mark,
  tab_mark,
} from './gen/terms';
import getNonEOF from './get-non-eof';
import c from './utils/c';
import isHex from './utils/is-hex';

export default class Tokenizer extends ExternalTokenizer {
  private curcs!: string;

  private curchr!: number;

  private curcmd!: number;

  private locc!: number;

  private inputt!: Input;

  private tokenn!: Token;

  private contextt!: Context;

  private hasDialect!: (id: number) => boolean;

  constructor() {
    super(
      (input, token, stack) => {
        if (token.start === 0) {
          (stack.context as Context).reset = true;
        }
        try {
          this.locc = token.start + 1;
          this.curchr = getNonEOF(input, token.start);
          this.curcs = '';
          this.inputt = input;
          this.tokenn = token;
          this.contextt = stack.context;
          this.hasDialect = stack.dialectEnabled.bind(stack);
          return this.getNext();
        } catch {
          return undefined;
        }
      },
      { contextual: true }
    );
  }

  private getNext(): void {
    this.curcmd = catcode[this.contextt.getCatCode(this.curchr)];
    switch (this.curcmd) {
      case escape: {
        this.scanControlSequence();
        this.contextt.storeControlSequence(this.curcs);
        this.tokenn.accept(control_sequence, this.locc);
        break;
      }
      case left_brace:
      case right_brace:
      case math_shift:
      case tab_mark:
      case car_ret:
      case mac_param:
      case sub_mark:
      case ignore:
      case spacer:
      case letter:
      case other_char:
      case active_char:
      case invalid_char: {
        this.tokenn.accept(this.curcmd, this.locc);
        break;
      }
      case comment: {
        if (this.hasDialect(Dialect_directives) && this.isDirective()) {
          this.scanComment();
          this.contextt.storeDirective(this.inputt.read(this.tokenn.start, this.locc));
          this.tokenn.accept(directiveTerm, this.locc);
          break;
        }
        this.scanComment();
        this.tokenn.accept(line_comment, this.locc);
        break;
      }
      case sup_mark: {
        let offset: number;
        if (this.hasExpandedCharacter()) {
          [offset, this.curchr] = this.getExpandedCharacter();
          this.locc += offset;
          this.getNext();
          break;
        }
        this.tokenn.accept(this.curcmd, this.locc);
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
    if (this.locc >= this.inputt.length) {
      return;
    }

    // Get the first cs character and increment location.
    this.curchr = this.inputt.get(this.locc++);

    // Store an offset for expanded characters.
    let offset = 0;

    // If the first cs character is a sup_mark, check for an expanded character and reduce before
    // continuing.
    if (
      catcode[this.contextt.getCatCode(this.curchr)] === sup_mark &&
      this.hasExpandedCharacter()
    ) {
      [offset, this.curchr] = this.getExpandedCharacter();
      this.locc += offset;
    }

    // Initialize the control sequence.
    this.curcs = String.fromCodePoint(this.curchr);

    // Get the first character's category code
    let cat = catcode[this.contextt.getCatCode(this.curchr)];

    // Return if the control sequence is a singleton.
    if (cat !== letter) return;

    // eslint-disable-next-line no-labels
    loop: for (;;) {
      // Get the nth character and increment location.
      this.curchr = this.inputt.get(this.locc++);

      // Get the nth character's category code
      cat = catcode[this.contextt.getCatCode(this.curchr)];

      // If the nth character is a sup_mark, check for an expanded character and reduce (or break) before
      // continuing.
      switch (cat) {
        case letter: {
          this.curcs += String.fromCodePoint(this.curchr);
          break;
        }
        case sup_mark: {
          if (this.hasExpandedCharacter()) {
            [offset, this.curchr] = this.getExpandedCharacter();
            if (catcode[this.contextt.getCatCode(this.curchr)] === letter) {
              this.locc += offset;
              this.curcs += String.fromCodePoint(this.curchr);
              break;
            }
          }
          // eslint-disable-next-line no-labels
          break loop;
        }
        default: {
          // eslint-disable-next-line no-labels
          break loop;
        }
      }
    }
    // Decrement location because the current location will always be the nonletter.
    this.locc -= 1;
  }

  /**
   * Scans a line comment.
   *
   * @returns the position of the last character of the comment.
   */
  private scanComment() {
    for (
      this.curchr = this.inputt.get(this.locc++);
      this.curchr > -1 && catcode[this.contextt.getCatCode(this.curchr)] !== car_ret;
      this.curchr = this.inputt.get(this.locc++)
    );
  }

  /**
   * Checks if the line comment is a directive.
   *
   * @param input - The input to scan from.
   * @param pos - The position after a comment character.
   * @returns a flag
   */
  private isDirective = (): boolean => {
    return this.inputt.get(this.locc) === c`!`;
  };

  /**
   * Checks if the next inputs make up an expanded character, e.g. ^^?.
   *
   * This only checks the characters after the first sup_mark, so a sup_mark check should be done
   * before calling this method.
   *
   * @returns a flag
   */
  private hasExpandedCharacter(): boolean {
    if (catcode[this.contextt.getCatCode(this.inputt.get(this.locc))] !== sup_mark) {
      return false;
    }
    const c = this.inputt.get(this.locc + 1);
    return c > 0 && c < 0o200;
  }

  /**
   * Reduces an expanded character, e.g. ^^? to \<delete\>.
   *
   * @returns the offset and the code point encoded by the expanded character.
   */
  private getExpandedCharacter(): [offset: number, chr: number] {
    let o = 2;
    let c = this.inputt.get(this.locc + 1);
    if (isHex(c)) {
      const cc = this.inputt.get(this.locc + 2);
      if (isHex(cc)) {
        o += 1;
        c = parseInt(String.fromCharCode(c, cc), 16);
        return [o, c];
      }
    }
    c = c < 0o100 ? c + 0o100 : c - 0o100;
    return [o, c];
  }
}
