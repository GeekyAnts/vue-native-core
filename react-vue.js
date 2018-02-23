const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const WebpackConfig = {

  // devtool: 'inline-source-map',

  entry: {
    build: './dev/react-vue/index.js',
    vendor: ['react', 'react-dom', 'react-vue', 'react-vue-helper']
  },

  output: {
    filename: '[name].js'
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.vue$/,
        loader: 'react-vue-loader',
        options: {
          extractCSS: true,
          output: true,
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
          name: './dev/react-vue/[name].[ext]?[hash]'
        }
      }
    ]
  },

  resolve: {
    extensions: ['.vue', '.js'],
    alias: {
      'react-vue': path.resolve(__dirname, 'packages/react-vue/build.js'),
      'react-vue-helper': path.resolve(__dirname, 'packages/react-vue-helper/build.js')
    }
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

const port = process.env.PORT || 8084
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
