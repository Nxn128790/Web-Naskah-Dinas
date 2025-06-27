// netlify/functions/data.js
const data = {
    pegawai: [
        { nama: "Budi Santoso", pangkat: "Penata Muda/IIIa", nip: "198001012006041001", jabatan: "Auditor", tingkat_biaya: "A", tanggal_lahir: "1980-01-01" },
        { nama: "Ani Lestari", pangkat: "Penata/IIIc", nip: "198502022008042002", jabatan: "Kepala Seksi", tingkat_biaya: "B", tanggal_lahir: "1985-02-02" },
        { nama: "Cahyo Pratama", pangkat: "Pengatur/IIc", nip: "199003032010041003", jabatan: "Staf", tingkat_biaya: "C", tanggal_lahir: "1990-03-03" }
    ],
    pejabat: [
        { nama: "Dr. H. Ahmad Zainuddin, M.Si", pangkat: "Pembina Utama Madya/IVd", nip: "196504041990031001", jabatan: "Inspektur", tingkat_biaya: "A", tanggal_lahir: "1965-04-04" },
        { nama: "Dra. Bayana M.Si, CGCAE", pangkat: "Pembina/IVa", nip: "19690401 199003 2 004", jabatan: "Sekretaris", tingkat_biaya: "A", tanggal_lahir: "1969-04-01" }
    ],
    opd: [
        { nama: "Sekretariat Daerah", value: "Sekretariat Daerah" },
        { nama: "Dinas Pendidikan", value: "Dinas Pendidikan" },
        { nama: "Dinas Kesehatan", value: "Dinas Kesehatan" }
    ],
    alatAngkut: [
        { nama: "Mobil Dinas", value: "Mobil Dinas" },
        { nama: "Kendaraan Pribadi", value: "Kendaraan Pribadi" },
        { nama: "Angkutan Umum", value: "Angkutan Umum" }
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