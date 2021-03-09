// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus, max-classes-per-file, no-param-reassign, import/prefer-default-export */
/* Hand-written tokenizers for TeX. */
import { ContextTracker, ExternalTokenizer, Input, Token } from 'lezer';
import {
  escape,
  left_brace,
  right_brace,
  math_shift,
  tab_mark,
  car_ret,
  mac_param,
  sup_mark,
  sub_mark,
  ignore,
  spacer,
  letter,
  other_char,
  active_char,
  comment,
  invalid_char,
  line_comment,
  control_sequence,
  directive,
} from '../gen/terms';
import c from '../utils/c';
import isHex from '../utils/is-hex';

class EqTb {
  public static clone(eqtb: EqTb): EqTb {
    const clone = new EqTb();
    Object.entries(eqtb.storage).forEach(([key, value]) => {
      clone.storage[+key] = value;
    });
    return clone;
  }

  private storage: { [char: number]: number } = {};

  public set(char: number, code: number): void {
    this.storage[char] = code;
  }

  public is(char: number, code: number): boolean {
    return this.storage[char] === code;
  }
}

const catcode = [
  escape,
  left_brace,
  right_brace,
  math_shift,
  tab_mark,
  car_ret,
  mac_param,
  sup_mark,
  sub_mark,
  ignore,
  spacer,
  letter,
  other_char,
  active_char,
  comment,
  invalid_char,
];

const baseEqTb = new EqTb();
baseEqTb.set(c`\\`, escape);
baseEqTb.set(c`{`, left_brace);
baseEqTb.set(c`}`, right_brace);
baseEqTb.set(c`$`, math_shift);
baseEqTb.set(c`&`, tab_mark);
baseEqTb.set(c`\r`, car_ret);
baseEqTb.set(c`\n`, car_ret);
baseEqTb.set(c`#`, mac_param);
baseEqTb.set(c`^`, sup_mark);
baseEqTb.set(c`_`, sub_mark);
baseEqTb.set(c`\x00`, ignore);
baseEqTb.set(c` `, spacer);
for (let i = c`A`; i <= c`Z`; i++) {
  baseEqTb.set(i, letter);
  baseEqTb.set(i - c`A` + c`a`, letter);
}
baseEqTb.set(c`~`, active_char);
baseEqTb.set(c`%`, comment);
baseEqTb.set(c`\x7F`, invalid_char);

class Context {
  public eqtb: EqTb;

  public parent: Context | null;

  public depth: number;

  public hash: number;

  constructor(parent: Context | null, depth: number) {
    this.parent = parent;
    this.depth = depth;
    if (parent) {
      // eslint-disable-next-line no-bitwise
      this.hash = parent.hash + (parent.hash << 16) + depth + (depth << 8);
      this.eqtb = EqTb.clone(parent.eqtb);
    } else {
      // eslint-disable-next-line no-bitwise
      this.hash = depth + (depth << 8);
      this.eqtb = EqTb.clone(baseEqTb);
    }
  }
}

const baseContext = new Context((null as unknown) as Context, 0);

function directiveCatCode(dir: string, context: Context) {
  const match = /Change category code for code point (.*?) to (.*?)\./.exec(dir);
  if (match) {
    // eslint-disable-next-line radix
    const cp = parseInt(match[1]);
    // eslint-disable-next-line radix
    const cc = parseInt(match[2]);
    context.eqtb.set(cp, catcode[cc]);
  }
}

export const trackContext = new ContextTracker<Context | null>({
  start: baseContext,
  shift(context: Context, term, input, stack) {
    switch (term) {
      case left_brace: {
        return new Context(context, context.depth + 1);
      }
      case right_brace: {
        return context.parent;
      }
      case directive: {
        const dir = input.read(stack.ruleStart, stack.pos).trim().slice(2).trimStart();
        directiveCatCode(dir, context);
        return context;
      }
      default: {
        return context;
      }
    }
  },
  hash(context: Context) {
    return context.hash;
  },
});

class EOFError extends Error {}

const getNonEOF = (input: Input, i: number): number => {
  const cp = input.get(i);
  if (cp < 0) {
    throw new EOFError();
  }
  return cp;
};

class TeXTokenizer extends ExternalTokenizer {
  constructor() {
    super(
      (input, token, stack) => {
        try {
          return this.tokenize(
            input,
            token,
            stack.context,
            token.start,
            getNonEOF(input, token.start)
          );
        } catch {
          return undefined;
        }
      },
      { contextual: true }
    );
  }

