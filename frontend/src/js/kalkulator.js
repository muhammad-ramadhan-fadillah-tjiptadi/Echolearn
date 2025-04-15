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
    const unitAC = Number.parseFloat(unitInput.value) || 0;
    const kapasitasAC = Number.parseFloat(kapasitasSelect.value) || 0;
    const durasiAC = Number.parseFloat(durasiInput.value) || 0;

    if (unitAC <= 0 || kapasitasAC <= 0 || durasiAC <= 0) {
      alert("Mohon isi semua data dengan benar");
      return;
    }

    const watt = kapasitasAC * 745.7;
    const emisi = (watt * unitAC * durasiAC * 30 * 0.7) / 1000;

    resultSpanAC.textContent = emisi.toFixed(2);

    // Animasi hasil
    animateResult(resultSpanAC);
  });

  // Kalkulator Penggunaan Listrik Wilayah
  const listrikForm = document.getElementById("daya").closest("form");
  const jaringanSelect = document.getElementById("jaringan");
  const dayaInput = document.getElementById("daya");
  const resultSpanListrik = document.getElementById("result-wila");
  const hitungButtonListrik = listrikForm.querySelector("button");

  const faktorEmisi = {
    Jawa: 0.87,
    Sumatra: 0.84,
    Kalimantan: 0.89,
    Sulawesi: 0.83,
    Papua: 0.81,
  };

  hitungButtonListrik.addEventListener("click", () => {
    const jaringan = jaringanSelect.value;
    const daya = Number.parseFloat(dayaInput.value) || 0;
    const faktor = faktorEmisi[jaringan] || 0;

    if (daya <= 0) {
      alert("Mohon isi batas daya dengan benar");
      return;
    }

    const emisiListrik = daya * faktor;
    resultSpanListrik.textContent = emisiListrik.toFixed(2);

    // Animasi hasil
    animateResult(resultSpanListrik);
  });

  // Kalkulator Peralatan Listrik
  const peralatanForm = document.getElementById("peralatan").closest("form");
  const peralatanSelect = document.getElementById("peralatan");
  const jumlahInput = document.getElementById("jumlah");
  const durasiPeralatanInput = document.getElementById("durasi");
  const resultSpanPeralatan = document.getElementById("result-alat");
  const hitungButtonPeralatan = peralatanForm.querySelector("button");

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

  hitungButtonPeralatan.addEventListener("click", () => {
    const peralatan = peralatanSelect.value;
    const jumlah = Number.parseFloat(jumlahInput.value) || 0;
    const durasi = Number.parseFloat(durasiPeralatanInput.value) || 0;
    const watt = dayaPeralatan[peralatan] || 0;

    if (jumlah <= 0 || durasi <= 0) {
      alert("Mohon isi semua data dengan benar");
      return;
    }

    const emisiPeralatan = (watt * jumlah * durasi * 0.7) / 1000;
    resultSpanPeralatan.textContent = emisiPeralatan.toFixed(2);

    // Animasi hasil
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
