const path = require('path');
// 獨立拆分 css 檔
// 記得 js 檔中仍須 import 進來
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const extractCSS = new ExtractTextPlugin('css/[name].css');

// 檔案搬移
const CopyPlugin = require('copy-webpack-plugin');
// html 模板
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    // ? 後接的是位元數，目的防止瀏覽器記住快取
    // 也可以這樣使用 'js/[name].[hash:8].js'，好處是打包後，會自帶 8位元數於檔名，方便做版本控管
    filename: 'js/[name].js?[hash:8]',
  },
  // 透過 Vendor.js 獨立出來可以有效率地進行打包
  // node_modules 打包為 Vendor.js
  // 自己的 js 打包為 Entry.js
  // 優點: 網頁會把 Vendor.js 記為快取，避免每次進入重複讀取
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true,
        },
      },
    },
  },
  // webpack-dev-server
  devServer: {
    compress: true,
    port: 3000,
    stats: {
      assets: true, // 加入資源訊息
      cached: false, // 加入暫存(但未建構)模塊的訊息
      chunkModules: false, // 將建構模塊訊息加入倒 chunk 信息
      chunkOrigins: false,
      chunks: false, // 加入 chunks 訊息(設置為 false 能允許較少的冗長輸出)
      colors: true, // 等同 webpack --colors
      hash: false, // 加入 compilation 的 hash
      modules: false, // 加入建構模塊訊息
      reasons: false, // 加入模塊被引入的原因
      source: false, // 加入模塊的原碼
      version: false, // 加入 webpack 版本訊息
      warnings: false, // 加入警告
    },
    // 解決跨網域問題
    proxy: {
      '/api': {
        target: 'http://www.vscinemas.com.tw/VsWeb/api',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  module: {
    rules: [
      // css-loader
      {
        test: /\.css$/i,
        // Loader 的順序都是由後面執行到前面的
        // style-loader 會將 css 放入 js 中去執行，就不會產生單獨的 .css 檔案
        use: ['style-loader', 'css-loader'],
        // 透過 plugin 將 css 檔案切分出來，就不需要 style-loader
        // use: extractCSS.extract(['css-loader']),
      },
      // file-loader
      {
        // 把 html 搬到 dist
        test: /\.html$/i,
        exclude: /templates/,
        loader: 'file-loader',
        options: {
          // path: 路徑
          // name: 檔名
          // ext: 副檔名
          name: '[path][name].[ext]',
        },
      },
      // image-webpack-loader
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            // 圖片壓縮設定
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      // sass-loader
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // 主要來處理 Autoprefixing(前綴字) 的轉換
          // 需額外安裝 npm install postcss-cli autoprefixer
          'postcss-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      // babel-loader
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    // extractCSS,

    // 檔案原封不動搬移
    // file-loader 可以進行過濾
    new CopyPlugin([
      // { from: 'source', to: 'dest' },
      // { from: 'other', to: 'public' },
      { from: 'assets', to: 'assets' },
    ]),
    // 共用 html 模板
    new HtmlWebpackPlugin({
      title: 'Webpack前端自動化開發',
      // 輸出的檔案名稱
      filename: 'index.html',
      template: 'templates/layout.html',
      viewport: 'width=640, user-scalable=no',
      description: 'Webpack前端自動化開發，讓你熟悉現代前端工程師開發的方法',
      Keywords: 'Webpack前端自動化開發、前端、工程師、線上教學、教學範例',
      // 須和 entry 名稱相同
      // 有使用 node_modules 的打包，才需加入 vendor
      chunks: ['vendor', 'index'],
    }),
  ],
};
