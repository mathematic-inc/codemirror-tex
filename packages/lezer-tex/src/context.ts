import { CatCode } from './enums/catcode';
import { GroupType } from './enums/group-type';

const LARGE_PRIME = 2 ** 13 - 1;
const SMALL_PRIME = 2 ** 4 + 1;
const ALL_OTHER_CHAR = 0b11001100110011001100110011001100;
const cachePrimes: number[][] = [];

export default class Context {
  public static clone(ctx: Context): Context {
    const c = new Context(ctx.groupType, ctx.depth, ctx.parent);
    Object.assign(c.eqtb.catcode, ctx.eqtb.catcode);
    return c;
  }

  public eqtb: { catcode: number[] } = { catcode: [] };

  constructor(groupType: GroupType);
  constructor(groupType: GroupType, depth: number, parent: Context | null);
  constructor(
    public groupType: GroupType,
    public depth: number = 0,
    public parent: Context | null = null
  ) {}

  public get hash(): number {
    let p: number;
    let pp: number;
    if (!(this.depth in cachePrimes)) {
      [p, pp] = cachePrimes[this.depth - 1] ?? [1, 1];
      cachePrimes[this.depth] = [p * 5, pp * LARGE_PRIME];
    }
    [p, pp] = cachePrimes[this.depth];
    return (
      ((this.parent ? this.parent.hash : 0) + this.groupType * p + this.hashEQTB() * pp) %
      (2 ** 19 - 1)
    );
  }

  public hashEQTB(): number {
    let pp = SMALL_PRIME;
    let r = 0;
    let a: number;
    for (let i = 0; i < this.eqtb.catcode.length; i++) {
      a = this.eqtb.catcode[i] ?? ALL_OTHER_CHAR;
      for (let j = 0; j < 8; j++) {
        pp *= SMALL_PRIME;
        pp %= LARGE_PRIME;
        r += ((a & (0b1111 << (4 * j))) >>> (4 * j)) * pp;
        r %= LARGE_PRIME;
      }
    }
    return r;
  }

  public catcode(chr: number): CatCode;
  public catcode(chr: number, code: number): Context;
  public catcode(chr: number, code?: number): CatCode | Context {
    switch (true) {
      case chr >= 0x40000 && chr < 0xe0000:
        throw new RangeError('Unicode point is valid, but unassigned');
      case chr > 0x10ffff:
        throw new RangeError('Unicode point is invalid');
      case chr < 0:
        return -1;
      case chr > 0xdffff:
        chr -= 0xe0000 - 0x40000;
        break;
    }

    const i = Math.floor(chr / 8);
    const l = 4 * (chr % 8);

    // Find the entry in some parent.
    let n = this as Context | null;
    while (n !== null && n.eqtb.catcode[i] === undefined) {
      n = n.parent;
    }

    switch (code) {
      case undefined: {
        return n === null ? CatCode.OtherChar : (n.eqtb.catcode[i] & (0b1111 << l)) >>> l;
      }
      default: {
        const ctx = Context.clone(this);
        let t = n !== null ? n.eqtb.catcode[i] : ALL_OTHER_CHAR;
        t &= ~(0b1111 << l) >>> 0;
        t += code << l;
        ctx.eqtb.catcode[i] = t;
        return ctx;
      }
    }
  }
}

export class BottomContext extends Context {
  constructor() {
    super(GroupType.Bottom);
    let tmp = new Context(GroupType.Bottom);
    tmp = tmp.catcode(cp`\\`, 0);
    tmp = tmp.catcode(cp`{`, 1);
    tmp = tmp.catcode(cp`}`, 2);
    tmp = tmp.catcode(cp`$`, 3);
    tmp = tmp.catcode(cp`&`, 4);
    tmp = tmp.catcode(cp`\r`, 5);
    tmp = tmp.catcode(cp`\n`, 5);
    tmp = tmp.catcode(cp`#`, 6);
    tmp = tmp.catcode(cp`^`, 7);
    tmp = tmp.catcode(cp`_`, 8);
    tmp = tmp.catcode(cp`\x00`, 9);
    tmp = tmp.catcode(cp` `, 10);
    tmp = tmp.catcode(cp`~`, 13);
    tmp = tmp.catcode(cp`%`, 14);
    tmp = tmp.catcode(cp`\x7F`, 14);
    for (let i = cp`A`; i <= cp`Z`; i++) {
      tmp = tmp.catcode(i, 11);
      tmp = tmp.catcode(i - cp`A` + cp`a`, 11);
    }
    Object.assign(this.eqtb, tmp.eqtb);
  }
}
