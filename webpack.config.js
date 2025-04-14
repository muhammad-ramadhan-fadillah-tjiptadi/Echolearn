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
    assetModuleFilename: "img/[name][ext]", // Simpan semua asset (gambar) di dist/img/
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
        test: /\.(png|jpe?g|webp|gif)$/i,
        type: "asset/resource", // Proses semua gambar jadi file di output
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          sources: {
            list: [
              "...",
              {
                tag: "img",
                attribute: "src",
                type: "src",
              },
            ],
          },
        },
      },
    ],
  },
  plugins: [
    ...htmlFiles, // Gunakan semua file HTML yang ditemukan
    new MiniCssExtractPlugin({
      filename: "css/style.css", // Simpan CSS di dist/css/
    }),
    // Opsional: tetap bisa dipakai kalau kamu ada file lain di folder img
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
