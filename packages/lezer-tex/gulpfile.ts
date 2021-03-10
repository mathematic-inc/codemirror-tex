import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dest, series, src, task } from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import { createProject } from 'gulp-typescript';
import { run as runJest } from 'jest';
import { buildParserFile } from './third_party/lezer-generator/src/build';

async function generateLezer() {
  const files = buildParserFile(readFileSync('src/tex.grammar', { encoding: 'utf-8' }));
  mkdirSync('src/gen', { recursive: true });
  writeFileSync('src/gen/terms.js', files.terms);
  writeFileSync('src/gen/parser.js', files.parser);
}
task('generate-lezer', generateLezer);

task('generate', series('generate-lezer'));

const tsProject = createProject('tsconfig.build.json');

function build() {
  return src(['src/**/*.ts', 'src/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: './' }))
    .pipe(dest('lib'));
}
task('build', series('generate', build));

function test() {
  return runJest();
}
task('test', test);
