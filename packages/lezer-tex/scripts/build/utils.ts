export function toKeyValuePairString<T>(obj: T): string {
  return Object.entries(obj)
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join(',');
}
