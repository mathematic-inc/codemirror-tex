import { createReadStream } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { series, task } from 'gulp';
import { run as runJest } from 'jest';
import { render } from 'mustache';
import { join } from 'path';
import { createInterface } from 'readline';
import { rollup } from 'rollup';
import { parse } from 'yaml';
import rollupConfig from './rollup.config';
import { lzwEncode } from './src/utils/lzw';
import { Trie } from './src/utils/trie';
import { buildParserFile } from './third_party/lezer-generator/src/build';

const enum Term {
  FirstTerm = 35,
  Primitive = 22,
}

interface CommandDescription {
  name: string;
  dialects: number;
  executable: boolean;
}

const commandToTerm: Record<string, number> = {};
const commands: Array<CommandDescription> = [];
const tokens: string[] = [];
const signatures: string[] = [];

async function readCommands() {
  if (commands.length > 0) {
    return;
  }
  const fileStream = createReadStream(join(__dirname, 'src/data/engine-primitives.txt'));
  const file = createInterface(fileStream);
  let lineNo = 0;
  for await (const line of file) {
    if (lineNo === 0) {
      lineNo += 1;
      // eslint-disable-next-line no-continue
      continue;
    }
    const [
      command,
      texSupport,
      etexSupport,
      pdftexSupport,
      xetexSupport,
      luatexSupport,
    ] = line.split('|');
    if (!(command && texSupport && etexSupport && pdftexSupport && xetexSupport && luatexSupport)) {
      break;
    }
    commands.push({
      name: command,
      dialects: (() => {
        let dct = 0;
        if (texSupport === '✔') {
          dct |= 1;
        }
        if (etexSupport === '✔') {
          dct |= 2;
        }
        if (pdftexSupport === '✔') {
          dct |= 4;
        }
        if (xetexSupport === '✔') {
          dct |= 8;
        }
        if (luatexSupport === '✔') {
          dct |= 16;
        }
        if (dct === (16 | 8 | 4 | 2 | 1)) {
          return 0;
        }
        return dct;
      })(),
      executable: false,
    });
  }
  file.close();
  fileStream.close();
  commands.sort((a, b) => (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 1));

  const syntaxes: Array<{
    name: string;
    props: Record<string, string>;
  }> = parse(
    await readFile(join(__dirname, 'src/data/command-syntaxes.yaml'), { encoding: 'utf-8' })
  );
  let startTerm = Term.FirstTerm;
  syntaxes.forEach((syntax) => {
    let l = 0;
    let r = commands.length;
    let i = 0;
    // eslint-disable-next-line no-labels
    loop: while (l <= r) {
      i = Math.floor((l + r) / 2);
      switch (true) {
        case commands[i].name.toLocaleLowerCase() < syntax.name.toLocaleLowerCase():
          l = i + 1;
          break;
        case commands[i].name.toLocaleLowerCase() > syntax.name.toLocaleLowerCase():
          r = i - 1;
          break;
        default:
          // eslint-disable-next-line no-labels
          break loop;
      }
    }
    const cmd = commands[i];
    cmd.executable = true;
    commandToTerm[cmd.name] = startTerm++;
    tokens.push(
      cmd.dialects > 0
        ? `${cmd.name}_token[@dialect="${(() => {
            const dcts: string[] = [];
            if ((cmd.dialects & 1) > 0) {
              dcts.push('tex');
            }
            if ((cmd.dialects & 2) > 0) {
              dcts.push('etex');
            }
            if ((cmd.dialects & 4) > 0) {
              dcts.push('pdftex');
            }
            if ((cmd.dialects & 8) > 0) {
              dcts.push('xetex');
            }
            if ((cmd.dialects & 16) > 0) {
              dcts.push('luatex');
            }
            return dcts.join(' ');
          })()}"]`
        : ` ${cmd.name}_token`
    );
    signatures.push(
      `${cmd.name}[@name="${cmd.name}"${syntax.props ? `,${Object.entries(syntax.props).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(',')}` : ''}] {${
        cmd.name
      }_token}`
    );
  });
}
task('read-commands', readCommands);

async function generateCommands() {
  const commandTrie = new Trie([-1, -1]);
  commands.forEach((desc) => {
    commandTrie.insert(desc.name, [
      desc.executable ? commandToTerm[desc.name] : Term.Primitive,
      desc.dialects,
    ]);
  });
  await writeFile(
    join(__dirname, 'src/gen/commands.ts'),
    `export default '${lzwEncode(Trie.serialize(commandTrie))}';\n`
  );
}
task('generate-commands', series('read-commands', generateCommands));

async function generateParser() {
  const grammarFile = render(
    await readFile(join(__dirname, 'src/tex.grammar'), { encoding: 'utf-8' }),
    {
      tokens: tokens.join(',\n '),
      signatures: signatures.join('\n'),
    }
  );
  const parserFile = buildParserFile(grammarFile, { includeNames: true });
  await mkdir(join(__dirname, 'src/gen'), { recursive: true });
  await writeFile(join(__dirname, 'src/gen/terms.ts'), parserFile.terms);
  await writeFile(join(__dirname, 'src/gen/parser.ts'), `// @ts-nocheck\n${parserFile.parser}`);
}
task('generate-parser', series('read-commands', generateParser));

task('generate', series('generate-parser', 'generate-commands'));

async function buildREADME() {
  await writeFile(
    join(__dirname, 'README.md'),
    render(await readFile(join(__dirname, 'src/docs/README.md'), { encoding: 'utf-8' }), {
      commands: Object.entries(
        commands.reduce<Record<string, CommandDescription[]>>((t, v) => {
          const key = v.name[0].toLocaleUpperCase();
          if (/[a-z]/i.test(key)) {
            if (!(key in t)) {
              t[key] = [];
            }
            t[key].push(v);
          } else {
            if (!('Symbol' in t)) {
              t.Symbol = [];
            }
            t.Symbol.push(v);
          }
          return t;
        }, {})
      )
        // eslint-disable-next-line no-nested-ternary
        .sort(([a], [b]) => (a === 'Symbol' ? -1 : b === 'Symbol' ? 1 : a < b ? -1 : 1))
        .reduce(
          (s, [key, b], _, j) =>
            `${s}\n\n### Block ${key}\n[Top](#lezer-tex)${j.reduce(
              (v, [k]) => `${v} • ${key === k ? `**${k}**` : `[${k}](#block-${k})`}`,
              ''
            )}\n${b.reduce(
              (t, v) =>
                `${t}\n|\`${v.name}\`|${(() => {
                  const dcts: string[] = [];
                  if ((v.dialects & 1) > 0) {
                    dcts.push('`tex`');
                  }
                  if ((v.dialects & 2) > 0) {
                    dcts.push('`etex`');
                  }
                  if ((v.dialects & 4) > 0) {
                    dcts.push('`pdftex`');
                  }
                  if ((v.dialects & 8) > 0) {
                    dcts.push('`xetex`');
                  }
                  if ((v.dialects & 16) > 0) {
                    dcts.push('`luatex`');
                  }
                  if (dcts.length === 5 || dcts.length === 0) {
                    return 'Built-in';
                  }
                  return dcts.join(', ');
                })()}|\`${v.executable}\`|`,
              '|Name|Dialects|Executable?|\n|-|-|-|'
            )}`,
          ''
        )
        .trim(),
    })
  );
}
task('docs-readme', series('read-commands', buildREADME));

task('docs', series('docs-readme'));

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

task('all', series('build', 'test', 'docs'));
