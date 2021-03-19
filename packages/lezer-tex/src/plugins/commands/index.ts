// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-classes-per-file */
import Context from '../../context';
import Command from './command';

function parseInteger(value: string): number {
  const typ = value.codePointAt(0);
  const val = value.slice(1);
  switch (typ) {
    case cp`\``: {
      let v = val.codePointAt(0) as number;
      if (v === cp`\\`) {
        v = val.codePointAt(1) as number;
      }
      return v;
    }
    case cp`"`:
      return parseInt(val, 16);
    case cp`'`:
      return parseInt(val, 8);
    default:
      return parseInt(value, 10);
  }
}

export class CatCodeCommand extends Command {
  // eslint-disable-next-line class-methods-use-this
  protected exec(ctx: Context, charInt: string, catCodeInt: string): Context | null {
    ctx.catcode(parseInteger(charInt), parseInteger(catCodeInt));
    return ctx;
  }
}

// export class LetCommand extends Command {
//   // eslint-disable-next-line class-methods-use-this
//   protected exec(ctx: Context, destCS: string, srcCS: string): Context | null {
//     const [level, command] = ctx.command(srcCS);
//     if (command) {
//       const [cmd, chr, , isMacro] = command;
//       ctx.defineCatCode(cmd, chr, isMacro, destCS, level);
//     }
//     return null;
//   }
// }

// export class FutureLetCommand extends Command {
//   // eslint-disable-next-line class-methods-use-this
//   protected exec(ctx: Context, destCS: string, _: string, srcCS: string): Context | null {
//     const [level, command] = ctx.command(srcCS);
//     if (command) {
//       const [cmd, chr, , isMacro] = command;
//       ctx.defineCatCode(cmd, chr, isMacro, destCS, level);
//     }
//     return null;
//   }
// }
