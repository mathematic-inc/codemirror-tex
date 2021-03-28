import { readdirSync, readFileSync } from 'fs';
import { join, resolve, basename } from 'path';
import parser from '../lib';
import { fileTests } from '../third_party/lezer-generator/src/test';

const solo = resolve(__dirname, 'solo.txt');
const casesDir = resolve(__dirname, 'cases');
const fileExtRegExp = /\.txt$/;
const files =
  readFileSync(solo, { encoding: 'utf-8' }) !== ''
    ? [solo]
    : readdirSync(casesDir, { encoding: 'utf-8' }).filter((f) => fileExtRegExp.test(f));

files.forEach((filePath) => {
  const file = readFileSync(join(casesDir, filePath), { encoding: 'utf-8' });
  const fileName = basename(filePath, '.txt');
  describe(`file: ${fileName}`, () => {
    fileTests(file, fileName).forEach(({ name, run }) => {
      // eslint-disable-next-line jest/expect-expect
      it(`case: ${name}`, () => {
        run(
          parser.configure({
            dialect: 'directives',
          })
        );
      });
    });
  });
});
