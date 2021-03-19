// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { RollupOptions } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import { codepointTransformer } from './tools/transformers';

export default {
  input: 'src/index.ts',
  external: ['lezer'],
  plugins: [
    nodeResolve(),
    typescript({
      lib: ['es5', 'es6'],
      target: 'es6',
      tsconfig: 'tsconfig.build.json',
      transformers: {
        before: [codepointTransformer],
      },
    }),
    terser(),
  ],
} as RollupOptions;
