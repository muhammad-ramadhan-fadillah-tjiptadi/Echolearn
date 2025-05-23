/******/ (() => { // webpackBootstrap
document.addEventListener("DOMContentLoaded", () => {
  // Navigasi antar halaman
  const landingPage = document.getElementById("landing-page");
  const calculatorPage = document.getElementById("calculator-page");
  const startButton = document.getElementById("start-button");
  const backButton = document.getElementById("back-button");

  startButton.addEventListener("click", () => {
    landingPage.classList.add("hidden");
    calculatorPage.classList.remove("hidden");
    window.scrollTo(0, 0);
  });

  backButton.addEventListener("click", () => {
    calculatorPage.classList.add("hidden");
    landingPage.classList.remove("hidden");
    window.scrollTo(0, 0);
  });

  // Kalkulator AC
  const acForm = document.querySelector(".sumber-card:nth-child(1) form");
  const unitInput = document.getElementById("unit");
  const kapasitasSelect = document.getElementById("kapasitas");
  const durasiInput = document.getElementById("durasi-ac");
  const resultSpanAC = document.getElementById("result-ac");
  const hitungButtonAC = acForm.querySelector("button");

  hitungButtonAC.addEventListener("click", () => {
    const unitAC = Number.parseFloat(unitInput.value.trim()) || 0;
    const kapasitasAC = Number.parseFloat(kapasitasSelect.value) || 0;
    const durasiAC = Number.parseFloat(durasiInput.value.trim()) || 0;

    if (unitAC <= 0 || isNaN(unitAC) || kapasitasAC <= 0 || isNaN(kapasitasAC) || durasiAC <= 0 || isNaN(durasiAC)) {
      alert("Mohon isi semua data dengan benar");
      return;
    }

    fetch("https://echolearn-production-5dd5.up.railway.app/api/ac", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unit: unitAC,
        kapasitas: kapasitasAC,
        durasi: durasiAC,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        resultSpanAC.textContent = data.emisi.toFixed(2);
        animateResult(resultSpanAC);
      })
      .catch((err) => {
        console.error("Gagal hitung AC:", err);
        alert("Terjadi kesalahan saat menghitung AC.");
      });

    animateResult(resultSpanAC);
  });

  // Kalkulator Penggunaan Listrik Wilayah
  const listrikForm = document.querySelector(".sumber-card:nth-child(2) form");
  const jaringanSelect = document.getElementById("jaringan");
  const dayaInput = document.getElementById("daya");
  const resultSpanListrik = document.getElementById("result-wila");
  const hitungButtonListrik = listrikForm.querySelector("button");

  hitungButtonListrik.addEventListener("click", () => {
    const jaringan = jaringanSelect.value;
    const daya = Number.parseFloat(dayaInput.value.trim()) || 0;

    if (daya <= 0 || isNaN(daya)) {
      alert("Mohon isi batas daya dengan benar");
      return;
    }

    fetch("https://echolearn-production-5dd5.up.railway.app/api/listrik", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jaringan: jaringan,
        daya: daya,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        resultSpanListrik.textContent = data.emisi.toFixed(2);
        animateResult(resultSpanListrik);
      })
      .catch((err) => {
        console.error("Gagal hitung listrik:", err);
        alert("Terjadi kesalahan saat menghitung listrik.");
      });

    animateResult(resultSpanListrik);
  });

  // Kalkulator Peralatan Listrik
  const peralatanForm = document.querySelector(".sumber-card:nth-child(3) form");
  const peralatanSelect = document.getElementById("peralatan");
  const jumlahInput = document.getElementById("jumlah");
  const durasiPeralatanInput = document.getElementById("durasi");
  const resultSpanPeralatan = document.getElementById("result-alat");
  const hitungButtonPeralatan = peralatanForm.querySelector("button");

  hitungButtonPeralatan.addEventListener("click", () => {
    const peralatan = peralatanSelect.value;
    const jumlah = Number.parseFloat(jumlahInput.value.trim()) || 0;
    const durasi = Number.parseFloat(durasiPeralatanInput.value.trim()) || 0;

    if (jumlah <= 0 || isNaN(jumlah) || durasi <= 0 || isNaN(durasi)) {
      alert("Mohon isi semua data dengan benar");
      return;
    }

    fetch("https://echolearn-production-5dd5.up.railway.app/api/peralatan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jenis: peralatan,
        jumlah: jumlah,
        durasi: durasi,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        resultSpanPeralatan.textContent = data.emisi.toFixed(2);
        animateResult(resultSpanPeralatan);
      })
      .catch((err) => {
        console.error("Gagal hitung alat:", err);
        alert("Terjadi kesalahan saat menghitung peralatan.");
      });

    animateResult(resultSpanPeralatan);
  });

  // Fungsi untuk animasi hasil
  function animateResult(element) {
    element.style.transition = "none";
    element.style.transform = "scale(1.3)";
    element.style.color = "#4caf50";

    setTimeout(() => {
      element.style.transition = "all 0.5s ease";
      element.style.transform = "scale(1)";
    }, 50);
  }

  // Validasi input hanya angka
  const numberInputs = document.querySelectorAll('input[type="number"]');
  numberInputs.forEach((input) => {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9.]/g, "");
    });
  });
});

/******/ })()
;