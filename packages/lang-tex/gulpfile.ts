import { dest, src, task } from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import { join } from 'path';
import webpack from 'webpack';
import { createProject } from 'gulp-typescript';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack.config';

const tsProject = createProject('tsconfig.build.json');

function build() {
  return src(['src/**/*.ts', 'src/**/*.js', 'src/**/*.json'])
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: './' }))
    .pipe(dest('lib'));
}
task('build', build);

function serve() {
  const devServerConfig = {
    contentBase: join(__dirname, 'playground'),
    compress: true,
    host: '127.0.0.1',
  };
  const compiler = webpack(webpackConfig);
  return new WebpackDevServer(compiler, devServerConfig).listen(9000, 'localhost');
}
task('serve', serve);
