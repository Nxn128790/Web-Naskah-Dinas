// netlify/functions/generate-sppd.js
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

// Salin data statis, fungsi formatTanggalIndonesia, dan angkaKeTeks dari index.js
const data = {
    pegawai: [
        { nama: "Budi Santoso", pangkat: "Penata Muda/IIIa", nip: "198001012006041001", jabatan: "Auditor" },
        { nama: "Ani Lestari", pangkat: "Penata/IIIc", nip: "198502022008042002", jabatan: "Kepala Seksi" },
        { nama: "Cahyo Pratama", pangkat: "Pengatur/IIc", nip: "199003032010041003", jabatan: "Staf" }
    ],
    pejabat: [
        { nama: "Dr. H. Ahmad Zainuddin, M.Si", pangkat: "Pembina Utama Madya/IVd", nip: "196504041990031001", jabatan: "Inspektur" },
        { nama: "Dra. Bayana M.Si, CGCAE", pangkat: "Pembina/IVa", nip: "19690401 199003 2 004", jabatan: "Sekretaris" }
    ],
    opd: [
        { nama: "Sekretariat Daerah", value: "Sekretariat Daerah" },
        { nama: "Inspektorat Daerah", value: "Inspektorat Daerah" },
        { nama: "Biro Administrasi Pembangunan", value: "Biro Administrasi Pembangunan" },
        { nama: "Biro Hukum", value: "Biro Hukum" },
        { nama: "Biro Umum", value: "Biro Umum" },
        { nama: "Dinas Pendidikan dan Kebudayaan", value: "Dinas Pendidikan dan Kebudayaan" },
        { nama: "Dinas Kesehatan", value: "Dinas Kesehatan" },
        { nama: "Dinas Sosial", value: "Dinas Sosial" },
        { nama: "Dinas Tenaga Kerja", value: "Dinas Tenaga Kerja" },
        { nama: "Dinas Perhubungan", value: "Dinas Perhubungan" },
        { nama: "Dinas Pekerjaan Umum dan Penataan Ruang", value: "Dinas PUPR" },
        { nama: "Dinas Lingkungan Hidup", value: "Dinas Lingkungan Hidup" },
        { nama: "Dinas Pariwisata dan Ekonomi Kreatif", value: "Dinas Pariwisata dan Ekonomi Kreatif" },
        { nama: "Dinas Perindustrian dan Perdagangan", value: "Dinas Perindustrian dan Perdagangan" },
        { nama: "Dinas Kelautan dan Perikanan", value: "Dinas Kelautan dan Perikanan" },
        { nama: "Dinas Ketahanan Pangan, Tanaman Pangan dan Hortikultura", value: "Dinas Ketahanan Pangan" },
        { nama: "Dinas Energi dan Sumber Daya Mineral", value: "Dinas ESDM" },
        { nama: "Dinas Kehutanan", value: "Dinas Kehutanan" },
        { nama: "Dinas Perkebunan", value: "Dinas Perkebunan" },
        { nama: "Dinas Peternakan dan Kesehatan Hewan", value: "Dinas Peternakan dan Kesehatan Hewan" },
        { nama: "Dinas Perumahan, Kawasan Permukiman dan Cipta Karya", value: "Dinas Perumahan dan Cipta Karya" },
        { nama: "Dinas Pengelolaan Sumber Daya Air", value: "Dinas PSDA" },
        { nama: "Dinas Koperasi, Usaha Kecil dan Menengah", value: "Dinas Koperasi UKM" },
        { nama: "Dinas Pemberdayaan Masyarakat dan Desa", value: "Dinas PMD" },
        { nama: "Dinas Pemberdayaan Perempuan dan Perlindungan Anak", value: "Dinas PPPA" },
        { nama: "Dinas Pemuda dan Olahraga", value: "Dinas Pemuda dan Olahraga" },
        { nama: "Badan Kepegawaian Daerah", value: "BKD" },
        { nama: "Badan Keuangan Daerah dan Aset Daerah", value: "BPKAD" },
        { nama: "Badan Pendapatan Daerah", value: "Bapenda" },
        { nama: "Badan Perencanaan Pembangunan Daerah", value: "Bappeda" },
        { nama: "Badan Penelitian dan Pengembangan Daerah", value: "Balitbangda" },
        { nama: "Badan Pengembangan SDM Daerah", value: "BPSDM" },
        { nama: "Badan Kesatuan Bangsa dan Politik", value: "Kesbangpol" },
        { nama: "Satuan Polisi Pamong Praja", value: "Satpol PP" },
        { nama: "Kantor Sandi Daerah", value: "Kantor Sandi Daerah" }
    ],
    alatAngkut: [
        { nama: "Mobil Dinas", value: "Mobil Dinas" },
        { nama: "Motor Dinas", value: "Motor Dinas" },
        { nama: "Kendaraan Pribadi", value: "Kendaraan Pribadi" },
        { nama: "Sewa Mobil", value: "Sewa Mobil" },
        { nama: "Sewa Bus", value: "Sewa Bus" },
        { nama: "Sewa Motor", value: "Sewa Motor" },
        { nama: "Angkutan Umum Darat", value: "Angkutan Umum Darat" },
        { nama: "Kereta Api", value: "Kereta Api" },
        { nama: "Kapal Penyeberangan", value: "Kapal Penyeberangan" },
        { nama: "Pesawat Udara", value: "Pesawat Udara" }
    ]
};

// ... (sisanya kode tetap sama, tidak ada perubahan di sini) ...

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
            pptk_index,
            tingkat_biaya,
            tanggal_lahir
        } = JSON.parse(event.body);


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
            tingkat_biaya: tingkat_biaya || "Tidak Diketahui",
            tanggal_lahir: formatTanggalIndonesia(tanggal_lahir) || "Tidak Diketahui",
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