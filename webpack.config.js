const Webpack = require('webpack')
const AssetsPlugin = require('assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const path = require('path')
const pathWin32 = require('path').win32

const srcPath = path.resolve(__dirname, './src')
const buildPath = path.resolve(__dirname, './dist')
const jsPath = path.resolve(srcPath, 'js')
const usePath = process.platform == 'win32' ? pathWin32 : path

module.exports = function (env, argv) {
  const devMode = process.env.NODE_ENV === 'development'
  let hash = ''

  if (!devMode) {
    hash = '-[fullhash]'
  }

  return {
    mode: devMode ? 'development' : 'production',
    // watch: devMode,
    devtool: devMode ? 'source-map' : undefined,
    entry: {
      main: ['./src/js/index.js', './src/scss/main.scss'],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: `js/[name]${hash}.min.js`,
      chunkFilename: `css/[id]${hash}.min.css`,
    },
    devServer: {
      port: process.env.PORT || 1313,
      open: false,
      static: {
        directory: path.join(process.cwd(), './dist'),
      },
      historyApiFallback: {
        rewrites: [{ from: /./, to: '404.html' }],
      },
    },
    resolve: {
      alias: {
        '@components': usePath.resolve(__dirname, './src/js/components/'),
        '@utils': usePath.resolve(__dirname, './src/js/utils/'),
      },
    },
    module: {
      rules: [
        /*
         * Handle ES6 transpilation
         */
        {
          include: jsPath,
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [['@babel/plugin-transform-class-properties']],
            },
          },
        },
        /*
         * Handle SCSS transpilation
         */
        {
          include: path.join(__dirname, 'src/scss'),
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: devMode,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: devMode,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      /*
       * Clean All Files
       */
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          'dist/**/*.js',
          'dist/**/*.css',
          'data/manifest.json',
        ],
      }),
      /*
       * Manifest hash
       */
      new AssetsPlugin({
        filename: 'manifest.json',
        path: path.join(process.cwd(), 'data'),
        prettyPrint: true,
        removeFullPathAutoPrefix: true,
      }),
      /*
       * Extract app CSS and npm package CSS into two separate files
       */
      new MiniCssExtractPlugin({
        filename: `css/main${hash}.min.css`,
        chunkFilename: `css/[id]${hash}.min.css`,
      }),
    ],
    /*
     * NOTE: Optimization will only run on production mode
     */
    optimization: {
      minimizer: [
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
        /*
         * Minimize javascript
         */
        new TerserPlugin({
          minify: TerserPlugin.uglifyJsMinify,
          parallel: true,
          extractComments: false,
          terserOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              side_effects: false,
              keep_fnames: false,
            },
            mangle: {
              keep_fnames: false,
              toplevel: true,
            },
            output: {
              beautify: false,
              comments: false,
            },
          },
        }),
      ],
    },
  }
}
