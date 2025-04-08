// rollup.config.mjs
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-node-polyfills'; // Fixed from 'node'
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';

dotenv.config({ path: '/home/jlandry/.env' });

export default {
  input: 'public/js/royaltyCollections.js',
  context: 'window', // Restored to fix "this is undefined"
  output: {
    dir: 'public/js/dist',
    format: 'es', // Restored to support code-splitting
    sourcemap: true,
    entryFileNames: 'bundle.js',
    chunkFileNames: '[name]-[hash].js'
  },
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    commonjs({ include: /node_modules/, transformMixedEsModules: true }),
    json(),
    nodePolyfills(), // Corrected usage
    replace({
      'process.env.WALLETCONNECT_PROJECT_ID': JSON.stringify(process.env.WALLETCONNECT_PROJECT_ID),
      preventAssignment: true
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env'],
      exclude: 'node_modules/**',
      skipPreflightCheck: true
    }),
    terser({ ecma: 2020, compress: { drop_console: false }, mangle: true })
  ],
  external: ['/js/menu.js']
};
