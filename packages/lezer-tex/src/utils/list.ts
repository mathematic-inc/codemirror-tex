export class List<T> {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #n: List<T> | null = null;

  /**
   * @param v - This should be the zero value of the type T if the node is root.
   */
  constructor(public v: T) {}

  public get next(): List<T> | null {
    return this.#n;
  }

  /**
   * Inserts the given key and value into the Trie.
   *
   * This will insert by the REVERSE of the key since the reverse more often leads to compactness.
   *
   * @param k - The key of this node.
   * @param v - The value of this node.
   */
  public set(v: T): void {
    this.#n = new List(v);
  }
}
