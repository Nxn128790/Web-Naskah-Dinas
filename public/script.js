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

        if (data.jenis_pengawasan) {
            data.jenis_pengawasan
                .sort((a, b) => a.nama.localeCompare(b.nama))
                .forEach(jp => {
                    $('#spt-pengawasan, #sppd-pengawasan').append(
                        `<option value="${jp.value}">${jp.nama}</option>`
                    );
                });
        }
        data.opd
            .sort((a, b) => a.nama.localeCompare(b.nama))
            .forEach(opd => {
                $('#spt-opd, #sppd-opd').append(
                    `<option value="${opd.value}">${opd.nama}</option>`
                );
            });
        const urutanGolongan = [
            'Pembina Utama/ IV.e', 'Pembina Utama Madya/ IV.d', 'Pembina Utama Muda/ IV.c',
            'Pembina Tingkat I/ IV.b', 'Pembina/ IV.a',
            'Penata Tk. I/ III.d', 'Penata/ III.c', 'Penata Muda Tk. I/ III.b', 'Penata Muda/ III.a',
            'Pengatur Tk. I/ II.d', 'Pengatur/ II.c', 'Pengatur Muda Tk. I/ II.b', 'Pengatur Muda/ II.a',
            'Juru Tk. I/ I.d', 'Juru/ I.c', 'Juru Muda Tk. I/ I.b', 'Juru Muda/ I.a',
            'P3K'
        ];
        const getGol = s => {
            if (!s) return 100;
            const match = s.match(/([IVX]+\.[a-e])/i);
            if (match) return urutanGolongan.indexOf(match[0]);
            return urutanGolongan.indexOf(s.trim()) !== -1 ? urutanGolongan.indexOf(s.trim()) : 100;
        };
        data.pegawai
            .sort((a, b) => {
                let idxA = getGol(a.pangkat);
                let idxB = getGol(b.pangkat);
                if (idxA === idxB) return a.nama.localeCompare(b.nama);
                return idxA - idxB;
            })
            .forEach(pegawai => {
                $('#pegawai, #pegawai-utama, #pengikut').append(
                    `<option value="${pegawai.nip}">${pegawai.nama}</option>`
                );
            });
        if (data.pejabat && Array.isArray(data.pejabat)) {
            data.pejabat
                .sort((a, b) => a.nama.localeCompare(b.nama))
                .forEach(pejabat => {
                    $('#pejabat, #pptk').append(
                        `<option value="${pejabat.nip}">${pejabat.nama}</option>`
                    );
                });
        }
        const defaultPejabat = data.pejabat && data.pejabat.find(p => p.nama.toLowerCase().includes('bayana'));
        if (defaultPejabat) {
            $('#pejabat').val(defaultPejabat.nip).trigger('change');
        }
        if (data.alatAngkut) {
            data.alatAngkut.forEach(alat => {
                $('#alat-angkut').append(
                    `<option value="${alat.value}">${alat.nama}</option>`
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
        } else if (this.value === 'SPPD') {
            sptForm.style.display = 'none';
            sppdForm.style.display = 'block';
        } else {
            sptForm.style.display = 'none';
            sppdForm.style.display = 'none';
        }
    });

    function sortPegawaiListByPangkat(nipList) {
        if (!window.dataPegawai) return nipList;
        const urutanGolongan = [
            'Pembina Utama/ IV.e', 'Pembina Utama Madya/ IV.d', 'Pembina Utama Muda/ IV.c',
            'Pembina Tingkat I/ IV.b', 'Pembina/ IV.a',
            'Penata Tk. I/ III.d', 'Penata/ III.c', 'Penata Muda Tk. I/ III.b', 'Penata Muda/ III.a',
            'Pengatur Tk. I/ II.d', 'Pengatur/ II.c', 'Pengatur Muda Tk. I/ II.b', 'Pengatur Muda/ II.a',
            'Juru Tk. I/ I.d', 'Juru/ I.c', 'Juru Muda Tk. I/ I.b', 'Juru Muda/ I.a',
            'P3K'
        ];
        const getGol = s => {
            if (!s) return 100;
            const match = s.match(/([IVX]+\.[a-e])/i);
            if (match) return urutanGolongan.indexOf(match[0]);
            return urutanGolongan.indexOf(s.trim()) !== -1 ? urutanGolongan.indexOf(s.trim()) : 100;
        };
        return nipList.slice().sort((nipA, nipB) => {
            const pA = window.dataPegawai.find(p => p.nip === nipA);
            const pB = window.dataPegawai.find(p => p.nip === nipB);
            const idxA = getGol(pA?.pangkat);
            const idxB = getGol(pB?.pangkat);
            if (idxA === idxB) return (pA?.nama || '').localeCompare(pB?.nama || '');
            return idxA - idxB;
        });
    }

    function renderPegawaiList() {
        const pegawaiListDiv = document.querySelector("#pegawai-list");
        pegawaiListDiv.innerHTML = "";
        const sorted = sortPegawaiListByPangkat(pegawaiList);
        sorted.forEach(nip => {
            const pegawai = window.dataPegawai.find(p => p.nip === nip);
            if (!pegawai) return;
            const item = document.createElement("div");
            item.innerHTML = `<span>${pegawai.nama}</span><button class="list-remove-btn">HAPUS</button>`;
            item.querySelector('.list-remove-btn').onclick = function() {
                pegawaiList = pegawaiList.filter(val => val !== nip);
                renderPegawaiList();
            };
            pegawaiListDiv.appendChild(item);
        });
    }
    function renderPengikutList() {
        const pengikutListDiv = document.querySelector("#pengikut-list");
        pengikutListDiv.innerHTML = "";
        const sorted = sortPegawaiListByPangkat(pengikutList);
        sorted.forEach(nip => {
            const pegawai = window.dataPegawai.find(p => p.nip === nip);
            if (!pegawai) return;
            const item = document.createElement("div");
            item.innerHTML = `<span>${pegawai.nama}</span><button class="list-remove-btn">HAPUS</button>`;
            item.querySelector('.list-remove-btn').onclick = function() {
                pengikutList = pengikutList.filter(val => val !== nip);
                renderPengikutList();
            };
            pengikutListDiv.appendChild(item);
        });
    }

    $("#add-pegawai").on("click", () => {
        const selectedNip = $("#pegawai").val();
        if (selectedNip && !pegawaiList.includes(selectedNip)) {
            pegawaiList.push(selectedNip);
            renderPegawaiList();
        }
    });

    $("#add-pengikut").on("click", () => {
        const selectedNip = $("#pengikut").val();
        if (selectedNip && !pengikutList.includes(selectedNip)) {
            pengikutList.push(selectedNip);
            renderPengikutList();
        }
    });

    $("#submit-btn").on("click", async () => {
        const naskah = $("#naskah").val();
        if (!naskah) return alert("Pilih jenis naskah terlebih dahulu");

        const endpoint = naskah === "SPT" ? `${backendUrl}/generate-spt` : `${backendUrl}/generate-sppd`;
        let formData = {};

        if (naskah === "SPT") {
            formData = {
                jenis_pengawasan: $("#spt-pengawasan").val(),
                opd: $("#spt-opd").val(),
                tahun: $("#spt-tahun").val(),
                tglmulai: $("#spt-mulai").val(),
                tglberakhir: $("#spt-berakhir").val(),
                selected_pegawai_nips: pegawaiList,
                pejabat_nip: $("#pejabat").val(),
                bulanttd: $("#bulanttd").val(),
            };
        } else {
            const utamaNip = $("#pegawai-utama").val();
            formData = {
                jenis_pengawasan: $("#sppd-pengawasan").val(),
                opd: $("#sppd-opd").val(),
                tahun: $("#sppd-tahun").val(),
                tglmulai: $("#sppd-mulai").val(),
                tglberakhir: $("#sppd-berakhir").val(),
                pegawai_utama_nip: utamaNip,
                pengikut_nips: pengikutList,
                alat_angkut: $("#alat-angkut").val(),
                tingkat_biaya: $("#tingkat-biaya").val(),
                pptk_nip: $("#pptk").val(),
                tanggal_lahir: ambilTanggalLahirDariNip(utamaNip),
            };
        }

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error((await response.json()).message || "Gagal menghasilkan dokumen");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${naskah}_Generated.docx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Terjadi kesalahan: " + error.message);
        }
    });
    
    // --- KODE PENCEGAH ZOOM DITEMPATKAN DI SINI ---
    document.addEventListener('gesturestart', function (e) { e.preventDefault(); }, { passive: false });
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=')) {
            e.preventDefault();
        }
    }, { passive: false });
    window.addEventListener('wheel', function (e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });
});