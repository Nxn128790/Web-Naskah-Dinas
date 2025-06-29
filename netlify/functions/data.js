// netlify/functions/data.js
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

exports.handler = async (event, context) => {
    // Bersihkan value OPD dari duplikasi 'Provinsi Lampung' sebelum dikirim ke frontend
    const dataFixed = {
        ...data,
        opd: data.opd.map(opd => ({
            ...opd,
            value: opd.value.replace(/(Provinsi Lampung)(\s*Provinsi Lampung)+/gi, 'Provinsi Lampung')
        }))
    };
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" // Penting untuk CORS
        },
        body: JSON.stringify(dataFixed)
    };
};