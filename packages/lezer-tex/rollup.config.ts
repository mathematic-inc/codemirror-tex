// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { RollupOptions } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  external: ['lezer'],
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
    terser(),
  ],
} as RollupOptions;
