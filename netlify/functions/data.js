// netlify/functions/data.js
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

exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" // Penting untuk CORS
        },
        body: JSON.stringify(data)
    };
};