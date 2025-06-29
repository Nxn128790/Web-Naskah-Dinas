// netlify/functions/generate-sppd.js
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

// Salin data statis, fungsi formatTanggalIndonesia, dan angkaKeTeks dari index.js
const data = {
    pegawai: [
        { "nama": "Zalliawaty, S.Sos.", "nip": "19750824 200003 2 003", "pangkat": "Pembina Muda/ IV.c", "jabatan": "PPUPD MADYA" },
        { "nama": "M. Sjaifoedin Z.H.P, S.T.", "nip": "19650613 199703 1 002", "pangkat": "Pembina Tingkat I/ IV.b", "jabatan": "PPUPD MADYA" },
        { "nama": "Muh. Akbar Sholeh, S.Si., M.S.Ak.", "nip": "19800812 200312 1 006", "pangkat": "Pembina Muda/ IV.c", "jabatan": "AUDITOR MADYA" }
    ],
    pejabat: [
        { "nama": "Dra. Bayana, M.Si., CGCEA", "pangkat": "Pembina Utama Madya/ IV.d", "nip": "19690401 199003 2 004", "jabatan": "I N S P E K T U R" },
        { "nama": "Dra. Hidayatika, M.Si.", "pangkat": "Pembina Utama Muda/ IV.c", "nip": "19680716 198909 2 002", "jabatan": "Sekretaris" },
        { "nama": "Syamsurialsyah, S.Pt., M.T.", "pangkat": "Pembina Tingkat I/ IV.b", "nip": "19721112 200003 1 006", "jabatan": "Inspektur Pembantu Wilayah I" },
        { "nama": "Muhammad Risco Irawan, S.STP., M.Si.", "pangkat": "Pembina Tingkat I/ IV.b", "nip": "19800522 199810 1 002", "jabatan": "Inspektur Pembantu Wilayah II" },
        { "nama": "Iwan Meylani, S.STP., M.Ec.Dev.", "pangkat": "Pembina/ IV.a", "nip": "19840526 200212 1 001", "jabatan": "Inspektur Pembantu Wilayah III" },
        { "nama": "Drs. Andrian Syarif, M.IP.", "pangkat": "Pembina Muda/ IV.c", "nip": "19691110 199003 1 008", "jabatan": "Inspektur Pembantu Wilayah IV" },
        { "nama": "Drs. Sahat Paulus Naipospos, M.M.", "pangkat": "Pembina Tingkat I/ IV.b", "nip": "19671210 198909 1 001", "jabatan": "Inspektur Pembantu Wilayah V" },
        { "nama": "Elisa Putri, S.ST.", "pangkat": "Penata Muda Tk. I/ III.b", "nip": "19890617 201101 2 002", "jabatan": "Kasubag Umum dan Keuangan" }
    ],
    opd: [
        { nama: "Sekretariat DPRD", value: "Sekretariat DPRD" },
        { nama: "Biro Administrasi Pembangunan", value: "Biro Administrasi Pembangunan" },
        { nama: "Biro Hukum", value: "Biro Hukum" },
        { nama: "Biro Umum", value: "Biro Umum" },
        { nama: "Dinas Pendidikan dan Kebudayaan", value: "Dinas Pendidikan dan Kebudayaan" },
        { nama: "Dinas Kesehatan", value: "Dinas Kesehatan" }
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
    ],
    jenis_pengawasan: [
        {
            nama: "Audit Kinerja",
            value: "Audit Kinerja",
            dasar_hukum: "Peraturan Pemerintah Nomor 60 Tahun 2008 tentang Sistem Pengendalian Intern Pemerintah"
        },
        {
            nama: "Audit Kepatuhan",
            value: "Audit Kepatuhan",
            dasar_hukum: "Peraturan Pemerintah Nomor 60 Tahun 2008 tentang Sistem Pengendalian Intern Pemerintah"
        },
        {
            nama: "Audit Investigasi",
            value: "Audit Investigasi",
            dasar_hukum: "Peraturan Pemerintah Nomor 60 Tahun 2008 tentang Sistem Pengendalian Intern Pemerintah"
        },
        {
            nama: "Pengawasan Khusus",
            value: "Pengawasan Khusus",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 23 Tahun 2020 tentang Pedoman Pengawasan Intern Pemerintah Daerah"
        },
        {
            nama: "Telaah Sejawat Inspektorat",
            value: "Telaah Sejawat Inspektorat",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 23 Tahun 2020 tentang Pedoman Pengawasan Intern Pemerintah Daerah"
        },
        {
            nama: "Sosialisasi Peraturan Pemerintah Nomor 94 Tahun 2021 dan Anti Korupsi",
            value: "Sosialisasi Peraturan Pemerintah Nomor 94 Tahun 2021 dan Anti Korupsi",
            dasar_hukum: "Peraturan Pemerintah Nomor 94 Tahun 2021 tentang Disiplin Pegawai Negeri Sipil"
        },
        {
            nama: "Pengaduan Masyarakat terkait Aparatur Sipil Negara (ASN)",
            value: "Pengaduan Masyarakat terkait Aparatur Sipil Negara (ASN)",
            dasar_hukum: "Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 62 Tahun 2018 tentang Pedoman Sistem Pengelolaan Pengaduan Pelayanan Publik Nasional"
        }
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

// Fungsi untuk mengambil tanggal lahir dari NIP (8 digit pertama)
function ambilTanggalLahirDariNip(nip) {
    if (!nip) return "";
    // Ambil hanya digit (hilangkan spasi)
    const nipClean = nip.replace(/\D/g, "");
    if (nipClean.length < 8) return "";
    const thn = nipClean.substring(0, 4);
    const bln = nipClean.substring(4, 6);
    const tgl = nipClean.substring(6, 8);
    return `${thn}-${bln}-${tgl}`;
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
            pegawai_utama_nip,
            pengikut_nips = [],
            alat_angkut,
            pptk_nip,
            tingkat_biaya,
            tanggal_lahir
        } = JSON.parse(event.body);


        // Validasi data
        if (!pegawai_utama_nip || !pptk_nip) {
            return { statusCode: 400, body: JSON.stringify({ message: "Pilih pegawai utama dan PPTK" }), headers: { "Access-Control-Allow-Origin": "*" } };
        }
        // Validasi pengikut (jika memang wajib, tambahkan ini)
        // if (!pengikut_nips || pengikut_nips.length === 0) {
        //     return { statusCode: 400, body: JSON.stringify({ message: "Pilih setidaknya satu pengikut" }), headers: { "Access-Control-Allow-Origin": "*" } };
        // }
        // Validasi pegawai utama (tambahkan pesan error yang lebih jelas)
        if (!pegawai_utama_nip) {
            return { statusCode: 400, body: JSON.stringify({ message: "Pilih pegawai utama" }), headers: { "Access-Control-Allow-Origin": "*" } };
        }

        // Ambil data pegawai utama, pengikut, dan PPTK
        const pegawaiUtama = data.pegawai.find(p => p.nip === pegawai_utama_nip);
        if (!pegawaiUtama) {
            throw new Error(`Pegawai utama dengan NIP ${pegawai_utama_nip} tidak ditemukan`);
        }
        const pengikutList = pengikut_nips.map(nip => {
            const pegawai = data.pegawai.find(p => p.nip === nip);
            if (!pegawai) {
                throw new Error(`Pengikut dengan NIP ${nip} tidak ditemukan`);
            }
            // Ambil tanggal lahir dari field atau dari NIP
            const tglLahir = pegawai.tanggal_lahir || ambilTanggalLahirDariNip(pegawai.nip);
            return {
                nama: pegawai.nama || "Tidak Diketahui",
                pangkat: pegawai.pangkat || "Tidak Diketahui",
                nip: pegawai.nip || "Tidak Diketahui",
                jabatan: pegawai.jabatan || "Tidak Diketahui",
                tingkat_biaya: pegawai.tingkat_biaya || "Tidak Diketahui",
                tanggal_lahir: formatTanggalIndonesia(tglLahir) || "Tidak Diketahui"
            };
        });
        // Cari PPTK berdasarkan NIP
        const pptk = data.pejabat.find(p => p.nip === pptk_nip);
        if (!pptk) {
            throw new Error(`PPTK dengan NIP ${pptk_nip} tidak ditemukan`);
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
            opd: opd ? `${opd} Provinsi Lampung` : "Tidak Diketahui",
            tahun: tahun || "Tidak Diketahui",
            tglmulai: formatTanggalIndonesia(tglmulai) || "Tidak Diketahui",
            tglberakhir: formatTanggalIndonesia(tglberakhir) || "Tidak Diketahui",
            alat_angkut: alat_angkut || "Tidak Diketahui",
            nama: pegawaiUtama.nama || "Tidak Diketahui",
            pangkat: pegawaiUtama.pangkat || "Tidak Diketahui",
            nip: pegawaiUtama.nip || "Tidak Diketahui",
            jabatan: pegawaiUtama.jabatan || "Tidak Diketahui",
            tingkat_biaya: tingkat_biaya || "Tidak Diketahui",
            tanggal_lahir: formatTanggalIndonesia(
                tanggal_lahir || ambilTanggalLahirDariNip(pegawaiUtama.nip)
            ) || "Tidak Diketahui",
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

        // Pastikan seluruh value OPD di templateData dan output surat selalu diakhiri dengan "Provinsi Lampung"
        if (templateData.opd && !/Provinsi Lampung$/i.test(templateData.opd)) {
          templateData.opd = templateData.opd.replace(/\s*Provinsi Lampung$/i, '').trim() + ' Provinsi Lampung';
        }

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