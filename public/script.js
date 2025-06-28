function ambilTanggalLahirDariNip(nip) {
    if (!nip || nip.length < 8) {
        console.warn("NIP tidak valid:", nip);
        return "";
    }
    const thn = nip.substring(0, 4);
    const bln = nip.substring(4, 6);
    const tgl = nip.substring(6, 8);
    return `${thn}-${bln}-${tgl}`;
}

$(document).ready(function() {
    let pegawaiList = [];
    let pengikutList = [];

    // Inisialisasi Select2 dengan placeholder spesifik per dropdown
    $('#naskah').select2({
        placeholder: 'Pilih Jenis Naskah Dinas...',
        allowClear: false,
        width: '100%',
        dropdownAutoWidth: false,
        dropdownParent: $('body'),
        templateResult: function(data) {
            if (!data.id) return data.text;
            return $('<span>' + data.text + '</span>');
        },
        templateSelection: function(data) {
            if (!data.id) return data.text;
            return $('<span>' + data.text + '</span>');
        }
    });

    // Untuk dropdown lain, ambil placeholder dari option pertama
    $('.modern-dropdown').not('#naskah').each(function() {
        var $select = $(this);
        var placeholder = $select.find('option[value=""]').text() || '';
        $select.select2({
            placeholder: placeholder,
            allowClear: false,
            width: '100%',
            dropdownAutoWidth: false,
            dropdownParent: $('body'),
            templateResult: function(data) {
                if (!data.id) return data.text;
                return $('<span>' + data.text + '</span>');
            },
            templateSelection: function(data) {
                if (!data.id) return data.text;
                return $('<span>' + data.text + '</span>');
            }
        });
    });

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

    $("#spt-mulai").val(formatDate(today));
    $("#spt-berakhir").val(formatDate(tomorrow));
    $("#spt-tahun").val(currentYear);
    $("#sppd-mulai").val(formatDate(today));
    $("#sppd-berakhir").val(formatDate(tomorrow));
    $("#sppd-tahun").val(currentYear);
    $("#bulanttd").val(currentMonth);

    ["#spt-mulai", "#spt-berakhir", "#sppd-mulai", "#sppd-berakhir"].forEach(id => {
        $(id).attr("placeholder", "dd/mm/yyyy");
    });

    const backendUrl = "/.netlify/functions";
    $.getJSON(`${backendUrl}/data`, function(data) {
        window.dataPegawai = data.pegawai;

        // --- SORT DROPDOWN SECARA ALFABETIS UNTUK SEMUA DROPDOWN YANG DITAMPILKAN ---
        // OPD
        const sortedOpd = data.opd.slice().sort((a, b) => a.nama.localeCompare(b.nama));
        sortedOpd.forEach(opd => {
            $('#spt-opd, #sppd-opd').append(
                `<option value="${opd.value}">${opd.nama}</option>`
            );
        });
        // Jenis Pengawasan
        if (data.jenis_pengawasan) {
            const sortedPengawasan = data.jenis_pengawasan.slice().sort((a, b) => a.nama.localeCompare(b.nama));
            sortedPengawasan.forEach(jp => {
                $('#spt-pengawasan, #sppd-pengawasan').append(
                    `<option value="${jp.value}">${jp.nama}</option>`
                );
            });
        }
        // Pegawai, Pengikut, Pegawai Utama
        const sortedPegawai = data.pegawai.slice().sort((a, b) => a.nama.localeCompare(b.nama));
        sortedPegawai.forEach(pegawai => {
            $('#pegawai, #pegawai-utama, #pengikut').append(
                `<option value="${pegawai.nip}">${pegawai.nama}</option>`
            );
        });
        // Pejabat Penandatangan (khusus pejabat)
        if (data.pejabat && Array.isArray(data.pejabat)) {
            const sortedPejabat = data.pejabat.slice().sort((a, b) => a.nama.localeCompare(b.nama));
            sortedPejabat.forEach(pejabat => {
                $('#pejabat').append(
                    `<option value="${pejabat.nip}">${pejabat.nama}</option>`
                );
            });
        }
    });

    ["A", "B", "C"].forEach(tb => {
        $('#tingkat-biaya').append(
            `<option value="${tb}">${tb}</option>`
        );
    });

    $('#naskah').on('change', function() {
        const sptForm = document.querySelector('#spt-form');
        const sppdForm = document.querySelector('#sppd-form');

        if (this.value === 'SPT') {
            sptForm.style.display = 'block';
            sppdForm.style.display = 'none';
            $('#sppd-form .modern-dropdown').val('').trigger('change');
        } else if (this.value === 'SPPD') {
            sptForm.style.display = 'none';
            sppdForm.style.display = 'block';
            $('#spt-form .modern-dropdown').val('').trigger('change');
        } else {
            sptForm.style.display = 'none';
            sppdForm.style.display = 'none';
            $('.modern-dropdown').val('').trigger('change');
        }
    });

    // Fungsi sortir berdasarkan pangkat/golongan tertinggi ke terendah
    function sortByPangkat(list, pegawaiData) {
        const urutanGolongan = [
            'Pembina Utama/ IV.e', 'Pembina Utama Madya/ IV.d', 'Pembina Utama Muda/ IV.c',
            'Pembina Tingkat I/ IV.b', 'Pembina/ IV.a',
            'Penata Tk. I/ III.d', 'Penata/ III.c', 'Penata Muda Tk. I/ III.b', 'Penata Muda/ III.a',
            'Pengatur Tk. I/ II.d', 'Pengatur/ II.c', 'Pengatur Muda Tk. I/ II.b', 'Pengatur Muda/ II.a',
            'Juru Tk. I/ I.d', 'Juru/ I.c', 'Juru Muda Tk. I/ I.b', 'Juru Muda/ I.a',
            'P3K'
        ];
        return list.slice().sort((nipA, nipB) => {
            const pegA = pegawaiData.find(p => p.nip === nipA);
            const pegB = pegawaiData.find(p => p.nip === nipB);
            const getGol = s => {
                if (!s) return 100;
                const match = s.match(/([IVX]+\.[a-e])/i);
                if (match) return urutanGolongan.indexOf(match[0]);
                return urutanGolongan.indexOf(s.trim()) !== -1 ? urutanGolongan.indexOf(s.trim()) : 100;
            };
            let idxA = getGol(pegA?.pangkat);
            let idxB = getGol(pegB?.pangkat);
            if (idxA === idxB) return (pegA?.nama || '').localeCompare(pegB?.nama || '');
            return idxA - idxB;
        });
    }

    // Tambah pegawai SPT
    const addPegawaiBtn = document.querySelector("#add-pegawai");
    if (addPegawaiBtn) {
        addPegawaiBtn.addEventListener("click", () => {
            const pegawaiSelect = document.querySelector("#pegawai");
            const selectedPegawai = pegawaiSelect.options[pegawaiSelect.selectedIndex];
            if (selectedPegawai && selectedPegawai.value && !pegawaiList.includes(selectedPegawai.value)) {
                pegawaiList.push(selectedPegawai.value); // value = NIP
                pegawaiList = sortByPangkat(pegawaiList, window.dataPegawai); // sortir setelah tambah
                const pegawaiListDiv = document.querySelector("#pegawai-list");
                pegawaiListDiv.innerHTML = '';
                pegawaiList.forEach(nip => {
                    const peg = window.dataPegawai.find(p => p.nip === nip);
                    const pegawaiItem = document.createElement("div");
                    const pegawaiNameSpan = document.createElement("span");
                    pegawaiNameSpan.textContent = peg?.nama || nip;
                    pegawaiItem.appendChild(pegawaiNameSpan);
                    const removeBtn = document.createElement("button");
                    removeBtn.textContent = "HAPUS";
                    removeBtn.className = "list-remove-btn";
                    removeBtn.onclick = function() {
                        pegawaiList = pegawaiList.filter(val => val !== nip);
                        pegawaiItem.remove();
                    };
                    pegawaiItem.appendChild(removeBtn);
                    pegawaiListDiv.appendChild(pegawaiItem);
                });
                console.log("Pegawai ditambahkan:", pegawaiList);
            } else {
                console.warn("Pegawai tidak valid atau sudah ditambahkan");
            }
        });
    }

    // Tambah pengikut SPPD
    const addPengikutBtn = document.querySelector("#add-pengikut");
    if (addPengikutBtn) {
        addPengikutBtn.addEventListener("click", () => {
            const pengikutSelect = document.querySelector("#pengikut");
            const selectedPengikut = pengikutSelect.options[pengikutSelect.selectedIndex];
            if (selectedPengikut && selectedPengikut.value && !pengikutList.includes(selectedPengikut.value)) {
                pengikutList.push(selectedPengikut.value); // value = NIP
                pengikutList = sortByPangkat(pengikutList, window.dataPegawai); // sortir setelah tambah
                const pengikutListDiv = document.querySelector("#pengikut-list");
                pengikutListDiv.innerHTML = '';
                pengikutList.forEach(nip => {
                    const peg = window.dataPegawai.find(p => p.nip === nip);
                    const pengikutItem = document.createElement("div");
                    const pengikutNameSpan = document.createElement("span");
                    pengikutNameSpan.textContent = peg?.nama || nip;
                    pengikutItem.appendChild(pengikutNameSpan);
                    const removeBtn = document.createElement("button");
                    removeBtn.textContent = "HAPUS";
                    removeBtn.className = "list-remove-btn";
                    removeBtn.onclick = function() {
                        pengikutList = pengikutList.filter(val => val !== nip);
                        pengikutItem.remove();
                    };
                    pengikutItem.appendChild(removeBtn);
                    pengikutListDiv.appendChild(pengikutItem);
                });
                console.log("Pengikut ditambahkan:", pengikutList);
            } else {
                console.warn("Pengikut tidak valid atau sudah ditambahkan");
            }
        });
    }

    const submitBtn = document.querySelector("#submit-btn");
    if (submitBtn) {
        submitBtn.addEventListener("click", async () => {
            const naskah = $("#naskah").val() || "";
            if (!naskah) {
                alert("Pilih jenis naskah terlebih dahulu");
                return;
            }

            const formData = {};
            const endpoint = naskah === "SPT"
                ? `${backendUrl}/generate-spt`
                : `${backendUrl}/generate-sppd`;

            if (naskah === "SPT") {
                formData.jenis_pengawasan = $("#spt-pengawasan").val() || "";
                formData.opd = $("#spt-opd").val() || "";
                formData.tahun = $("#spt-tahun").val() || "";
                formData.tglmulai = $("#spt-mulai").val() || "";
                formData.tglberakhir = $("#spt-berakhir").val() || "";
                formData.selected_pegawai_nips = pegawaiList;
                formData.pejabat_index = $("#pejabat").val() || "";
                formData.bulanttd = $("#bulanttd").val() || "";
            } else if (naskah === "SPPD") {
                formData.jenis_pengawasan = $("#sppd-pengawasan").val() || "";
                formData.opd = $("#sppd-opd").val() || "";
                formData.tahun = $("#sppd-tahun").val() || "";
                formData.tglmulai = $("#sppd-mulai").val() || "";
                formData.tglberakhir = $("#sppd-berakhir").val() || "";
                formData.pegawai_utama_nip = $("#pegawai-utama").val() || "";
                formData.pengikut_nips = pengikutList;
                formData.alat_angkut = $("#alat-angkut").val() || "";
                formData.tingkat_biaya = $("#tingkat-biaya").val() || "";
                formData.pptk_index = $("#pptk").val() || "";

                // AMBIL TANGGAL LAHIR LANGSUNG DARI NIP
                const nip = $("#pegawai-utama").val();
                if (nip !== "") {
                    const selectedPegawai = window.dataPegawai?.find(p => p.nip === nip);
                    if (selectedPegawai) {
                        const tglLahir = ambilTanggalLahirDariNip(selectedPegawai.nip);
                        formData.tanggal_lahir = tglLahir;
                        console.log("Tanggal lahir pegawai utama diambil langsung:", tglLahir);
                    } else {
                        formData.tanggal_lahir = "";
                    }
                } else {
                    formData.tanggal_lahir = "";
                }
            }

            console.log("Mengirim data ke", endpoint, formData);

            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
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
                a.download = naskah === "SPT"
                    ? "SPT_Generated.docx"
                    : "SPPD_Generated.docx";
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error:", error);
                alert("Terjadi kesalahan: " + error.message);
            }
        });
    }
});
