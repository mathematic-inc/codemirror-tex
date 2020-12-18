export class Trie<T> {
  // Deserializes a previously-serialized string to a trie.
  public static deserialize<S>(s: string): Trie<S> {
    const trie = new Trie((null as unknown) as S);
    const [value, children] = JSON.parse(
      s
        .replaceAll('\x04', ',"')
        .replaceAll('\x03', ',{\x02')
        .replaceAll('\x02', '}]')
        .replaceAll('\x01', '":[')
        .replaceAll('\x00', ',{"')
    );
    trie.value = value;
    Object.entries(children).forEach(([key, child]) => {
      trie.children[key] = Trie.deserialize<S>(JSON.stringify(child));
    });
    return trie;
  }

  // Serializes the trie to a compact string.
  public static serialize(t: Trie<unknown>): string {
    return `[${JSON.stringify(t.value)},{${Object.entries(t.children)
      .reduce((s, [k, v]) => (v ? `${s}"${k}":${Trie.serialize(v)},` : s), '')
      .slice(0, -1)}}]`
      .replaceAll(',{"', '\x00')
      .replaceAll('":[', '\x01')
      .replaceAll('}]', '\x02')
      .replaceAll(',{\x02', '\x03')
      .replaceAll(',"', '\x04');
  }

  public children: { [s: string]: Trie<T> } = {};

  /**
   * @param value - This should be the zero value of the type T if the node is root.
   */
  constructor(public value: T) {}

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
    for (let i = k.length - 1; i > -1; i--) {
      if (n.children[k[i]] === undefined) n.children[k[i]] = new Trie(n.value);
      n = n.children[k[i]];
    }
    n.value = v;
  }

  /**
   * Looks up the given key.
   *
   * @param k - The key to lookup.
   * @returns - The value of the found node or null.
   */
  public lookup(k: string): T | undefined {
    let n = this as Trie<T>;
    for (let i = k.length - 1; i > -1; i--) {
      n = n.children[k[i]];
      if (n === undefined) return undefined;
    }
    return n.value;
  }

  /**
   * Shallowly clones the binded trie.
   *
   * @returns A clone of this trie.
   */
  public clone(): Trie<T> {
    const t = new Trie(this.value);
    Object.entries(this.children).forEach(([k, v]) => {
      t.children[k] = v.clone();
    });
    return t;
  }
}
