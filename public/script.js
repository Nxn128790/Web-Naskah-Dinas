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

    $('.modern-dropdown').select2({
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

        // Isi dropdown jenis pengawasan
        if (data.jenis_pengawasan) {
            data.jenis_pengawasan.forEach(jp => {
                $('#spt-pengawasan, #sppd-pengawasan').append(
                    `<option value="${jp.value}">${jp.nama}</option>`
                );
            });
        }

        data.opd.forEach(opd => {
            $('#spt-opd, #sppd-opd').append(
                `<option value="${opd.value}">${opd.nama}</option>`
            );
        });

        data.pegawai.forEach((pegawai, index) => {
            $('#pegawai, #pegawai-utama, #pengikut').append(
                `<option value="${index}">${pegawai.nama}</option>`
            );
        });

        data.pejabat.forEach((pejabat, index) => {
            $('#pejabat, #pptk').append(
                `<option value="${index}">${pejabat.nama}</option>`
            );
        });
        // Set default penandatangan SPT ke Bayana jika ada
        const defaultPejabatIndex = data.pejabat.findIndex(p => p.nama.toLowerCase().includes('bayana'));
        if (defaultPejabatIndex !== -1) {
            $('#pejabat').val(defaultPejabatIndex).trigger('change');
        }

        data.alatAngkut.forEach(alat => {
            $('#alat-angkut').append(
                `<option value="${alat.value}">${alat.nama}</option>`
            );
        });
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

    const addPegawaiBtn = document.querySelector("#add-pegawai");
    if (addPegawaiBtn) {
        addPegawaiBtn.addEventListener("click", () => {
            const pegawaiSelect = document.querySelector("#pegawai");
            const selectedPegawai = pegawaiSelect.options[pegawaiSelect.selectedIndex];
            if (selectedPegawai && selectedPegawai.value && !pegawaiList.includes(selectedPegawai.value)) {
                pegawaiList.push(selectedPegawai.value);
                const pegawaiListDiv = document.querySelector("#pegawai-list");
                const pegawaiItem = document.createElement("div");
                const pegawaiNameSpan = document.createElement("span");
                pegawaiNameSpan.textContent = selectedPegawai.textContent;
                pegawaiItem.appendChild(pegawaiNameSpan);
                const removeBtn = document.createElement("button");
                removeBtn.textContent = "HAPUS";
                removeBtn.className = "list-remove-btn";
                removeBtn.onclick = function() {
                    pegawaiList = pegawaiList.filter(val => val !== selectedPegawai.value);
                    pegawaiItem.remove();
                };
                pegawaiItem.appendChild(removeBtn);
                pegawaiListDiv.appendChild(pegawaiItem);
                console.log("Pegawai ditambahkan:", pegawaiList);
            } else {
                console.warn("Pegawai tidak valid atau sudah ditambahkan");
            }
        });
    }

    const addPengikutBtn = document.querySelector("#add-pengikut");
    if (addPengikutBtn) {
        addPengikutBtn.addEventListener("click", () => {
            const pengikutSelect = document.querySelector("#pengikut");
            const selectedPengikut = pengikutSelect.options[pengikutSelect.selectedIndex];
            if (selectedPengikut && selectedPengikut.value && !pengikutList.includes(selectedPengikut.value)) {
                pengikutList.push(selectedPengikut.value);
                const pengikutListDiv = document.querySelector("#pengikut-list");
                const pengikutItem = document.createElement("div");
                const pengikutNameSpan = document.createElement("span");
                pengikutNameSpan.textContent = selectedPengikut.textContent;
                pengikutItem.appendChild(pengikutNameSpan);
                const removeBtn = document.createElement("button");
                removeBtn.textContent = "HAPUS";
                removeBtn.className = "list-remove-btn";
                removeBtn.onclick = function() {
                    pengikutList = pengikutList.filter(val => val !== selectedPengikut.value);
                    pengikutItem.remove();
                };
                pengikutItem.appendChild(removeBtn);
                pengikutListDiv.appendChild(pengikutItem);
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
                formData.selected_pegawai_indices = pegawaiList;
                formData.pejabat_index = $("#pejabat").val() || "";
                formData.bulanttd = $("#bulanttd").val() || "";
            } else if (naskah === "SPPD") {
                formData.jenis_pengawasan = $("#sppd-pengawasan").val() || "";
                formData.opd = $("#sppd-opd").val() || "";
                formData.tahun = $("#sppd-tahun").val() || "";
                formData.tglmulai = $("#sppd-mulai").val() || "";
                formData.tglberakhir = $("#sppd-berakhir").val() || "";
                formData.pegawai_utama_index = $("#pegawai-utama").val() || "";
                formData.pengikut_indices = pengikutList;
                formData.alat_angkut = $("#alat-angkut").val() || "";
                formData.tingkat_biaya = $("#tingkat-biaya").val() || "";
                formData.pptk_index = $("#pptk").val() || "";

                // AMBIL TANGGAL LAHIR LANGSUNG DARI NIP
                const index = $("#pegawai-utama").val();
                if (index !== "") {
                    const selectedPegawai = window.dataPegawai?.[index];
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
