/**
 * Compresses a string using LZW.
 *
 * @param str - The string to compress.
 * @returns the compressed string.
 */
export function lzwEncode(str: string): string {
  const storage: { [s: string]: number } = {};
  const result: number[] = [];
  let phrase = str[0];

  let max = 0;
  for (let i = 0; i < str.length; i++) {
    max = Math.max(max, str.codePointAt(i) as number);
  }
  max += 1;

  for (let i = 1, c = str[1], code = max; i < str.length; i++, c = str[i]) {
    if (storage[phrase + c] !== undefined) {
      phrase += c;
      continue;
    }
    result.push((phrase.length > 1 ? storage[phrase] : phrase.codePointAt(0)) as number);
    storage[phrase + c] = code++;
    phrase = c;
  }
  result.push((phrase.length > 1 ? storage[phrase] : phrase.codePointAt(0)) as number);
  return `${max}:${String.fromCodePoint.apply(null, result)}`;
}

/**
 * Decompresses a string using LZW.
 *
 * @param str - The string to decompress.
 * @returns the compressed string.
 */
export function lzwDecode(str: string): string {
  const [codeStr] = str.match(/^[0-9]+:/) as RegExpMatchArray;
  const max = +codeStr.slice(0, -1);
  str = str.slice(codeStr.length);

  const storage: { [s: number]: string } = {};
  let currChar = str[0];
  let currCode: number;
  let currPhrase: string;
  let prevPhrase = currChar;
  let result = currChar;

  for (let i = 1, code = max; i < str.length; code++, i++) {
    currCode = str.codePointAt(i) as number;
    currPhrase =
      currCode < max ? str[i] : storage[currCode] ? storage[currCode] : prevPhrase + currChar;
    result += currPhrase;
    [currChar] = currPhrase;
    storage[code] = prevPhrase + currChar;
    prevPhrase = currPhrase;
  }
  return result;
}
