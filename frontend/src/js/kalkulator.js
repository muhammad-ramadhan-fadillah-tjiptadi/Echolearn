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

    fetch("http://localhost:3000/api/ac", {
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

    fetch("http://localhost:3000/api/listrik", {
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

    fetch("http://localhost:3000/api/peralatan", {
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
