import { statSync } from 'fs';

export function isOlderThan(src: string, dest: string): boolean {
  return statSync(src).mtime.getTime() < statSync(dest).mtime.getTime();
}

export function toKeyValuePairString<T>(obj: T): string {
  return Object.entries(obj)
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join(',');
}
