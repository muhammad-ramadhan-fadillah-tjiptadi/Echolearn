"use strict";

const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Path ke folder src di dalam folder frontend
const srcPath = path.resolve(__dirname, "frontend", "src");

// Membaca semua file HTML di dalam folder frontend/src
const htmlFiles = fs
  .readdirSync(srcPath)
  .filter((file) => file.endsWith(".html"))
  .map(
    (file) =>
      new HtmlWebpackPlugin({
        template: path.join(srcPath, file),
        filename: file, // Simpan dengan nama yang sama di dist/
      })
  );

module.exports = {
  mode: "development",
  entry: path.join(srcPath, "js", "main.js"),
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    assetModuleFilename: "img/[name][ext]",
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: process.env.PORT || 8080,
    hot: true,
    allowedHosts: 'all',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpe?g|webp|gif)$/i,
        type: "asset/resource",
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
    ...htmlFiles,
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(srcPath, "assets", "img"),
          to: "img",
        },
      ],
    }),
  ],
  resolve: {
    extensions: [".js", ".css"],
  },
};
