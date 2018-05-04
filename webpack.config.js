// webpack.config
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const buildPath = path.resolve(__dirname, 'resource/js')

function buildEntries() {
  let extname = /\.js$/
  return fs.readdirSync(buildPath)
    .reduce((entries, dir) => {
      if (extname.test(dir)) {
        let fileName = dir.replace(extname, '')
        entries[fileName] = path.join(buildPath, dir)
      }
      return entries

    }, {})
}

const config = {
  entry: buildEntries(),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].bundle.js'
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract(['css-loader', 'less-loader'])
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: 'url-loader'

      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['./dist']),
    new ExtractTextPlugin('css/[name].bundle.css')
  ]
}
module.exports = config
