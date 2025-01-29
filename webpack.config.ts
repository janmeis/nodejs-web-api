// <see cref="https://www.nandhakumar.io/post/mastering-webpack-setting-up-webpack-with-typeScript-for-node-js-part-1" /

import { Configuration } from 'webpack';
import { resolve } from 'path';

const config: Configuration = {
  mode: 'none', // Sets bundling mode to 'none' (no optimizations).
  entry: {
    bundle: './src/app.ts', // Entry point of the application.
  },
  target: 'node', // Bundles code for Node.js environment.
  module: {
    rules: [
      {
        exclude: /node_modules/, // Excludes node_modules from processing.
        use: {
          loader: 'ts-loader', // Processes TypeScript files.
          options: {
            transpileOnly: true, // Speeds up compilation by skipping type checking.
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Resolves these file extensions.
  },
  output: {
    filename: 'app.js', // Names output file after its entry point ('bundle.js') - changed.
    path: resolve(__dirname, 'dist'), // Output directory for the bundled files.
  },
};
export default config;
