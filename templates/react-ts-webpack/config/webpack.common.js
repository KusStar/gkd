const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../src/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[hash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: 'cache-loader' },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
              happyPackMode: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    // new CopyPlugin(
    //   {
    //     patterns: [
    //       {
    //         from: path.resolve(__dirname, '../assets'),
    //         to: 'assets'
    //       }
    //     ],
    //   }
    // )
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src/')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.png']
  },
}
