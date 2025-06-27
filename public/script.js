document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, inisialisasi aplikasi");
    const backendUrl = "/.netlify/functions";
    let pegawaiList = [];
    let pengikutList = [];

    // Set tanggal default berdasarkan tanggal saat ini
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const currentMonth = monthNames[today.getMonth()];
    const currentYear = today.getFullYear();

    // Set nilai default untuk field tanggal (pastikan ini menargetkan kedua form jika IDnya unik)
    // Untuk SPT
    const sptMulaiInput = document.querySelector("#spt-mulai");
    if (sptMulaiInput) {
        sptMulaiInput.value = formatDate(today);
        console.log("Tanggal Mulai SPT diatur ke:", sptMulaiInput.value);
    }
    const sptBerakhirInput = document.querySelector("#spt-berakhir");
    if (sptBerakhirInput) {
        sptBerakhirInput.value = formatDate(tomorrow);
        console.log("Tanggal Berakhir SPT diatur ke:", sptBerakhirInput.value);
    }
    const sptTahunInput = document.querySelector("#spt-tahun");
    if (sptTahunInput) {
        sptTahunInput.value = currentYear;
        console.log("Tahun Anggaran SPT diatur ke:", sptTahunInput.value);
    }

    // Untuk SPPD
    const sppdMulaiInput = document.querySelector("#sppd-mulai");
    if (sppdMulaiInput) {
        sppdMulaiInput.value = formatDate(today);
        console.log("Tanggal Mulai SPPD diatur ke:", sppdMulaiInput.value);
    }
    const sppdBerakhirInput = document.querySelector("#sppd-berakhir");
    if (sppdBerakhirInput) {
        sppdBerakhirInput.value = formatDate(tomorrow);
        console.log("Tanggal Berakhir SPPD diatur ke:", sppdBerakhirInput.value);
    }
    const sppdTahunInput = document.querySelector("#sppd-tahun");
    if (sppdTahunInput) {
        sppdTahunInput.value = currentYear;
        console.log("Tahun Anggaran SPPD diatur ke:", sppdTahunInput.value);
    }

    const bulanttdInput = document.querySelector("#bulanttd"); // Ini hanya di SPT
    if (bulanttdInput) {
        bulanttdInput.value = currentMonth;
        console.log("Bulan TTD diatur ke:", bulanttdInput.value);
    }

    // Ambil data dari backend
    fetch(`${backendUrl}/data`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Gagal mengambil data dari backend: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data diterima dari backend:", data);

            // Isi dropdown OPD (untuk SPT dan SPPD)
            const sptOpdSelect = document.querySelector("#spt-opd"); // <-- Perubahan ID
            if (sptOpdSelect) {
                data.opd.forEach(opd => {
                    const option = document.createElement("option");
                    option.value = opd.value;
                    option.textContent = opd.nama;
                    sptOpdSelect.appendChild(option);
                });
                console.log("Dropdown OPD SPT diisi dengan", data.opd.length, "opsi");
            } else {
                console.error("Elemen #spt-opd tidak ditemukan");
            }

            const sppdOpdSelect = document.querySelector("#sppd-opd"); // <-- Perubahan ID
            if (sppdOpdSelect) {
                data.opd.forEach(opd => {
                    const option = document.createElement("option");
                    option.value = opd.value;
                    option.textContent = opd.nama;
                    sppdOpdSelect.appendChild(option);
                });
                console.log("Dropdown OPD SPPD diisi dengan", data.opd.length, "opsi");
            } else {
                console.error("Elemen #sppd-opd tidak ditemukan");
            }


            // Isi dropdown Pegawai untuk SPT
            const pegawaiSelect = document.querySelector("#pegawai");
            if (pegawaiSelect) {
                data.pegawai.forEach((pegawai, index) => {
                    const option = document.createElement("option");
                    option.value = index;
                    option.textContent = pegawai.nama;
                    pegawaiSelect.appendChild(option);
                });
                console.log("Dropdown Pegawai SPT diisi dengan", data.pegawai.length, "opsi");
            } else {
                console.error("Elemen #pegawai tidak ditemukan");
            }

            // Isi dropdown Pegawai Utama untuk SPPD
            const pegawaiUtamaSelect = document.querySelector("#pegawai-utama");
            if (pegawaiUtamaSelect) {
                data.pegawai.forEach((pegawai, index) => {
                    const option = document.createElement("option");
                    option.value = index;
                    option.textContent = pegawai.nama;
                    pegawaiUtamaSelect.appendChild(option);
                });
                console.log("Dropdown Pegawai Utama diisi dengan", data.pegawai.length, "opsi");
            } else {
                console.error("Elemen #pegawai-utama tidak ditemukan");
            }

            // Isi dropdown Pengikut untuk SPPD
            const pengikutSelect = document.querySelector("#pengikut");
            if (pengikutSelect) {
                data.pegawai.forEach((pegawai, index) => {
                    const option = document.createElement("option");
                    option.value = index;
                    option.textContent = pegawai.nama;
                    pengikutSelect.appendChild(option);
                });
                console.log("Dropdown Pengikut diisi dengan", data.pegawai.length, "opsi");
            } else {
                console.error("Elemen #pengikut tidak ditemukan");
            }

            // Isi dropdown Pejabat (untuk SPT)
            const pejabatSelect = document.querySelector("#pejabat");
            if (pejabatSelect) {
                data.pejabat.forEach((pejabat, index) => {
                    const option = document.createElement("option");
                    option.value = index;
                    option.textContent = pejabat.nama;
                    pejabatSelect.appendChild(option);
                });
                console.log("Dropdown Pejabat SPT diisi dengan", data.pejabat.length, "opsi");
            } else {
                console.error("Elemen #pejabat tidak ditemukan");
            }

            // Isi dropdown PPTK untuk SPPD
            const pptkSelect = document.querySelector("#pptk");
            if (pptkSelect) {
                data.pejabat.forEach((pejabat, index) => {
                    const option = document.createElement("option");
                    option.value = index;
                    option.textContent = pejabat.nama;
                    pptkSelect.appendChild(option);
                });
                console.log("Dropdown PPTK diisi dengan", data.pejabat.length, "opsi");
            } else {
                console.error("Elemen #pptk tidak ditemukan");
            }

            // Isi dropdown Alat Angkut untuk SPPD
            const alatAngkutSelect = document.querySelector("#alat-angkut");
            if (alatAngkutSelect) {
                data.alatAngkut.forEach(alat => {
                    const option = document.createElement("option");
                    option.value = alat.value;
                    option.textContent = alat.nama;
                    alatAngkutSelect.appendChild(option);
                });
                console.log("Dropdown Alat Angkut diisi dengan", data.alatAngkut.length, "opsi");
            } else {
                console.error("Elemen #alat-angkut tidak ditemukan");
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Gagal mengambil data untuk dropdown: " + error.message);
        });

    // Toggle form berdasarkan jenis naskah
    const naskahSelect = document.querySelector("#naskah");
    if (naskahSelect) {
        naskahSelect.addEventListener("change", (e) => {
            const sptForm = document.querySelector("#spt-form");
            const sppdForm = document.querySelector("#sppd-form");
            if (e.target.value === "SPT") {
                sptForm.style.display = "block";
                sppdForm.style.display = "none";
            } else if (e.target.value === "SPPD") {
                sptForm.style.display = "none";
                sppdForm.style.display = "block";
            } else {
                sptForm.style.display = "none";
                sppdForm.style.display = "none";
            }
            console.log("Jenis naskah dipilih:", e.target.value);
        });
    } else {
        console.error("Elemen #naskah tidak ditemukan");
    }

    // Tambah pegawai ke daftar SPT
    const addPegawaiBtn = document.querySelector("#add-pegawai");
    if (addPegawaiBtn) {
        addPegawaiBtn.addEventListener("click", () => {
            const pegawaiSelect = document.querySelector("#pegawai");
            const selectedPegawai = pegawaiSelect.options[pegawaiSelect.selectedIndex];
            if (selectedPegawai && selectedPegawai.value && !pegawaiList.includes(selectedPegawai.value)) {
                pegawaiList.push(selectedPegawai.value);
                const pegawaiListDiv = document.querySelector("#pegawai-list");
                const pegawaiItem = document.createElement("div");
                pegawaiItem.textContent = selectedPegawai.textContent;
                pegawaiListDiv.appendChild(pegawaiItem);
                console.log("Pegawai ditambahkan:", pegawaiList);
            } else {
                console.warn("Pegawai tidak valid atau sudah ditambahkan");
            }
        });
    } else {
        console.error("Elemen #add-pegawai tidak ditemukan");
    }

    // Tambah pengikut ke daftar SPPD
    const addPengikutBtn = document.querySelector("#add-pengikut");
    if (addPengikutBtn) {
        addPengikutBtn.addEventListener("click", () => {
            const pengikutSelect = document.querySelector("#pengikut");
            const selectedPengikut = pengikutSelect.options[pengikutSelect.selectedIndex];
            if (selectedPengikut && selectedPengikut.value && !pengikutList.includes(selectedPengikut.value)) {
                pengikutList.push(selectedPengikut.value);
                const pengikutListDiv = document.querySelector("#pengikut-list");
                const pengikutItem = document.createElement("div");
                pengikutItem.textContent = selectedPengikut.textContent;
                pengikutListDiv.appendChild(pengikutItem);
                console.log("Pengikut ditambahkan:", pengikutList);
            } else {
                console.warn("Pengikut tidak valid atau sudah ditambahkan");
            }
        });
    } else {
        console.error("Elemen #add-pengikut tidak ditemukan");
    }

    // Submit form
    const submitBtn = document.querySelector("#submit-btn");
    if (submitBtn) {
        submitBtn.addEventListener("click", async () => {
            const naskah = document.querySelector("#naskah")?.value || "";
            if (!naskah) {
                alert("Pilih jenis naskah terlebih dahulu");
                return;
            }
            const formData = {}; // Inisialisasi kosong, akan diisi sesuai naskah

            // URL endpoint akan berubah secara otomatis
            const endpoint = naskah === "SPT" ? `${backendUrl}/generate-spt` : `${backendUrl}/generate-sppd`;

            if (naskah === "SPT") {
                formData.jenis_pengawasan = document.querySelector("#spt-pengawasan")?.value || "";
                formData.opd = document.querySelector("#spt-opd")?.value || "";
                formData.tahun = document.querySelector("#spt-tahun")?.value || "";
                formData.tglmulai = document.querySelector("#spt-mulai")?.value || "";
                formData.tglberakhir = document.querySelector("#spt-berakhir")?.value || "";
                formData.selected_pegawai_indices = pegawaiList;
                formData.pejabat_index = document.querySelector("#pejabat")?.value || "";
                formData.bulanttd = document.querySelector("#bulanttd")?.value || "";
            } else if (naskah === "SPPD") {
                formData.jenis_pengawasan = document.querySelector("#sppd-pengawasan")?.value || ""; // <-- Perubahan ID
                formData.opd = document.querySelector("#sppd-opd")?.value || ""; // <-- Perubahan ID
                formData.tahun = document.querySelector("#sppd-tahun")?.value || ""; // <-- Perubahan ID
                formData.tglmulai = document.querySelector("#sppd-mulai")?.value || ""; // <-- Perubahan ID
                formData.tglberakhir = document.querySelector("#sppd-berakhir")?.value || ""; // <-- Perubahan ID
                formData.pegawai_utama_index = document.querySelector("#pegawai-utama")?.value || "";
                formData.pengikut_indices = pengikutList;
                formData.alat_angkut = document.querySelector("#alat-angkut")?.value || "";
                formData.pptk_index = document.querySelector("#pptk")?.value || "";
            }

            console.log("Mengirim data ke", endpoint, formData);

            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Gagal menghasilkan dokumen");
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = naskah === "SPT" ? "SPT_Generated.docx" : "SPPD_Generated.docx";
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error:", error);
                alert("Terjadi kesalahan: " + error.message);
            }
        });
    } else {
        console.error("Elemen #submit-btn tidak ditemukan");
    }
});