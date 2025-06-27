document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, inisialisasi aplikasi");
    const backendUrl = "/.netlify/functions"; // URL untuk Netlify Functions
    let pegawaiList = []; // Menyimpan indeks pegawai yang dipilih untuk SPT
    let pengikutList = []; // Menyimpan indeks pengikut yang dipilih untuk SPPD

    // --- Helper Functions ---
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

    // Fungsi untuk mengaktifkan/menonaktifkan elemen form
    const toggleFormElements = (formElement, enable) => {
        if (!formElement) return; // Pastikan elemen form ada

        const inputs = formElement.querySelectorAll('input, select, button:not(#submit-btn)');
        inputs.forEach(input => {
            input.disabled = !enable;
            // Handle Select2 instances
            if ($(input).hasClass('modern-dropdown')) {
                // Select2 membutuhkan inisialisasi ulang jika disabled status berubah
                if (enable) {
                    $(input).select2('enable'); // Aktifkan Select2
                    $(input).next('.select2-container').removeClass('select2-container--disabled');
                } else {
                    $(input).select2('disable'); // Nonaktifkan Select2
                    $(input).next('.select2-container').addClass('select2-container--disabled');
                }
            }
        });
        // Tambahkan class 'disabled' untuk styling opacity
        if (enable) {
            formElement.classList.remove('disabled');
            console.log(`Form ${formElement.id} diaktifkan.`);
        } else {
            formElement.classList.add('disabled');
            console.log(`Form ${formElement.id} dinonaktifkan.`);
        }
    };


    // --- Inisialisasi Tanggal & Tahun untuk kedua form (SPT & SPPD) ---
    const sptMulaiInput = document.querySelector("#spt-mulai");
    if (sptMulaiInput) sptMulaiInput.value = formatDate(today); else console.error("Elemen #spt-mulai tidak ditemukan");
    const sptBerakhirInput = document.querySelector("#spt-berakhir");
    if (sptBerakhirInput) sptBerakhirInput.value = formatDate(tomorrow); else console.error("Elemen #spt-berakhir tidak ditemukan");
    const sptTahunInput = document.querySelector("#spt-tahun");
    if (sptTahunInput) sptTahunInput.value = currentYear; else console.error("Elemen #spt-tahun tidak ditemukan");
    const bulanttdInput = document.querySelector("#bulanttd");
    if (bulanttdInput) bulanttdInput.value = currentMonth; else console.error("Elemen #bulanttd tidak ditemukan");

    const sppdMulaiInput = document.querySelector("#sppd-mulai");
    if (sppdMulaiInput) sppdMulaiInput.value = formatDate(today); else console.error("Elemen #sppd-mulai tidak ditemukan");
    const sppdBerakhirInput = document.querySelector("#sppd-berakhir");
    if (sppdBerakhirInput) sppdBerakhirInput.value = formatDate(tomorrow); else console.error("Elemen #sppd-berakhir tidak ditemukan");
    const sppdTahunInput = document.querySelector("#sppd-tahun");
    if (sppdTahunInput) sppdTahunInput.value = currentYear; else console.error("Elemen #sppd-tahun tidak ditemukan");


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

            const populateDropdown = (selectElement, items, textKey, valueKey = 'index') => {
                if (selectElement) {
                    selectElement.innerHTML = '<option value="">Pilih...</option>';
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

            populateDropdown(document.querySelector("#spt-opd"), data.opd, 'nama', 'value');
            populateDropdown(document.querySelector("#sppd-opd"), data.opd, 'nama', 'value');
            populateDropdown(document.querySelector("#pegawai"), data.pegawai, 'nama');
            populateDropdown(document.querySelector("#pegawai-utama"), data.pegawai, 'nama');
            populateDropdown(document.querySelector("#pengikut"), data.pegawai, 'nama');
            populateDropdown(document.querySelector("#pejabat"), data.pejabat, 'nama');
            populateDropdown(document.querySelector("#pptk"), data.pejabat, 'nama');
            populateDropdown(document.querySelector("#alat-angkut"), data.alatAngkut, 'nama', 'value');

            // --- INISIALISASI SELECT2 SETELAH SEMUA DROPDOWN DIISI ---
            // Inisialisasi semua dropdown dengan class 'modern-dropdown'
            $('.modern-dropdown').select2({
                placeholder: 'Pilih...',
                allowClear: true
            });
            $('#naskah').select2({
                minimumResultsForSearch: -1,
                placeholder: 'Pilih Jenis Naskah',
                allowClear: true
            });

            // --- Awal Aplikasi: Freeze semua form kecuali dropdown naskah ---
            // Ambil referensi form
            const sptForm = document.querySelector("#spt-form");
            const sppdForm = document.querySelector("#sppd-form");
            const submitBtn = document.querySelector("#submit-btn");

            // Pastikan kedua form disabled saat pertama kali dimuat
            if (sptForm) toggleFormElements(sptForm, false);
            if (sppdForm) toggleFormElements(sppdForm, false);
            if (submitBtn) submitBtn.disabled = true;

            // --- Toggle Form Berdasarkan Jenis Naskah ---
            const naskahSelect = document.querySelector("#naskah");
            if (naskahSelect) {
                naskahSelect.addEventListener("change", (e) => {
                    const selectedNaskah = e.target.value;
                    
                    // Reset list pegawai/pengikut saat jenis naskah berubah
                    pegawaiList = [];
                    pengikutList = [];
                    if (document.querySelector("#pegawai-list")) {
                        document.querySelector("#pegawai-list").innerHTML = "";
                    }
                    if (document.querySelector("#pengikut-list")) {
                        document.querySelector("#pengikut-list").innerHTML = "";
                    }

                    // Reset Select2 pilihan yang ada di kedua form
                    $('.modern-dropdown').val(null).trigger('change');
                    
                    if (selectedNaskah === "SPT") {
                        if (sptForm) toggleFormElements(sptForm, true); // Aktifkan SPT
                        if (sppdForm) toggleFormElements(sppdForm, false); // Nonaktifkan SPPD
                        if (submitBtn) submitBtn.disabled = false;
                    } else if (selectedNaskah === "SPPD") {
                        if (sptForm) toggleFormElements(sptForm, false); // Nonaktifkan SPT
                        if (sppdForm) toggleFormElements(sppdForm, true); // Aktifkan SPPD
                        if (submitBtn) submitBtn.disabled = false;
                    } else { // Jika tidak ada naskah yang dipilih
                        if (sptForm) toggleFormElements(sptForm, false);
                        if (sppdForm) toggleFormElements(sppdForm, false);
                        if (submitBtn) submitBtn.disabled = true;
                    }
                    console.log("Jenis naskah dipilih:", selectedNaskah);
                });
            } else { console.error("Elemen #naskah tidak ditemukan"); }

        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Gagal mengambil data untuk dropdown: " + error.message);
        });


    // --- Tambah Pegawai ke Daftar SPT ---
    const addPegawaiBtn = document.querySelector("#add-pegawai");
    if (addPegawaiBtn) {
        addPegawaiBtn.addEventListener("click", () => {
            const pegawaiSelect = document.querySelector("#pegawai");
            const selectedValue = $(pegawaiSelect).val();
            const selectedText = $(pegawaiSelect).find('option:selected').text();

            if (selectedValue && selectedValue !== "" && !pegawaiList.includes(selectedValue)) {
                pegawaiList.push(selectedValue);
                const pegawaiListDiv = document.querySelector("#pegawai-list");
                const pegawaiItem = document.createElement("div");
                pegawaiItem.textContent = selectedText;
                pegawaiListDiv.appendChild(pegawaiItem);
                console.log("Pegawai ditambahkan:", pegawaiList);
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
            const selectedValue = $(pengikutSelect).val();
            const selectedText = $(pengikutSelect).find('option:selected').text();

            if (selectedValue && selectedValue !== "" && !pengikutList.includes(selectedValue)) {
                pengikutList.push(selectedValue);
                const pengikutListDiv = document.querySelector("#pengikut-list");
                const pengikutItem = document.createElement("div");
                pengikutItem.textContent = selectedText;
                pengikutListDiv.appendChild(pengikutItem);
                console.log("Pengikut ditambahkan:", pengikutList);
            } else {
                console.warn("Pengikut tidak valid atau sudah ditambahkan (SPPD)");
            }
        });
    } else { console.error("Elemen #add-pengikut tidak ditemukan"); }

    // --- Submit Form dan Unduh Dokumen ---
    const submitBtn = document.querySelector("#submit-btn"); // Definisi ulang di sini agar yakin di scope yang benar
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