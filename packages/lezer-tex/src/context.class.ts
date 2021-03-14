import { CatCode } from './catcode';

// We use mersenne primes to compactly hash.
const EQTB_HASH_SIZE = 19;
const EQTB_HASH_PRIME = 2 ** EQTB_HASH_SIZE - 1;
const EQTB_BASE_HASH_PRIME = 2 ** 8 + 1;

const PARENT_HASH_SIZE = 5;
const PARENT_HASH_PRIME = 2 ** PARENT_HASH_SIZE - 1;

const HASH_SIZE = 2 ** 31 - 1;
const MAX_DEPTH = 6;

export default class Context {
  /**
   * Each entry represents a Unicode code plane.
   */
  public eqtb: {
    catcode: Uint8Array;
  };

  public parent: Context | null;

  public depth: number;

  public reset = false;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #hash = 0;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #changed = true;

  constructor(parent: Context | null, depth: number) {
    this.parent = parent;
    this.depth = depth;

    if (this.parent) {
      this.eqtb = {
        catcode: new Uint8Array(this.parent.eqtb.catcode),
      };
    } else {
      this.eqtb = {
        catcode: new Uint8Array(2 ** 16 * 6).fill(12 + (12 << 4)),
      };
    }
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

  // ! TODO Cleanup surrogates
  public setCatCode(ch: number, cat: CatCode): void {
    if (ch >= 0x40000 && ch < 0xe0000) {
      throw new RangeError('Unicode point is valid, but unassigned');
    }
    if (ch > 0x10ffff) {
      throw new RangeError('Unicode point is invalid');
    }
    if (ch > 0xdffff) {
      // eslint-disable-next-line no-param-reassign
      ch -= 0xe0000 - 0x40000;
    }
    const i = Math.floor(ch / 2);
    if (ch % 2 === 0) {
      this.eqtb.catcode[i] &= 0b11110000;
      this.eqtb.catcode[i] += cat;
    } else {
      this.eqtb.catcode[i] &= 0b00001111;
      this.eqtb.catcode[i] += cat << 4;
    }
    this.#changed = true;
  }

  public getCatCode(ch: CatCode): CatCode {
    if (ch >= 0x40000 && ch < 0xe0000) {
      throw new RangeError('Unicode point is valid, but unassigned');
    }
    if (ch > 0x10ffff) {
      throw new RangeError('Unicode point is invalid');
    }
    if (ch > 0xdffff) {
      // eslint-disable-next-line no-param-reassign
      ch -= 0xe0000 - 0x40000;
    }
    if (ch % 2 === 0) {
      return this.eqtb.catcode[ch / 2] & 0b00001111;
    }
    return this.eqtb.catcode[(ch - 1) / 2] >> 4;
  }

  private generateEqTbHash(): number {
    let b = EQTB_BASE_HASH_PRIME;
    return (
      this.eqtb.catcode.reduce((h, v) => {
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
