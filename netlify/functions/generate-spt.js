// netlify/functions/generate-spt.js
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

// Salin data statis, fungsi formatTanggalIndonesia, dan angkaKeTeks dari index.js
// atau jika Anda ingin menjadikannya satu file utilitas yang diimpor, itu juga bisa.
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
    if (angka >= 0 && angka <= 10) {
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
        // Ambil data dari frontend
        const {
            jenis_pengawasan,
            opd,
            tahun,
            tglmulai,
            tglberakhir,
            selected_pegawai_nips = [],
            pejabat_nip,
            bulanttd
        } = JSON.parse(event.body); // Parse body dari event

        // Validasi data
        if (!selected_pegawai_nips.length) {
            return { statusCode: 400, body: JSON.stringify({ message: "Pilih setidaknya satu pegawai" }), headers: { "Access-Control-Allow-Origin": "*" } };
        }
        if (!pejabat_nip) {
            return { statusCode: 400, body: JSON.stringify({ message: "Pilih pejabat" }), headers: { "Access-Control-Allow-Origin": "*" } };
        }

        // Ambil data pegawai dan pejabat
        const pegawaiList = selected_pegawai_nips.map(nip => {
            const pegawai = data.pegawai.find(p => p.nip === nip);
            if (!pegawai) {
                throw new Error(`Pegawai dengan NIP ${nip} tidak ditemukan`);
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

        // Cari pejabat berdasarkan NIP
        const pejabat = data.pejabat.find(p => p.nip === pejabat_nip);
        if (!pejabat) {
            throw new Error(`Pejabat dengan NIP ${pejabat_nip} tidak ditemukan`);
        }

        // Hitung lama perjalanan
        const startDate = new Date(tglmulai);
        const endDate = new Date(tglberakhir);
        const timeDiff = endDate - startDate;
        const lama_perjalanan = (timeDiff > 0 ? Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) : 1);
        const lama_perjalanan_teks = `${lama_perjalanan} (${angkaKeTeks(lama_perjalanan)}) Hari`;

        // Ambil dasar hukum dari jenis_pengawasan
        let dasar_hukum = "";
        if (jenis_pengawasan && data.jenis_pengawasan) {
            const jpObj = data.jenis_pengawasan.find(jp => jp.value === jenis_pengawasan);
            dasar_hukum = jpObj ? jpObj.dasar_hukum : "";
        }

        // Data untuk template
        const templateData = {
            jenis_pengawasan: jenis_pengawasan || "Tidak Diketahui",
            dasar_hukum: dasar_hukum || "Tidak Diketahui",
            opd: opd ? `${opd} Provinsi Lampung` : "Tidak Diketahui",
            tahun: tahun || "Tidak Diketahui",
            tglmulai: formatTanggalIndonesia(tglmulai) || "Tidak Diketahui",
            tglberakhir: formatTanggalIndonesia(tglberakhir) || "Tidak Diketahui",
            bulanttd: bulanttd || "Tidak Diketahui",
            tahunttd: tahun || "Tidak Diketahui",
            pejabat: pejabat.jabatan || "Tidak Diketahui",
            namapejabat: pejabat.nama || "Tidak Diketahui",
            pangkatpejabat: pejabat.pangkat || "Tidak Diketahui",
            nippejabat: pejabat.nip || "Tidak Diketahui",
            nama1: pegawaiList[0]?.nama || "Tidak Diketahui",
            pangkat1: pegawaiList[0]?.pangkat || "Tidak Diketahui",
            nip1: pegawaiList[0]?.nip || "Tidak Diketahui",
            jabatan1: pegawaiList[0]?.jabatan || "Tidak Diketahui",
            tingkat_biaya: pegawaiList[0]?.tingkat_biaya || "Tidak Diketahui",
            tanggal_lahir: pegawaiList[0]?.tanggal_lahir || "Tidak Diketahui",
            lama_perjalanan: lama_perjalanan_teks || "Tidak Diketahui",
            pegawai: pegawaiList.slice(1).map((p, i) => ({ // Mulai dari indeks 1 untuk menghindari duplikasi
                no: i + 2,
                nama: p.nama,
                pangkat: p.pangkat,
                nip: p.nip,
                jabatan: p.jabatan,
                tingkat_biaya: p.tingkat_biaya,
                tanggal_lahir: p.tanggal_lahir
            }))
        };

        // Pastikan seluruh value OPD di templateData dan output surat selalu diakhiri dengan "Provinsi Lampung"
        if (templateData.opd && !/Provinsi Lampung$/i.test(templateData.opd)) {
            templateData.opd = templateData.opd.replace(/\s*Provinsi Lampung$/i, '').trim() + ' Provinsi Lampung';
        }

        // Load template
        // PERHATIKAN PATH INI: "../" berarti naik satu level (dari netlify/functions ke netlify), lalu "../" lagi (dari netlify ke root proyek), baru ke "templates/".
        const content = fs.readFileSync(path.resolve(__dirname, "../../templates/templatespt.docx"), "binary");
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
                "Content-Disposition": "attachment; filename=SPT_Generated.docx",
                "Access-Control-Allow-Origin": "*" // Penting untuk CORS
            },
            body: buf.toString('base64'), // Mengirim buffer sebagai base64
            isBase64Encoded: true // Memberitahu Netlify bahwa body adalah base64
        };
    } catch (error) {
        console.error("Error menghasilkan SPT (Function):", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Gagal menghasilkan dokumen: " + error.message })
        };
    }
};