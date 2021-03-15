import Context from '../../context';

export interface DirectiveSpec<Args extends unknown[]> {
  /**
   * If true, other directives will also execute whether or not this one does.
   */
  fallthrough?: boolean;
  /**
   * Tests whether the directive string is for this directive. If true, the test should return the
   * arguments for running the directive.
   *
   * @param directive - The directive string to test.
   */
  test(directive: string): Args | undefined;
  /**
   * Runs the directive with the given context and arguments.
   *
   * @param context - The context of the parser.
   * @param args - The arguments for this directive.
   */
  run(context: Context, ...args: Args): Context;
}

export default class Directive<Args extends unknown[]> {
  public fallthrough: boolean;

  /** @internal */
  private test: (directive: string) => Args | undefined;

  /** @internal */
  private run: (context: Context, ...args: Args) => Context;

  constructor({ test, run, fallthrough }: DirectiveSpec<Args>) {
    this.test = test;
    this.run = run;
    this.fallthrough = !!fallthrough;
  }

  public exec(directive: string, context: Context): Context | null {
    const args = this.test(directive);
    if (!args) return null;
    return this.run(context, ...args);
  }
}
