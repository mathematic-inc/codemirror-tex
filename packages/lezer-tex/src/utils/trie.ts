export class Trie<T> {
  public c: { [c: number]: Trie<T> } = {};

  /**
   * @param v - This should be the zero value of the type T if the node is root.
   */
  constructor(public v: T) {}

  /**
   * Inserts the given key and value into the Trie.
   *
   * This will insert by the REVERSE of the key since the reverse more often leads to compactness.
   *
   * @param k - The key of this node.
   * @param v - The value of this node.
   */
  public insert(k: string, v: T): void {
    let n = this as Trie<T>;
    for (const p of Uint32Array.from(k, (s) => s.codePointAt(0) as number).reverse()) {
      if (p in this.c) this.c[p] = new Trie(this.v);
      n = this.c[p];
    }
    n.v = v;
  }

  /**
   * Looks up the given key.
   *
   * @param k - The key to lookup.
   * @returns - The value of the found node or null.
   */
  public lookup(k: string): T | null {
    let n = this as Trie<T>;
    for (const p of Uint32Array.from(k, (s) => s.codePointAt(0) as number).reverse()) {
      n = this.c[p];
      if (n === undefined) return null;
    }
    return n.v;
  }
}
