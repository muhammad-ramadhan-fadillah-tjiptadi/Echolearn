"use strict";

const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Membaca semua file HTML di dalam folder src
const htmlFiles = fs
  .readdirSync(path.resolve(__dirname, "src"))
  .filter((file) => file.endsWith(".html"))
  .map(
    (file) =>
      new HtmlWebpackPlugin({
        template: `./src/${file}`,
        filename: file, // Simpan dengan nama yang sama di dist/
      })
  );

module.exports = {
  mode: "development",
  entry: "./src/js/main.js",
  output: {
    filename: "js/main.js", // Simpan file JS di dalam dist/js/
    path: path.resolve(__dirname, "dist"),
    clean: true, // Hapus file lama setiap build
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 8080,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpe?g|webp|gif)$/,
        type: "asset/resource",
        generator: {
          filename: "img/[name][ext]", // Simpan gambar di dist/img/
        },
      },
    ],
  },
  plugins: [
    ...htmlFiles, // Gunakan semua file HTML yang ditemukan
    new MiniCssExtractPlugin({
      filename: "css/style.css", // Simpan CSS di dist/css/
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/assets/img", to: "img" }, // Salin folder img ke dist/img/
      ],
    }),
  ],
  resolve: {
    extensions: [".js", ".css"], // Pastikan Webpack bisa menemukan file JS dan CSS
  },
};