  private tokenize(input: Input, token: Token, context: Context, pos: number, cp: number): void {
    switch (true) {
      case context.eqtb.is(cp, escape): {
        pos = this.scanControlSequence(input, pos + 1, context);
        return token.accept(control_sequence, pos);
      }
      case context.eqtb.is(cp, left_brace): {
        return token.accept(left_brace, pos + 1);
      }
      case context.eqtb.is(cp, right_brace): {
        return token.accept(right_brace, pos + 1);
      }
      case context.eqtb.is(cp, math_shift): {
        return token.accept(math_shift, pos + 1);
      }
      case context.eqtb.is(cp, tab_mark): {
        return token.accept(tab_mark, pos + 1);
      }
      case context.eqtb.is(cp, car_ret): {
        return token.accept(car_ret, pos + 1);
      }
      case context.eqtb.is(cp, mac_param): {
        return token.accept(mac_param, pos + 1);
      }
      case context.eqtb.is(cp, sup_mark): {
        if (this.isExpandedCharacter(input, pos, context)) {
          [pos, cp] = this.reduceExpandedCharacter(input, pos + 2);
          return this.tokenize(input, token, context, pos, cp);
        }
        return token.accept(sup_mark, pos + 1);
      }
      case context.eqtb.is(cp, sub_mark): {
        return token.accept(sub_mark, pos + 1);
      }
      case context.eqtb.is(cp, ignore): {
        return token.accept(ignore, pos + 1);
      }
      case context.eqtb.is(cp, spacer): {
        return token.accept(spacer, pos + 1);
      }
      case context.eqtb.is(cp, letter): {
        return token.accept(letter, pos + 1);
      }
      case context.eqtb.is(cp, other_char): {
        return token.accept(other_char, pos + 1);
      }
      case context.eqtb.is(cp, active_char): {
        return token.accept(active_char, pos + 1);
      }
      case context.eqtb.is(cp, comment): {
        let isDirective = false;
        if (this.isDirective(input, pos + 1)) isDirective = true;
        pos = this.scanComment(input, pos + 1, context);
        return token.accept(isDirective ? directive : line_comment, pos + 1);
      }
      case context.eqtb.is(cp, invalid_char): {
        return token.accept(invalid_char, pos + 1);
      }
      default: {
        return token.accept(other_char, pos + 1);
      }
    }
  }

  /**
   * Scans a control sequence.
   *
   * @param input - The input to scan from.
   * @param pos - The position after an escape character.
   * @returns the position *after* the last character of the control sequence.
   */
  private scanControlSequence(input: Input, pos: number, context: Context): number {
    let cp = getNonEOF(input, pos);
    let npos: number;
    // If the character is an expanded character, reduce before continuing scan.
    if (context.eqtb.is(cp, sup_mark) && this.isExpandedCharacter(input, pos, context)) {
      [pos, cp] = this.reduceExpandedCharacter(input, pos + 2);
    }
    if (!context.eqtb.is(cp, letter)) {
      return pos + 1;
    }
    for (cp = input.get(++pos); ; cp = input.get(++pos)) {
      if (!context.eqtb.is(cp, letter)) break;
      if (context.eqtb.is(cp, sup_mark) && this.isExpandedCharacter(input, pos, context)) {
        [npos, cp] = this.reduceExpandedCharacter(input, pos + 2);
        if (!context.eqtb.is(cp, letter)) break;
        pos = npos;
      }
    }
    return pos;
  }

  /**
   * Scans a line comment.
   *
   * @param input - The input to scan from.
   * @param pos - The position after a comment character.
   * @returns the position of the last character of the comment.
   */
  private scanComment = (input: Input, pos: number, context: Context): number => {
    for (let cp = input.get(pos); cp > -1 && !context.eqtb.is(cp, car_ret); cp = input.get(++pos));
    return pos;
  };

  /**
   * Checks if the line comment is a directive.
   *
   * @param input - The input to scan from.
   * @param pos - The position after a comment character.
   * @returns a flag
   */
  private isDirective = (input: Input, pos: number): boolean => {
    return input.get(pos) === c`!`;
  };

  /**
   * Checks if the next inputs make up an expanded character, e.g. ^^?.
   *
   * This only checks the characters after the first sup_mark, so a sup_mark check should be done
   * before calling this method.
   *
   * @param input - The input to use.
   * @param pos - The current position of the cursor.
   * @returns a flag
   */
  private isExpandedCharacter = (input: Input, pos: number, context: Context): boolean => {
    const cp = input.get(pos + 2);
    return context.eqtb.is(input.get(pos + 1), sup_mark) && cp > -1 && cp < 0o200;
  };

  /**
   * Reduces an expanded character, e.g. ^^? to \<delete\>.
   *
   * @param input - The input to use.
   * @param pos - The position of the expanded character code, i.e. the position of the hex/char
   * after ^^.
   * @returns the position of the last character of the expanded character and the code point
   * encoded by the expanded character.
   */
  private reduceExpandedCharacter = (input: Input, pos: number): [pos: number, cp: number] => {
    let cp = input.get(pos);
    if (isHex(cp)) {
      const nextcp = input.get(pos + 1);
      if (isHex(nextcp)) {
        cp = parseInt(String.fromCharCode(cp, nextcp), 16);
        return [pos + 1, cp];
      }
    }
    cp = cp < 0o100 ? cp + 0o100 : cp - 0o100;
    return [pos, cp];
  };
}

export const catcodes = new TeXTokenizer();
