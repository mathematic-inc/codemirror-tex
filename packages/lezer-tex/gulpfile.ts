import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { series, task } from 'gulp';
import { run as runJest } from 'jest';
import { rollup } from 'rollup';
import rollupConfig from './rollup.config';
import { buildParserFile } from './third_party/lezer-generator/src/build';

async function generateLezer() {
  const files = buildParserFile(readFileSync('src/tex.grammar', { encoding: 'utf-8' }), {
    includeNames: true,
  });
  mkdirSync('src/gen', { recursive: true });
  writeFileSync('src/gen/terms.ts', `${files.terms}`);
  writeFileSync('src/gen/parser.ts', `// @ts-nocheck\n${files.parser}`);
}
task('generate-lezer', generateLezer);

task('generate', series('generate-lezer'));

async function build() {
  const bundle = await rollup(rollupConfig);
  await bundle.write({
    dir: 'lib',
    format: 'es',
    name: 'lezer-tex',
    exports: 'named',
    sourcemap: true,
  });
  await bundle.write({
    file: 'lib/index.cjs',
    format: 'cjs',
    exports: 'named',
    name: 'lezer-tex',
  });
}
task('build', series('generate', build));

function test() {
  return runJest();
}
task('test', series('build', test));
