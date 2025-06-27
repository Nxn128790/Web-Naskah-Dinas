document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, inisialisasi aplikasi");
    const backendUrl = "/.netlify/functions"; // URL untuk Netlify Functions
    let pegawaiList = []; // Menyimpan indeks pegawai yang dipilih untuk SPT
    let pengikutList = []; // Menyimpan indeks pengikut yang dipilih untuk SPPD

    // --- Helper Functions ---
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

    // --- Inisialisasi Tanggal & Tahun untuk kedua form (SPT & SPPD) ---
    // SPT Form
    const sptMulaiInput = document.querySelector("#spt-mulai");
    if (sptMulaiInput) {
        sptMulaiInput.value = formatDate(today);
        console.log("Tanggal Mulai SPT diatur ke:", sptMulaiInput.value);
    } else { console.error("Elemen #spt-mulai tidak ditemukan"); }

    const sptBerakhirInput = document.querySelector("#spt-berakhir");
    if (sptBerakhirInput) {
        sptBerakhirInput.value = formatDate(tomorrow);
        console.log("Tanggal Berakhir SPT diatur ke:", sptBerakhirInput.value);
    } else { console.error("Elemen #spt-berakhir tidak ditemukan"); }

    const sptTahunInput = document.querySelector("#spt-tahun");
    if (sptTahunInput) {
        sptTahunInput.value = currentYear;
        console.log("Tahun Anggaran SPT diatur ke:", sptTahunInput.value);
    } else { console.error("Elemen #spt-tahun tidak ditemukan"); }

    const bulanttdInput = document.querySelector("#bulanttd");
    if (bulanttdInput) {
        bulanttdInput.value = currentMonth;
        console.log("Bulan TTD diatur ke:", bulanttdInput.value);
    } else { console.error("Elemen #bulanttd tidak ditemukan"); }

    // SPPD Form
    const sppdMulaiInput = document.querySelector("#sppd-mulai");
    if (sppdMulaiInput) {
        sppdMulaiInput.value = formatDate(today);
        console.log("Tanggal Mulai SPPD diatur ke:", sppdMulaiInput.value);
    } else { console.error("Elemen #sppd-mulai tidak ditemukan"); }

    const sppdBerakhirInput = document.querySelector("#sppd-berakhir");
    if (sppdBerakhirInput) {
        sppdBerakhirInput.value = formatDate(tomorrow);
        console.log("Tanggal Berakhir SPPD diatur ke:", sppdBerakhirInput.value);
    } else { console.error("Elemen #sppd-berakhir tidak ditemukan"); }

    const sppdTahunInput = document.querySelector("#sppd-tahun");
    if (sppdTahunInput) {
        sppdTahunInput.value = currentYear;
        console.log("Tahun Anggaran SPPD diatur ke:", sppdTahunInput.value);
    } else { console.error("Elemen #sppd-tahun tidak ditemukan"); }


    // --- Ambil data dari backend dan Isi Dropdown ---
    fetch(`${backendUrl}/data`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Gagal mengambil data dari backend: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data diterima dari backend:", data);

            // Fungsi helper untuk mengisi dropdown
            const populateDropdown = (selectElement, items, textKey, valueKey = 'index') => {
                if (selectElement) {
                    selectElement.innerHTML = '<option value="">Pilih...</option>'; // Kosongkan opsi lama
                    
                    items.forEach((item, index) => {
                        const option = document.createElement("option");
                        option.value = (valueKey === 'index') ? index : item[valueKey];
                        option.textContent = item[textKey];
                        selectElement.appendChild(option);
                    });
                    console.log(`Dropdown ${selectElement.id} diisi dengan ${items.length} opsi`);
                } else {
                    console.error(`Elemen #${selectElement.id} tidak ditemukan`);
                }
            };

            // Isi dropdown OPD (untuk SPT dan SPPD)
            const sptOpdSelect = document.querySelector("#spt-opd");
            populateDropdown(sptOpdSelect, data.opd, 'nama', 'value');

            const sppdOpdSelect = document.querySelector("#sppd-opd");
            populateDropdown(sppdOpdSelect, data.opd, 'nama', 'value');

            // Isi dropdown Pegawai untuk SPT
            const pegawaiSelect = document.querySelector("#pegawai");
            populateDropdown(pegawaiSelect, data.pegawai, 'nama');

            // Isi dropdown Pegawai Utama untuk SPPD
            const pegawaiUtamaSelect = document.querySelector("#pegawai-utama");
            populateDropdown(pegawaiUtamaSelect, data.pegawai, 'nama');

            // Isi dropdown Pengikut untuk SPPD
            const pengikutSelect = document.querySelector("#pengikut");
            populateDropdown(pengikutSelect, data.pegawai, 'nama');

            // Isi dropdown Pejabat (untuk SPT)
            const pejabatSelect = document.querySelector("#pejabat");
            populateDropdown(pejabatSelect, data.pejabat, 'nama');

            // Isi dropdown PPTK untuk SPPD
            const pptkSelect = document.querySelector("#pptk");
            populateDropdown(pptkSelect, data.pejabat, 'nama');

            // Isi dropdown Alat Angkut untuk SPPD
            const alatAngkutSelect = document.querySelector("#alat-angkut");
            populateDropdown(alatAngkutSelect, data.alatAngkut, 'nama', 'value');


            // --- INISIALISASI SELECT2 SETELAH SEMUA DROPDOWN DIISI ---
            // Inisialisasi semua dropdown dengan class 'modern-dropdown'
            $('.modern-dropdown').select2({
                placeholder: 'Pilih...',
                allowClear: true // Opsi untuk memungkinkan pilihan dikosongkan
            });

            // Khusus untuk dropdown #naskah, mungkin tidak perlu kotak pencarian
            $('#naskah').select2({
                minimumResultsForSearch: -1, // Menyembunyikan kotak pencarian
                placeholder: 'Pilih Jenis Naskah',
                allowClear: true
            });

        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Gagal mengambil data untuk dropdown: " + error.message);
        });

    // --- Toggle Form Berdasarkan Jenis Naskah ---
    const naskahSelect = document.querySelector("#naskah");
    const submitBtn = document.querySelector("#submit-btn"); // Ambil referensi tombol submit

    // PERUBAHAN: Sembunyikan kedua form saat halaman dimuat
    const sptForm = document.querySelector("#spt-form");
    const sppdForm = document.querySelector("#sppd-form");
    if (sptForm) sptForm.style.display = "none";
    if (sppdForm) sppdForm.style.display = "none";
    if (submitBtn) submitBtn.disabled = true; // Nonaktifkan tombol submit secara default

    if (naskahSelect) {
        naskahSelect.addEventListener("change", (e) => {
            // Reset list pegawai/pengikut saat jenis naskah berubah
            pegawaiList = [];
            pengikutList = [];
            if (document.querySelector("#pegawai-list")) {
                document.querySelector("#pegawai-list").innerHTML = "";
            }
            if (document.querySelector("#pengikut-list")) {
                document.querySelector("#pengikut-list").innerHTML = "";
            }

            // Reset Select2 pilihan yang ada saat form disembunyikan
            $('.modern-dropdown').val(null).trigger('change');
            
            if (e.target.value === "SPT") {
                if (sptForm) sptForm.style.display = "block"; // Tampilkan form SPT
                if (sppdForm) sppdForm.style.display = "none"; // Sembunyikan form SPPD
                if (submitBtn) submitBtn.disabled = false; // Aktifkan tombol submit
            } else if (e.target.value === "SPPD") {
                if (sptForm) sptForm.style.display = "none"; // Sembunyikan form SPT
                if (sppdForm) sppdForm.style.display = "block"; // Tampilkan form SPPD
                if (submitBtn) submitBtn.disabled = false; // Aktifkan tombol submit
            } else {
                if (sptForm) sptForm.style.display = "none";
                if (sppdForm) sppdForm.style.display = "none";
                if (submitBtn) submitBtn.disabled = true; // Nonaktifkan tombol submit jika tidak ada naskah terpilih
            }
            console.log("Jenis naskah dipilih:", e.target.value);
        });
    } else { console.error("Elemen #naskah tidak ditemukan"); }

    // --- Tambah Pegawai ke Daftar SPT ---
    const addPegawaiBtn = document.querySelector("#add-pegawai");
    if (addPegawaiBtn) {
        addPegawaiBtn.addEventListener("click", () => {
            const pegawaiSelect = document.querySelector("#pegawai");
            // Mengambil nilai dari Select2
            const selectedValue = $(pegawaiSelect).val();
            const selectedText = $(pegawaiSelect).find('option:selected').text();

            if (selectedValue && selectedValue !== "" && !pegawaiList.includes(selectedValue)) {
                pegawaiList.push(selectedValue);
                const pegawaiListDiv = document.querySelector("#pegawai-list");
                const pegawaiItem = document.createElement("div");
                pegawaiItem.textContent = selectedText;
                pegawaiListDiv.appendChild(pegawaiItem);
                console.log("Pegawai ditambahkan:", pegawaiList);
                // Opsional: Reset Select2 setelah ditambahkan
                // $(pegawaiSelect).val(null).trigger('change'); // Ini akan mengosongkan pilihan
            } else {
                console.warn("Pegawai tidak valid atau sudah ditambahkan (SPT)");
            }
        });
    } else { console.error("Elemen #add-pegawai tidak ditemukan"); }

    // --- Tambah Pengikut ke Daftar SPPD ---
    const addPengikutBtn = document.querySelector("#add-pengikut");
    if (addPengikutBtn) {
        addPengikutBtn.addEventListener("click", () => {
            const pengikutSelect = document.querySelector("#pengikut");
            // Mengambil nilai dari Select2
            const selectedValue = $(pengikutSelect).val();
            const selectedText = $(pengikutSelect).find('option:selected').text();

            if (selectedValue && selectedValue !== "" && !pengikutList.includes(selectedValue)) {
                pengikutList.push(selectedValue);
                const pengikutListDiv = document.querySelector("#pengikut-list");
                const pengikutItem = document.createElement("div");
                pengikutItem.textContent = selectedText; // Koreksi: gunakan pengikutItem
                pengikutListDiv.appendChild(pengikutItem);
                console.log("Pengikut ditambahkan:", pengikutList);
                // Opsional: Reset Select2 setelah ditambahkan
                // $(pengikutSelect).val(null).trigger('change');
            } else {
                console.warn("Pengikut tidak valid atau sudah ditambahkan (SPPD)");
            }
        });
    } else { console.error("Elemen #add-pengikut tidak ditemukan"); }

    // --- Submit Form dan Unduh Dokumen ---
    // Referensi ke submitBtn sudah diambil di awal saat toggle form
    if (submitBtn) {
        submitBtn.addEventListener("click", async () => {
            const naskah = document.querySelector("#naskah")?.value || "";
            if (!naskah) {
                alert("Pilih jenis naskah terlebih dahulu");
                return;
            }
            const formData = {};

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
                formData.jenis_pengawasan = document.querySelector("#sppd-pengawasan")?.value || "";
                formData.opd = document.querySelector("#sppd-opd")?.value || "";
                formData.tahun = document.querySelector("#sppd-tahun")?.value || "";
                formData.tglmulai = document.querySelector("#sppd-mulai")?.value || "";
                formData.tglberakhir = document.querySelector("#sppd-berakhir")?.value || "";
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
    } else { console.error("Elemen #submit-btn tidak ditemukan"); }
});