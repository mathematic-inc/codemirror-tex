import { CatCode, GroupType } from './enums';
import commands from './gen/commands';
import { Term } from './gen/terms';
import { lzwDecode } from './utils/lzw';
import { Trie } from './utils/trie';

const enum SpecialValue {
  LargePrime = 2 ** 13 - 1,
  SmallPrime = 2 ** 4 + 1,
  AllOtherChar = 0b11001100110011001100110011001100,
}

interface EquivalencyTable {
  catcode: number[];
  commands: Trie<[code: number, dialects: Term]>;
}

const cachePrimes: number[][] = [];
const controlSequenceCode: [code: number, dialects: Term] = [Term.control_sequence_token, 0];

export default class Context {
  public static clone(ctx: Context): Context {
    const c = new Context(ctx.groupType, ctx.depth, ctx.parent);
    Object.assign(c.eqtb.catcode, ctx.eqtb.catcode);
    c.eqtb.commands = ctx.eqtb.commands.clone();
    return c;
  }

  public eqtb: EquivalencyTable = { catcode: [], commands: new Trie() };

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
      cachePrimes[this.depth] = [p * 5, pp * SpecialValue.LargePrime];
    }
    [p, pp] = cachePrimes[this.depth];
    return (
      ((this.parent ? this.parent.hash : 0) + this.groupType * p + this.hashEQTB() * pp) %
      (2 ** 19 - 1)
    );
  }

  public hashEQTB(): number {
    let pp = SpecialValue.SmallPrime;
    let r = 0;
    let a: number;
    for (let i = 0; i < this.eqtb.catcode.length; i++) {
      a = this.eqtb.catcode[i] ?? SpecialValue.AllOtherChar;
      for (let j = 0; j < 8; j++) {
        pp *= SpecialValue.SmallPrime;
        pp %= SpecialValue.LargePrime;
        r += ((a & (0b1111 << (4 * j))) >>> (4 * j)) * pp;
        r %= SpecialValue.LargePrime;
      }
    }
    return r;
  }

  public catcode(chr: number): CatCode;
  public catcode(chr: number, code: CatCode): Context;
  public catcode(chr: number, code?: CatCode): CatCode | Context {
    if (chr > 0x10ffff) {
      throw new RangeError('Unicode point is invalid');
    }
    if (chr >= 0x40000 && chr < 0xe0000) {
      throw new RangeError('Unicode point is valid, but unassigned');
    }

    if (chr < 0) return -1;
    if (chr > 0xdffff) chr -= 0xe0000 - 0x40000;

    const i = Math.floor(chr / 8);
    const l = 4 * (chr % 8);

    // Find the entry in some parent.
    let cat = this.eqtb.catcode[i];
    for (let n = this.parent; n !== null && cat === undefined; n = n.parent) {
      cat = n.eqtb.catcode[i];
    }

    if (code === undefined) {
      return cat === undefined ? CatCode.OtherChar : (cat & (0b1111 << l)) >>> l;
    }

    const ctx = Context.clone(this);
    ctx.eqtb.catcode[i] =
      ((cat ?? SpecialValue.AllOtherChar) & (~(0b1111 << l) >>> 0)) + (code << l);
    return ctx;
  }

  public command(cs: string): [code: number, dialects: Term];
  public command(cs: string, code: number, dialect: number): Context;
  public command(
    cs: string,
    code?: number,
    dialect?: number
  ): [code: number, dialects: Term] | Context {
    if (code === undefined || dialect === undefined) {
      let g = this.eqtb.commands.lookup(cs);
      for (let n = this.parent; g === undefined && n !== null; n = n.parent) {
        g = n.eqtb.commands.lookup(cs);
      }
      return g === undefined ? controlSequenceCode : g;
    }

    const ctx = Context.clone(this);
    ctx.eqtb.commands.insert(cs, [code, dialect]);
    return ctx;
  }
}

export class BottomContext extends Context {
  constructor() {
    super(GroupType.Bottom);

    // Catcode
    this._catcode(cp`\\`, CatCode.Escape);
    this._catcode(cp`{`, CatCode.LeftBrace);
    this._catcode(cp`}`, CatCode.RightBrace);
    this._catcode(cp`$`, CatCode.MathShift);
    this._catcode(cp`&`, CatCode.TabMark);
    this._catcode(cp`\r`, CatCode.CarRet);
    this._catcode(cp`\n`, CatCode.CarRet);
    this._catcode(cp`#`, CatCode.MacParam);
    this._catcode(cp`^`, CatCode.SupMark);
    this._catcode(cp`_`, CatCode.SubMark);
    this._catcode(cp`\x00`, CatCode.Ignore);
    this._catcode(cp` `, CatCode.Spacer);
    this._catcode(cp`~`, CatCode.ActiveChar);
    this._catcode(cp`%`, CatCode.Comment);
    this._catcode(cp`\x7F`, CatCode.InvalidChar);
    for (let i = cp`A`; i <= cp`Z`; i++) {
      this._catcode(i, CatCode.Letter);
      this._catcode(i - cp`A` + cp`a`, CatCode.Letter);
    }

    // Commands
    this.eqtb.commands = Trie.deserialize(lzwDecode(commands));
  }

  private _catcode(chr: number, code: number): void {
    const i = Math.floor(chr / 8);
    const l = 4 * (chr % 8);
    // We are assuming here 8 values in a row to never be simultaneously 0.
    this.eqtb.catcode[i] =
      ((this.eqtb.catcode[i] ?? SpecialValue.AllOtherChar) & (~(0b1111 << l) >>> 0)) + (code << l);
  }
}
