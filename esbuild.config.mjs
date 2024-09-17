import * as esbuild from 'esbuild'
import fg from 'fast-glob';

const entryPoints = fg.sync('src/**/*.ts');

esbuild.build({
  entryPoints: [...entryPoints, 'default-config.json'],
  bundle: false,
  minify: false,
  outdir: 'dist',
  format: 'cjs',
  platform: 'node',
  target: 'es6'
})
