import { Term } from './gen/terms';
import { CatCode, GroupType } from './enums';
import { Trie } from './utils/trie';

const enum SpecialValue {
  Large = 2 ** 13 - 1,
  Small = 2 ** 4 + 1,
  OtherChar = 0b11001100110011001100110011001100,
}

const cachePrimes: number[][] = [];

export default class Context {
  public static clone(ctx: Context): Context {
    const c = new Context(ctx.groupType, ctx.depth, ctx.parent);
    Object.assign(c.eqtb.catcode, ctx.eqtb.catcode);
    c.eqtb.commands = ctx.eqtb.commands.clone();
    return c;
  }

  public eqtb: {
    catcode: number[];
    commands: Trie<number>;
  } = { catcode: [], commands: new Trie(-1) };

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
      cachePrimes[this.depth] = [p * 5, pp * SpecialValue.Large];
    }
    [p, pp] = cachePrimes[this.depth];
    return (
      ((this.parent ? this.parent.hash : 0) + this.groupType * p + this.hashEQTB() * pp) %
      (2 ** 19 - 1)
    );
  }

  public hashEQTB(): number {
    let pp = SpecialValue.Small;
    let r = 0;
    let a: number;
    for (let i = 0; i < this.eqtb.catcode.length; i++) {
      a = this.eqtb.catcode[i] ?? SpecialValue.OtherChar;
      for (let j = 0; j < 8; j++) {
        pp *= SpecialValue.Small;
        pp %= SpecialValue.Large;
        r += ((a & (0b1111 << (4 * j))) >>> (4 * j)) * pp;
        r %= SpecialValue.Large;
      }
    }
    return r;
  }

  public catcode(chr: number): CatCode;
  public catcode(chr: number, code: CatCode): Context;
  public catcode(chr: number, code?: CatCode): CatCode | Context {
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
    let cat = this.eqtb.catcode[i];
    for (let n = this.parent; n !== null && cat === undefined; n = n.parent) {
      cat = n.eqtb.catcode[i];
    }

    if (code === undefined) {
      return cat === undefined ? CatCode.OtherChar : (cat & (0b1111 << l)) >>> l;
    }

    const ctx = Context.clone(this);
    ctx.eqtb.catcode[i] = ((cat ?? SpecialValue.OtherChar) & (~(0b1111 << l) >>> 0)) + (code << l);
    return ctx;
  }

  public command(cs: string): number;
  public command(cs: string, code: number): Context;
  public command(cs: string, code?: number): number | Context {
    if (code === undefined) {
      let g = this.eqtb.commands.lookup(cs);
      for (let n = this.parent; (g === undefined || g < 0) && n !== null; n = n.parent) {
        g = n.eqtb.commands.lookup(cs);
      }
      return g === undefined || g < 0 ? Term.control_sequence_token : g;
    }

    const ctx = Context.clone(this);
    ctx.eqtb.commands.insert(cs, code);
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

    // Command
    this._command('begingroup', Term.begin_group);
    this._command('endgroup', Term.end_group);

    this._command('let', Term._let);
    this._command('futurelet', Term.futurelet);

    this._command('catcode', Term.def_code);
    this._command('mathcode', Term.def_code);
    this._command('lccode', Term.def_code);
    this._command('uccode', Term.def_code);
    this._command('sfcode', Term.def_code);
    this._command('delcode', Term.def_code);

    this._command('long', Term.prefix);
    this._command('outer', Term.prefix);
    this._command('global', Term.prefix);

    this._command('def', Term.def);
    this._command('edef', Term.def);
    this._command('gdef', Term.def);
    this._command('xdef', Term.def);

    this._command('makeatletter', Term.makeatletter);
    this._command('makeatother', Term.makeatother);

    // this._command('if', Term.if_cs_token);
    // this._command('ifcat', Term.if_cs_token);
    // this._command('ifnum', Term.if_cs_token);
    // this._command('ifdim', Term.if_cs_token);
    // this._command('ifvmode', Term.if_cs_token);
    // this._command('ifhmode', Term.if_cs_token);
    // this._command('ifmmode', Term.if_cs_token);
    // this._command('ifinner', Term.if_cs_token);
    // this._command('ifvoid', Term.if_cs_token);
    // this._command('ifhbox', Term.if_cs_token);
    // this._command('ifvbox', Term.if_cs_token);
    // this._command('ifx', Term.if_cs_token);
    // this._command('ifeof', Term.if_cs_token);
    // this._command('iftrue', Term.if_cs_token);
    // this._command('iffalse', Term.if_cs_token);
    // this._command('ifcase', Term.if_cs_token);
    // this._command('or', Term.or_cs_token);
    // this._command('else', Term.else_cs_token);
    // this._command('fi', Term.fi_cs_token);
  }

  private _catcode(chr: number, code: number): void {
    const i = Math.floor(chr / 8);
    const l = 4 * (chr % 8);
    // We are assuming here 8 values in a row to never be simultaneously 0.
    this.eqtb.catcode[i] =
      ((this.eqtb.catcode[i] ?? SpecialValue.OtherChar) & (~(0b1111 << l) >>> 0)) + (code << l);
  }

  private _command(cs: string, code: number): void {
    this.eqtb.commands.insert(cs, code);
  }
}
