const Webpack = require('webpack')
const AssetsPlugin = require('assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')
const path = require('path')

module.exports = function (env, argv) {
  const devMode = process.env.NODE_ENV === 'development'
  let hash = ''

  if (!devMode) {
    hash = '-[hash]'
  }

  return {
    mode: devMode ? 'development' : 'production',
    watch: devMode,
    devtool: devMode ? 'cheap-module-eval-source-map' : undefined,
    entry: {
      main: ['./src/js/index.js', './src/scss/main.scss']
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: `js/[name]${hash}.min.js`,
      chunkFilename: `css/[id]${hash}.min.css`
    },
    devServer: {
      port: process.env.PORT || 1313,
      contentBase: path.join(process.cwd(), './dist'),
      watchContentBase: true,
      quiet: false,
      open: false,
      historyApiFallback: {
        rewrites: [{ from: /./, to: '404.html' }]
      }
    },
    /*
     * NOTE: Optimization will only run on production mode
     */
    optimization: {
      /*
       * Split imported npm packages into a single file
       */
      // splitChunks: {
      //   cacheGroups: {
      //     commons: {
      //       name: 'vendors',
      //       test: /[\\/]node_modules[\\/]/,
      //       chunks: 'all'
      //     }
      //   }
      // },
      minimizer: [
        /*
         * Minimize javascript
         */
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: false,
          extractComments: false,
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              side_effects: false,
              keep_fnames: false
            },
            mangle: {
              keep_fnames: false,
              toplevel: true
            },
            output: {
              beautify: false,
              comments: false
            }
          }
        })
      ]
    },
    module: {
      rules: [
        /*
         * Handle ES6 transpilation
         */
        {
          include: path.join(__dirname, 'src/js'),
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ]
            }
          }
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
                minimize: !devMode
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: devMode
              }
            }
          ]
        },
        /*
         * Handle Fonts
         */
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                include: path.join(__dirname, 'src/fonts'),
                name: '[name].[ext]',
                outputPath: 'fonts',
                publicPath: '../fonts'
              }
            }
          ]
        },
        /*
         * Handle Images Referenced in CSS
         */
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                include: path.join(__dirname, 'static/images'),
                name: '[name].[ext]',
                outputPath: 'images',
                publicPath: '../images'
              }
            },
            'image-webpack-loader'
          ]
        }
      ]
    },
    plugins: [
      /*
       * Clean All Files
       */
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          'dist/**/*.js',
          'dist/**/*.css',
          'data/manifest.json'
        ]
      }),
      /*
       * Manifest hash
       */
      new AssetsPlugin({
        filename: 'manifest.json',
        path: path.join(process.cwd(), 'data'),
        prettyPrint: true
      }),
      /*
       * Extract app CSS and npm package CSS into two separate files
       */
      new MiniCssExtractPlugin({
        filename: `css/main${hash}.min.css`,
        chunkFilename: `css/[id]${hash}.min.css`
      }),
      /*
       * Minimize CSS
       */
      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorOptions: { discardComments: { removeAll: true } }
      })
    ]
  }
}
