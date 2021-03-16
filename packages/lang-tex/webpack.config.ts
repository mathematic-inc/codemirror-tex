import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { resolve } from 'path';
import { Configuration } from 'webpack';

export default {
  mode: 'development',
  target: 'web',
  entry: resolve(__dirname, 'playground/main.ts'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: resolve(__dirname, 'tsconfig.play.json'),
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({ title: 'Development' }),
  ],
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'playground/dist'),
  },
} as Configuration;
