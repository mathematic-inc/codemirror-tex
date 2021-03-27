import { createReadStream, existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { series, task } from 'gulp';
import { run as runJest } from 'jest';
import { render } from 'mustache';
import { join } from 'path';
import { createInterface } from 'readline';
import { rollup } from 'rollup';
import { parse, stringify } from 'yaml';
import { isOlderThan, toKeyValuePairString } from './scripts/build/utils';
import rollupConfig from './rollup.config';
import { lzwEncode } from './src/utils/lzw';
import { serializeTrie, Trie } from './src/utils/trie';
import { buildParserFile } from './third_party/lezer-generator/src/build';

const enum Term {
  FirstTerm = 35,
  Primitive = 34,
}

interface CommandDescription {
  name: string;
  dialects: number;
  syntax?: CommandSyntax;
}

interface CommandSyntax {
  props?: Record<string, string>;
}

let commands: CommandDescription[] = [];
async function getSupportedPrimitives(): Promise<CommandDescription[]> {
  // Check local cache.
  if (commands.length > 0) {
    return commands;
  }

  // Check disk cache.
  if (!existsSync(join(__dirname, '.cache'))) {
    await mkdir(join(__dirname, '.cache'));
    await mkdir(join(__dirname, 'src/gen'), { recursive: true });
  }
  if (
    existsSync('.cache/supported-primitives.yaml') &&
    isOlderThan('src/data/primitive-syntax.yaml', '.cache/supported-primitives.yaml')
  ) {
    commands = parse(
      await readFile(join(__dirname, '.cache/supported-primitives.yaml'), { encoding: 'utf-8' })
    );
    return commands;
  }

  const primitiveSyntax: { [name: string]: CommandSyntax } = parse(
    await readFile(join(__dirname, 'src/data/primitive-syntax.yaml'), { encoding: 'utf-8' })
  );
  const file = createInterface(
    createReadStream(join(__dirname, 'src/data/primitive-support-by-engine.yaml'))
  );
  for await (const line of file) {
    if (line[0] === '#') {
      continue;
    }
    // eslint-disable-next-line prefer-const
    let [csName, supportedEngines] = line.split(':');
    if (csName[0] === "'") {
      csName = csName.slice(1, -1);
    }
    const [inTeX, inETex, inPDFTeX, inXeTeX, inLuaTeX] = supportedEngines
      .trim()
      .split(',')
      .map((f) => f === '✔');
    commands.push({
      name: csName,
      dialects: (() => {
        let dct = 0;
        if (inTeX) dct |= 1;
        if (inETex) dct |= 2;
        if (inPDFTeX) dct |= 4;
        if (inXeTeX) dct |= 8;
        if (inLuaTeX) dct |= 16;
        if (dct === (16 | 8 | 4 | 2 | 1)) {
          return 0;
        }
        return dct;
      })(),
      syntax: primitiveSyntax[csName],
    });
  }
  file.close();
  await writeFile(join(__dirname, '.cache/supported-primitives.yaml'), stringify(commands));
  return commands;
}

async function renderGrammarFile(): Promise<string> {
  if (
    existsSync('src/gen/tex.grammar') &&
    isOlderThan('.cache/supported-primitives.yaml', 'src/gen/tex.grammar')
  ) {
    return readFile('src/gen/tex.grammar', { encoding: 'utf-8' });
  }
  const executableCommands = (await getSupportedPrimitives()).filter((d) => !!d.syntax);
  const grammarTemplate = await readFile(join(__dirname, 'src/data/tex.grammar'), {
    encoding: 'utf-8',
  });
  const grammar = render(grammarTemplate, {
    tokens: executableCommands
      .map((description) => {
        const props: Record<string, string> = {};
        if (description.dialects > 0) {
          props['@dialect'] = (() => {
            const dcts: string[] = [];
            if ((description.dialects & 1) > 0) dcts.push('tex');
            if ((description.dialects & (1 << 1)) > 0) dcts.push('etex');
            if ((description.dialects & (1 << 2)) > 0) dcts.push('pdftex');
            if ((description.dialects & (1 << 3)) > 0) dcts.push('xetex');
            if ((description.dialects & (1 << 4)) > 0) dcts.push('luatex');
            return dcts.join(' ');
          })();
        }
        return `${description.name}_token${
          Object.keys(props).length > 0 ? `[${toKeyValuePairString(props)}]` : ``
        }`;
      })
      .join(',\n  '),
    signatures: executableCommands
      .map((description) => {
        const { syntax } = description;
        return `${description.name}[@name="${description.name}"${
          syntax?.props ? `,${toKeyValuePairString(syntax.props)}` : ''
        }] {${description.name}_token}`;
      })
      .join('\n'),
  });
  await writeFile(join(__dirname, 'src/gen/tex.grammar'), grammar);
  return grammar;
}

async function generateParser() {
  const grammar = await renderGrammarFile();
  const parserData = buildParserFile(grammar);
  await mkdir(join(__dirname, 'src/gen'), { recursive: true });
  await writeFile(join(__dirname, 'src/gen/terms.ts'), parserData.terms);
  await writeFile(join(__dirname, 'src/gen/parser.ts'), `// @ts-nocheck\n${parserData.parser}`);
}
task('generate:parser', generateParser);

async function generateCommandTrie() {
  if (
    existsSync('src/gen/supported-primitives.ts') &&
    isOlderThan('.cache/supported-primitives.yaml', 'src/gen/supported-primitives.ts')
  ) {
    return;
  }
  const cmds = await getSupportedPrimitives();
  const commandTrie = new Trie();
  let currentTerm = Term.FirstTerm;
  cmds.forEach((description) => {
    commandTrie.insert(description.name, [
      description.syntax ? currentTerm++ : Term.Primitive,
      description.dialects,
    ]);
  });
  await writeFile(
    join(__dirname, 'src/gen/commands.ts'),
    `export default '${lzwEncode(serializeTrie(commandTrie))}';\n`
  );
}
task('generate:command-trie', generateCommandTrie);

task('generate', series('generate:parser', 'generate:command-trie'));

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
                  if (v.dialects === 0) {
                    return 'Built-in';
                  }
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
                  return dcts.join(', ');
                })()}|\`${v.syntax !== null}\`|`,
              '|Name|Dialects|Executable?|\n|-|-|-|'
            )}`,
          ''
        )
        .trim(),
    })
  );
}
task('docs-readme', buildREADME);

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
task('test', test);

task('all', series('build', 'test', 'docs'));
