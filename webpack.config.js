"use strict";

const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// Path ke folder frontend
const frontendPath = path.resolve(__dirname, "frontend");

// Membaca semua file HTML di dalam folder frontend
const htmlFiles = fs
  .readdirSync(frontendPath)
  .filter((file) => file.endsWith(".html"))
  .map((file) => {
    let chunks = [];
    if (file === "index.html") {
      chunks = ["main"];
    } else if (file === "kalkulator.html") {
      chunks = ["kalkulator"];
    }

    return new HtmlWebpackPlugin({
      template: path.join(frontendPath, file),
      filename: file,
      chunks: chunks,
      minify: false,
      publicPath: "/Echolearn/", // Disesuaikan untuk GitHub Pages
    });
  });

module.exports = {
  mode: "production",
  entry: {
    main: path.join(frontendPath, "src", "js", "main.js"),
    kalkulator: path.join(frontendPath, "src", "js", "kalkulator.js"),
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: false,
    publicPath: "/Echolearn/", // Ini penting agar GitHub Pages bisa resolve path dengan benar
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: process.env.PORT || 8080,
    hot: true,
    allowedHosts: "all",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: [
          path.join(frontendPath, "src", "css", "kalkulator.css"),
          path.join(frontendPath, "src", "css", "mision.css"),
          path.join(frontendPath, "src", "css", "style.css"),
        ],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          {
            loader: "css-loader",
            options: {
              url: true,
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        include: [
          path.join(frontendPath, "src", "css", "kalkulator.css"),
          path.join(frontendPath, "src", "css", "mision.css"),
          path.join(frontendPath, "src", "css", "style.css"),
        ],
        type: "asset/resource",
        generator: {
          filename: "css/[name][ext]",
        },
      },
      {
        test: /\.(png|jpe?g|webp|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/img/[name][ext]",
        },
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          minimize: false,
          sources: {
            list: [
              {
                tag: "img",
                attribute: "src",
                type: "src",
              },
              {
                tag: "link",
                attribute: "href",
                type: "src",
                filter: (tag, attribute, attributes) => {
                  if (
                    attributes.rel &&
                    attributes.rel.value === "stylesheet" &&
                    (attribute.value.includes("kalkulator.css") ||
                      attribute.value.includes("mision.css") ||
                      attribute.value.includes("style.css"))
                  ) {
                    return false;
                  }
                  return true;
                },
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
      filename: "css/[name].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(frontendPath, "src", "assets", "img"),
          to: "assets/img",
          noErrorOnMissing: true,
        },
        {
          from: path.join(frontendPath, "src", "css", "kalkulator.css"),
          to: "css/kalkulator.css",
        },
        {
          from: path.join(frontendPath, "src", "css", "mision.css"),
          to: "css/mision.css",
        },
        {
          from: path.join(frontendPath, "src", "css", "style.css"),
          to: "css/style.css",
          transform(content) {
            let contentStr = content.toString();
            contentStr = contentStr.replace(
              /url\(['"]?\/img\//g,
              "url('../img/"
            );
            return Buffer.from(contentStr);
          },
        },
      ],
    }),
    // new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: [".js", ".css"],
    alias: {
      "@img": path.resolve(__dirname, "frontend/img"),
      "@css": path.resolve(__dirname, "frontend/src/css"),
      "@js": path.resolve(__dirname, "frontend/src/js"),
    },
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false,
      },
    },
    minimize: false,
  },
  performance: {
    hints: false,
  },
};
