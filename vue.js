const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const WebpackConfig = {

  // devtool: 'inline-source-map',

  entry: {
    build: './dev/vue/index.js',
    vendor: ['vue']
  },

  output: {
    filename: '[name].js'
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true,
          cssModules: {
            localIdentName: '[path][name]---[local]---[hash:base64:5]',
            camelCase: true
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: './dev/vue/[name].[ext]?[hash]'
        }
      }
    ]
  },

  resolve: {
    extensions: ['.vue', '.js']
  },

  // Expose __dirname to allow automatically setting basename.
  context: __dirname,
  node: {
    __dirname: true
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor' // Specify the common bundle's name.
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new ExtractTextPlugin('style.css')
  ]

}
const app = express()

app.use(webpackDevMiddleware(webpack(WebpackConfig)))

app.use(express.static(__dirname))

const port = process.env.PORT || 8083
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
