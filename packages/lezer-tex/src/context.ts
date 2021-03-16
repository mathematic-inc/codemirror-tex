// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-plusplus */
import { CatCode } from './enums/catcode';
import { GroupType } from './enums/group-type';
// eslint-disable-next-line import/no-cycle
import Command from './modules/commands/command';
import { Trie } from './utils/trie';

// We use mersenne primes to compactly hash.
const EQTB_HASH_SIZE = 19;
const EQTB_HASH_PRIME = 2 ** EQTB_HASH_SIZE - 1;
const EQTB_BASE_HASH_PRIME = 2 ** 8 + 1;

const PARENT_HASH_SIZE = 5;
const PARENT_HASH_PRIME = 2 ** PARENT_HASH_SIZE - 1;

const HASH_SIZE = 2 ** 31 - 1;
const MAX_DEPTH = 6;

export default class Context {
  public static primitives = new Trie<[cmd: number, chr: string] | null>(null);

  /**
   * Each entry represents a Unicode code plane.
   */
  public eqtb: {
    catcode: Uint8Array | number[];
  };

  public reset = false;

  public command: Command | null = null;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #hash = 0;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #changed = true;

  constructor(groupType: GroupType);
  constructor(groupType: GroupType, depth: number, parent: Context);
  constructor(public groupType: GroupType, public depth: number = 0, public parent?: Context) {
    if (depth !== undefined && parent !== undefined) {
      this.eqtb = { catcode: [] };
      return;
    }
    this.eqtb = {
      catcode: new Uint8Array(2 ** 16 * 6).fill(12 + (12 << 4)),
    };
  }

  public get hash(): number {
    // Hash caching mechanism
    if (this.#changed) {
      // Set changed state back to false.
      this.#changed = false;

      // Generate new hash
      this.#hash = this.generateHash();
    }
    return this.#hash;
  }

  public defineCatCode(chr: number, cmd: number): void {
    if (chr >= 0x40000 && chr < 0xe0000) {
      throw new RangeError('Unicode point is valid, but unassigned');
    }
    if (chr > 0x10ffff) {
      throw new RangeError('Unicode point is invalid');
    }
    if (chr > 0xdffff) {
      // eslint-disable-next-line no-param-reassign
      chr -= 0xe0000 - 0x40000;
    }
    const i = Math.floor(chr / 2);
    if (chr % 2 === 0) {
      this.eqtb.catcode[i] &= 0b11110000;
      this.eqtb.catcode[i] += cmd;
    } else {
      this.eqtb.catcode[i] &= 0b00001111;
      this.eqtb.catcode[i] += cmd << 4;
    }
    this.#changed = true;
  }

  /**
   * Gets the category code w.r.t a code point.
   *
   * @param ch - The code point
   * @returns - The category code for the code point.
   */
  public getCatCode(ch: number): CatCode {
    if (ch >= 0x40000 && ch < 0xe0000) {
      throw new RangeError('Unicode point is valid, but unassigned');
    }
    if (ch > 0x10ffff) {
      throw new RangeError('Unicode point is invalid');
    }
    if (ch < 0) {
      // A special catcode for negative numbers. Used for checking.
      return -1;
    }
    if (ch > 0xdffff) {
      // eslint-disable-next-line no-param-reassign
      ch -= 0xe0000 - 0x40000;
    }
    const i = Math.floor(ch / 2);

    // Find the catcode table with the `ch` value.
    let n = this as Context | undefined;
    while (n && n.eqtb.catcode[i] === undefined) {
      n = n.parent;
    }
    if (n === undefined) {
      throw new Error("this shouldn't happen");
    }

    if (ch % 2 === 0) {
      return n.eqtb.catcode[i] & 0b00001111;
    }
    return n.eqtb.catcode[i] >> 4;
  }

  private generateEqTbHash(): number {
    let b = EQTB_BASE_HASH_PRIME;
    return (
      (this.eqtb.catcode as number[]).reduce((h, v) => {
        b = (b * EQTB_BASE_HASH_PRIME) % EQTB_HASH_PRIME;
        return (h + v * b) % EQTB_HASH_PRIME;
      }, 0) <<
      (PARENT_HASH_SIZE + MAX_DEPTH)
    );
  }

  private generateHash(): number {
    let h = (this.parent ? this.parent.hash : 0) % PARENT_HASH_PRIME;
    h += this.depth << PARENT_HASH_SIZE;

    // Hash equivalence table.
    h += this.generateEqTbHash();

    // Shrink hash
    h %= HASH_SIZE;
    return h;
  }
}
