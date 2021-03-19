export class Trie<T> {
  public children: Trie<T>[] = [];

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
      if (n.children[p] === undefined) n.children[p] = new Trie(n.v);
      n = n.children[p];
    }
    n.v = v;
  }

  /**
   * Looks up the given key.
   *
   * @param k - The key to lookup.
   * @returns - The value of the found node or null.
   */
  public lookup(k: string): T | undefined {
    let n = this as Trie<T>;
    for (const p of Uint32Array.from(k, (s) => s.codePointAt(0) as number).reverse()) {
      n = n.children[p];
      if (n === undefined) return undefined;
    }
    return n.v;
  }

  /**
   * Shallowly clones the binded trie.
   *
   * @returns A clone of this trie.
   */
  public clone(): Trie<T> {
    const t = new Trie(this.v);
    this.children.forEach((c, i) => {
      t.children[i] = c.clone();
    });
    return t;
  }
}
