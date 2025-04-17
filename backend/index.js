"use strict";

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ====== API Routes ======

// Hitung Emisi dari AC
app.post("/api/ac", (req, res) => {
  const { unit, kapasitas, durasi } = req.body;

  if (!unit || !kapasitas || !durasi) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  const watt = kapasitas * 745.7;
  const emisi = (watt * unit * durasi * 30 * 0.7) / 1000;
  res.json({ emisi });
});

// Hitung Emisi Listrik Wilayah
app.post("/api/listrik", (req, res) => {
  const { jaringan, daya } = req.body;

  const faktorEmisi = {
    Jawa: 0.87,
    Sumatra: 0.84,
    Kalimantan: 0.89,
    Sulawesi: 0.83,
    Papua: 0.81,
  };

  if (!jaringan || !daya) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  const faktor = faktorEmisi[jaringan] || 0;
  const emisi = daya * faktor;
  res.json({ emisi });
});

// Hitung Emisi Peralatan Listrik
app.post("/api/peralatan", (req, res) => {
  const { jenis, jumlah, durasi } = req.body;

  const dayaPeralatan = {
    Dispenser: 350,
    "Kipas Angin": 103,
    Komputer: 250,
    Laptop: 100,
    Kulkas: 250,
    Printer: 200,
    Microwave: 1000,
    "Rice Cooker": 200,
    "Mesin Photocopy": 900,
  };

  const watt = dayaPeralatan[jenis];

  if (!jenis || !watt || !jumlah || !durasi) {
    return res.status(400).json({ error: "Data tidak lengkap atau tidak valid" });
  }

  const emisi = (watt * jumlah * durasi * 0.7) / 1000;
  res.json({ emisi });
});

// ====== Serve Frontend (dist) ======
app.use(express.static(path.resolve(__dirname, "../dist")));

// Untuk semua route non-API, arahkan ke index.html (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dist/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API & Frontend Server running at http://localhost:${PORT}`);
});
