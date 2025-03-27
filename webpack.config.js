const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map", // Membantu debugging CSS dan JS
  entry: "./src/js/main.js",
  output: {
    filename: "js/main.js", // Simpan JS di folder dist/js/
    path: path.resolve(__dirname, "dist"),
    clean: true, // Bersihkan dist setiap build baru
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 8080,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"], // Proses file HTML
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "img/[name][ext]", // Simpan gambar di dist/img/
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"], // Ekstrak CSS
      },
    ],
  },
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()], // Minifikasi CSS
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/article.html",
      filename: "article.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/kalkulator.html",
      filename: "kalkulator.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/tips-trick.html",
      filename: "tips-trick.html",
    }),
    new MiniCssExtractPlugin({
      filename: "css/styles.css", // Simpan CSS di dist/css/
    }),
  ],
};
