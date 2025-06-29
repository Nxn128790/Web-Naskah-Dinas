// netlify/functions/data.js
const data = {
    pegawai: [
        { "nama": "Zalliawaty, S.Sos.", "nip": "19750824 200003 2 003", "pangkat": "Pembina Muda/ IV.c", "jabatan": "PPUPD MADYA" },
        { "nama": "M. Sjaifoedin Z.H.P, S.T.", "nip": "19650613 199703 1 002", "pangkat": "Pembina Tingkat I/ IV.b", "jabatan": "PPUPD MADYA" },
        { "nama": "Muh. Akbar Sholeh, S.Si., M.S.Ak.", "nip": "19800812 200312 1 006", "pangkat": "Pembina Muda/ IV.c", "jabatan": "AUDITOR MADYA" },
        // ... dan seterusnya ...
    ],
    pejabat: [
        { "nama": "Dra. Bayana, M.Si., CGCEA", "pangkat": "Pembina Utama Madya/ IV.d", "nip": "19690401 199003 2 004", "jabatan": "I N S P E K T U R" },
        { "nama": "Dra. Hidayatika, M.Si.", "pangkat": "Pembina Utama Muda/ IV.c", "nip": "19680716 198909 2 002", "jabatan": "Sekretaris" },
        { "nama": "Syamsurialsyah, S.Pt., M.T.", "pangkat": "Pembina Tingkat I/ IV.b", "nip": "19721112 200003 1 006", "jabatan": "Inspektur Pembantu Wilayah I" },
        // ... dan seterusnya ...
    ],
    opd: [
        { nama: "Sekretariat DPRD", value: "Sekretariat DPRD" },
        { nama: "Biro Administrasi Pembangunan", value: "Biro Administrasi Pembangunan" },
        { nama: "Biro Hukum", value: "Biro Hukum" },
        // ... dan seterusnya ...
    ],
    alatAngkut: [
        { nama: "Mobil Dinas", value: "Mobil Dinas" },
        { nama: "Motor Dinas", value: "Motor Dinas" },
        { nama: "Kendaraan Pribadi", value: "Kendaraan Pribadi" },
        // ... dan seterusnya ...
    ],
    jenis_pengawasan: [
        {
            nama: "Reviu Rencana Kerja Pemerintah Daerah Tahun 2026",
            value: "Reviu Rencana Kerja Pemerintah Daerah Tahun 2026",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 86 Tahun 2017..."
        },
        {
            nama: "Reviu Perubahan Rencana Kerja Pemerintah Daerah Tahun 2025",
            value: "Reviu Perubahan Rencana Kerja Pemerintah Daerah Tahun 2025",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 86 Tahun 2017..."
        },
        {
            nama: "Reviu Rencana Kerja Perangkat Daerah Tahun 2026 (Renja PD)",
            value: "Reviu Rencana Kerja Perangkat Daerah Tahun 2026 (Renja PD)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 86 Tahun 2017..."
        },
        // ... dan seterusnya ...
    ]
};

exports.handler = async (event, context) => {
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
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(dataFixed)
    };
};