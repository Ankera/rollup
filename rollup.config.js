import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typeScript from '@rollup/plugin-typescript';

// 压缩
import { terser } from 'rollup-plugin-terser';

import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/bundle.cjs.js',
    format: 'umd',
    name: 'bundleName',
    globals: {
      'lodash': '_',
      'jquery': '$',
    }
  },
  external: ['lodash'],
  plugins: [
    babel({
      exclude: /node_modules/,
    }),
    resolve(),
    commonjs(),
    typeScript(),
    // terser()
    postcss(),
    serve({
      open: true,
      port: 8080,
      contentBase: './dist'
    })
  ]
}