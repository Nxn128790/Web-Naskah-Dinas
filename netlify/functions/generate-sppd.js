// netlify/functions/generate-sppd.js
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

// Salin data statis, fungsi formatTanggalIndonesia, dan angkaKeTeks dari index.js
const data = {
    pegawai: [
        { nama: "Budi Santoso", pangkat: "Penata Muda/IIIa", nip: "198001012006041001", jabatan: "Auditor", tingkat_biaya: "A", tanggal_lahir: "1980-01-01" },
        { nama: "Ani Lestari", pangkat: "Penata/IIIc", nip: "198502022008042002", jabatan: "Kepala Seksi", tingkat_biaya: "B", tanggal_lahir: "1985-02-02" }
    ],
    pejabat: [
        { nama: "Dr. H. Ahmad Zainuddin, M.Si", pangkat: "Pembina Utama Madya/IVd", nip: "196504041990031001", jabatan: "Inspektur", tingkat_biaya: "A", tanggal_lahir: "1965-04-04" },
        { nama: "Dra. Bayana M.Si, CGCAE", pangkat: "Pembina/IVa", nip: "19690401 199003 2 004", jabatan: "Sekretaris", tingkat_biaya: "A", tanggal_lahir: "1969-04-01" }
    ],
    opd: [
        { nama: "Sekretariat Daerah", value: "Sekretariat Daerah" }
    ],
    alatAngkut: [
        { nama: "Mobil Dinas", value: "Mobil Dinas" }
    ]
};

// Fungsi untuk memformat tanggal ke format Indonesia (DD MMMMYYYY)
function formatTanggalIndonesia(tanggal) {
    if (!tanggal || tanggal === "Tidak Diketahui") return "Tidak Diketahui";
    const date = new Date(tanggal);
    if (isNaN(date)) return "Tidak Diketahui";
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

// Fungsi untuk mengonversi angka ke teks dalam bahasa Indonesia
function angkaKeTeks(angka) {
    const teksAngka = [
        "", "satu", "dua", "tiga", "empat", "lima",
        "enam", "tujuh", "delapan", "sembilan", "sepuluh"
    ];
    if (angka >= 0 && angka >= 0 && angka <= 10) { // Fix typo: second >= 0 should be <= 10
        return teksAngka[angka];
    }
    return angka.toString();
}

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed",
            headers: { "Access-Control-Allow-Origin": "*" }
        };
    }

    try {
        const {
            jenis_pengawasan,
            opd,
            tahun,
            tglmulai,
            tglberakhir,
            pegawai_utama_index,
            pengikut_indices = [],
            alat_angkut,
            pptk_index
        } = JSON.parse(event.body); // Parse body dari event

        // Validasi data
        if (!pegawai_utama_index || !pptk_index) {
            return { statusCode: 400, body: JSON.stringify({ message: "Pilih pegawai utama dan PPTK" }), headers: { "Access-Control-Allow-Origin": "*" } };
        }

        // Ambil data pegawai utama, pengikut, dan PPTK
        const pegawaiUtama = data.pegawai[parseInt(pegawai_utama_index)];
        if (!pegawaiUtama) {
            throw new Error(`Pegawai utama dengan indeks ${pegawai_utama_index} tidak ditemukan`);
        }
        const pengikutList = pengikut_indices.map(index => {
            const pegawai = data.pegawai[parseInt(index)];
            if (!pegawai) {
                throw new Error(`Pengikut dengan indeks ${index} tidak ditemukan`);
            }
            return {
                nama: pegawai.nama || "Tidak Diketahui",
                pangkat: pegawai.pangkat || "Tidak Diketahui",
                nip: pegawai.nip || "Tidak Diketahui",
                jabatan: pegawai.jabatan || "Tidak Diketahui",
                tingkat_biaya: pegawai.tingkat_biaya || "Tidak Diketahui",
                tanggal_lahir: formatTanggalIndonesia(pegawai.tanggal_lahir) || "Tidak Diketahui"
            };
        });
        const pptk = data.pejabat[parseInt(pptk_index)];
        if (!pptk) {
            throw new Error(`PPTK dengan indeks ${pptk_index} tidak ditemukan`);
        }

        // Hitung lama perjalanan
        const startDate = new Date(tglmulai);
        const endDate = new Date(tglberakhir);
        const timeDiff = endDate - startDate;
        const lama_perjalanan = (timeDiff > 0 ? Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) : 1);
        const lama_perjalanan_teks = `${lama_perjalanan} (${angkaKeTeks(lama_perjalanan)}) Hari`;

        // Data untuk template
        const templateData = {
            jenis_pengawasan: jenis_pengawasan || "Tidak Diketahui",
            opd: opd || "Tidak Diketahui",
            tahun: tahun || "Tidak Diketahui",
            tglmulai: formatTanggalIndonesia(tglmulai) || "Tidak Diketahui",
            tglberakhir: formatTanggalIndonesia(tglberakhir) || "Tidak Diketahui",
            alat_angkut: alat_angkut || "Tidak Diketahui",
            nama: pegawaiUtama.nama || "Tidak Diketahui",
            pangkat: pegawaiUtama.pangkat || "Tidak Diketahui",
            nip: pegawaiUtama.nip || "Tidak Diketahui",
            jabatan: pegawaiUtama.jabatan || "Tidak Diketahui",
            tingkat_biaya: pegawaiUtama.tingkat_biaya || "Tidak Diketahui",
            tanggal_lahir: formatTanggalIndonesia(pegawaiUtama.tanggal_lahir) || "Tidak Diketahui",
            lama_perjalanan: lama_perjalanan_teks || "Tidak Diketahui",
            jabatanpptk: pptk.jabatan || "Tidak Diketahui",
            namapejabatpptk: pptk.nama || "Tidak Diketahui",
            nippejabatpptk: pptk.nip || "Tidak Diketahui",
            pegawai: pengikutList.map((p, i) => ({
                no: i + 1,
                nama: p.nama,
                tanggal_lahir: p.tanggal_lahir,
                jabatan: p.jabatan
            }))
        };

        // Load template
        // PERHATIKAN PATH INI: "../" berarti naik satu level (dari netlify/functions ke netlify), lalu "../" lagi (dari netlify ke root proyek), baru ke "templates/".
        const content = fs.readFileSync(path.resolve(__dirname, "../../templates/templatesppd.docx"), "binary");
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true
        });

        // Set data ke template
        doc.setData(templateData);
        doc.render();

        const buf = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE"
        });

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": "attachment; filename=SPPD_Generated.docx",
                "Access-Control-Allow-Origin": "*" // Penting untuk CORS
            },
            body: buf.toString('base64'),
            isBase64Encoded: true
        };
    } catch (error) {
        console.error("Error menghasilkan SPPD (Function):", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Gagal menghasilkan dokumen: " + error.message })
        };
    }
};