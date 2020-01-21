const path = require('path');
// 獨立拆分 css 檔
// 記得 js 檔中仍須 import 進來
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('css/[name].css');

module.exports = {
  // 通過將 mode 參數設置為 development 或 production(預設)
  // production可以啟用對應環境下 webpack 內置的優化
  mode: process.env.NODE_ENV,
  // __dirname: 當前目錄的絕對路徑
  // context: 預設起始位置
  context: path.resolve(__dirname, 'src'),
  // 利用 Object 的方式可以有多個entry
  entry: {
    index: './js/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // [name] 會依照 entry 的 name 來更改 output
    filename: 'js/[name].js',
  },
  module: {
    // css-loader
    rules: [
      {
        test: /\.css$/i,
        // Loader 的順序都是由後面執行到前面的
        // style-loader 會將 css 放入 js 中去執行，就不會產生單獨的 .css 檔案
        // use: ['style-loader', 'css-loader'],
        // 透過 plugin 將 css 檔案切分出來，就不需要 style-loader
        use: extractCSS.extract(['css-loader']),
      },
    ],
  },
  plugins: [extractCSS],
};
