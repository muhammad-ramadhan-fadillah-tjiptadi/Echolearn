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
    // Tentukan chunks berdasarkan nama file HTML
    let chunks = [];
    if (file === "index.html") {
      chunks = ["main"];
    } else if (file === "kalkulator.html") {
      chunks = ["kalkulator"];
    }
    // File HTML lain tidak memiliki JS sendiri

    return new HtmlWebpackPlugin({
      template: path.join(frontendPath, file),
      filename: file,
      chunks: chunks,
      minify: false, // Nonaktifkan minify
      // Penting: Gunakan publicPath relatif untuk HtmlWebpackPlugin
      publicPath: "./",
    });
  });

module.exports = {
  mode: "development",
  entry: {
    // Hanya dua file JS yang kita perlukan
    main: path.join(frontendPath, "src", "js", "main.js"),
    kalkulator: path.join(frontendPath, "src", "js", "kalkulator.js"),
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: false, // PENTING: Diubah ke false, biarkan CleanWebpackPlugin menangani ini
    publicPath: "./", // Ubah ke relatif path dengan './'
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: process.env.PORT || 8080,
    hot: true,
    allowedHosts: "all",
  },
  module: {
    rules: [
      // Rule untuk CSS yang diproses melalui webpack
      {
        test: /\.css$/,
        exclude: [
          // Kecualikan CSS yang ingin disalin langsung
          path.join(frontendPath, "src", "css", "kalkulator.css"),
          path.join(frontendPath, "src", "css", "mision.css"),
          path.join(frontendPath, "src", "css", "style.css"),
        ],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../", // Path relatif untuk asset dalam CSS
            },
          },
          {
            loader: "css-loader",
            options: {
              url: true, // Aktifkan resolusi URL
            },
          },
        ],
      },
      // Rule khusus untuk CSS yang ingin disalin langsung tanpa diproses
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
      // Proses gambar
      {
        test: /\.(png|jpe?g|webp|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/img/[name][ext]", // Simpan gambar hanya dalam folder assets/img
        },
      },
      // HTML processing
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          minimize: false, // Jangan minimize HTML
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
                filter: (tag, attribute, attributes, resourcePath) => {
                  // Abaikan link stylesheet yang spesifik
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
        // Hanya salin folder src/assets/img ke dist/assets/img
        {
          from: path.join(frontendPath, "src", "assets", "img"),
          to: "assets/img", // Folder img akan masuk ke dalam dist/assets/img
          noErrorOnMissing: true,
        },
        // Salin file CSS tertentu tanpa mengubah kontennya
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
          // Opsional: Transform untuk memperbaiki path di dalam CSS
          transform(content) {
            let contentStr = content.toString();
            // Ganti semua URL absolut ke relatif jika perlu
            contentStr = contentStr.replace(
              /url\(['"]?\/img\//g,
              "url('../img/"
            );
            return Buffer.from(contentStr);
          },
        },
      ],
    }),
  ],
  resolve: {
    extensions: [".js", ".css"],
    alias: {
      // Tambahkan alias untuk memudahkan import
      "@img": path.resolve(__dirname, "frontend/img"),
      "@css": path.resolve(__dirname, "frontend/src/css"),
      "@js": path.resolve(__dirname, "frontend/src/js"),
    },
  },
  // Nonaktifkan pembagian dan optimization untuk mencegah file tambahan
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false, // Matikan default cache groups
      },
    },
    minimize: false, // Nonaktifkan minifikasi
  },
  performance: {
    hints: false, // Matikan peringatan performa
  },
};
