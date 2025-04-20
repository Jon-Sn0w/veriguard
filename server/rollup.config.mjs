import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';

dotenv.config({ path: '/home/jlandry/.env' });

export default {
  input: 'public/js/royaltyCollections.js',
  context: 'window',
  output: {
    dir: 'public/js/dist',
    format: 'es',
    sourcemap: true,
    entryFileNames: 'bundle.js',
    chunkFileNames: '[name]-[hash].js'
  },
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    commonjs({ include: /node_modules/, transformMixedEsModules: true }),
    json(),
    nodePolyfills(),
    replace({
      'process.env.WALLETCONNECT_PROJECT_ID': JSON.stringify(process.env.WALLETCONNECT_PROJECT_ID),
      'process.env.CONTRACT_ADDRESS': JSON.stringify(process.env.CONTRACT_ADDRESS),
      'process.env.ETHEREUM_RPC_URL': JSON.stringify(process.env.ETHEREUM_RPC_URL),
      'process.env.SONGBIRD_CONTRACT_ADDRESS': JSON.stringify(process.env.SONGBIRD_CONTRACT_ADDRESS),
      'process.env.SONGBIRD_RPC_URL': JSON.stringify(process.env.SONGBIRD_RPC_URL),
      'process.env.SONGBIRD_PAYMENT_TOKEN_ADDRESS': JSON.stringify(process.env.SONGBIRD_PAYMENT_TOKEN_ADDRESS),
      'process.env.SONGBIRD_FACTORY_ADDRESS': JSON.stringify(process.env.SONGBIRD_FACTORY_ADDRESS),
      'process.env.SONGBIRD_COLLECTION_REGISTRY_ADDRESS': JSON.stringify(process.env.SONGBIRD_COLLECTION_REGISTRY_ADDRESS),
      'process.env.FLARE_CONTRACT_ADDRESS': JSON.stringify(process.env.FLARE_CONTRACT_ADDRESS),
      'process.env.FLARE_RPC_URL': JSON.stringify(process.env.FLARE_RPC_URL),
      'process.env.FLARE_PAYMENT_TOKEN_ADDRESS': JSON.stringify(process.env.FLARE_PAYMENT_TOKEN_ADDRESS),
      'process.env.FLARE_FACTORY_ADDRESS': JSON.stringify(process.env.FLARE_FACTORY_ADDRESS),
      'process.env.FLARE_COLLECTION_REGISTRY_ADDRESS': JSON.stringify(process.env.FLARE_COLLECTION_REGISTRY_ADDRESS),
      'process.env.BASECHAIN_RPC_URL': JSON.stringify(process.env.BASECHAIN_RPC_URL),
      'process.env.BASECHAIN_CONTRACT_ADDRESS': JSON.stringify(process.env.BASECHAIN_CONTRACT_ADDRESS),
      'process.env.BASECHAIN_PAYMENT_TOKEN_ADDRESS': JSON.stringify(process.env.BASECHAIN_PAYMENT_TOKEN_ADDRESS),
      'process.env.SONGBIRD_NFT_MINTER_ADDRESS': JSON.stringify(process.env.SONGBIRD_NFT_MINTER_ADDRESS),
      'process.env.FLARE_NFT_MINTER_ADDRESS': JSON.stringify(process.env.FLARE_NFT_MINTER_ADDRESS),
      'process.env.BASECHAIN_NFT_MINTER_ADDRESS': JSON.stringify(process.env.BASECHAIN_NFT_MINTER_ADDRESS),
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
