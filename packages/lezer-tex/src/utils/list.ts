export class List<T> {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #n: List<T> | null = null;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #v: T;

  /**
   * @param v - This should be the zero value of the type T if the node is root.
   */
  constructor(v: T) {
    this.#v = v;
  }

  public get value(): T {
    return this.#v;
  }

  public set value(v: T) {
    this.#v = v;
  }

  public get next(): List<T> | null {
    return this.#n;
  }

  /**
   * Sets the given value into the Trie.
   *
   * @param v - The value of this node.
   */
  public append(v: T): void {
    this.#n = new List(v);
  }
}
