// eslint-disable-next-line import/no-cycle
import Context from '../../context';
import { Term } from '../../gen/terms';

export default abstract class Command {
  protected abstract exec(ctx: Context, ...matches: string[]): Context | null;

  protected parameters: number[] = [Term.control_sequence, Term.control_sequence];

  protected matches: string[] = [];

  public get ready(): boolean {
    return this.matches.length === this.parameters.length;
  }

  public match(term: number, value: string): boolean {
    if (this.parameters[this.matches.length] === term) {
      this.matches.push(value);
      return true;
    }
    return false;
  }

  public execute(ctx: Context): Context {
    return this.exec(ctx, ...this.matches) || ctx;
  }
}
