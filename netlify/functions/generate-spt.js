// netlify/functions/generate-spt.js
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

// Mengimpor data terpusat, tidak ada lagi duplikasi
const { data } = require('./data.js');

// Fungsi helper
function formatTanggalIndonesia(tanggal) {
    if (!tanggal) return "Tidak Diketahui";
    const date = new Date(tanggal);
    if (isNaN(date)) return "Tidak Diketahui";
    const day = date.getDate().toString();
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return `${day} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function angkaKeTeks(angka) {
    const teks = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh"];
    return teks[angka] || angka.toString();
}

const urutanGolongan = [
    'Pembina Utama/ IV.e', 'Pembina Utama Madya/ IV.d', 'Pembina Utama Muda/ IV.c', 'Pembina Tingkat I/ IV.b', 'Pembina/ IV.a',
    'Penata Tk. I/ III.d', 'Penata/ III.c', 'Penata Muda Tk. I/ III.b', 'Penata Muda/ III.a', 'Pengatur Tk. I/ II.d',
    'Pengatur/ II.c', 'Pengatur Muda Tk. I/ II.b', 'Pengatur Muda/ II.a', 'Juru Tk. I/ I.d', 'Juru/ I.c',
    'Juru Muda Tk. I/ I.b', 'Juru Muda/ I.a', 'P3K'
];

const getGol = s => {
    if (!s) return 100;
    const idx = urutanGolongan.findIndex(g => s.trim().includes(g));
    return idx !== -1 ? idx : 100;
};

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { jenis_pengawasan, opd, tahun, tglmulai, tglberakhir, selected_pegawai_nips = [], pejabat_nip, bulanttd } = JSON.parse(event.body);

        if (!selected_pegawai_nips.length) return { statusCode: 400, body: JSON.stringify({ message: "Pilih setidaknya satu pegawai" }) };
        if (!pejabat_nip) return { statusCode: 400, body: JSON.stringify({ message: "Pilih pejabat" }) };

        let pegawaiList = selected_pegawai_nips.map(nip => data.pegawai.find(p => p.nip === nip)).filter(p => p);

        // --- LOGIKA PENGURUTAN YANG SUDAH DIPERBAIKI ---
        pegawaiList.sort((a, b) => {
            const idxA = getGol(a.pangkat);
            const idxB = getGol(b.pangkat);
            if (idxA === idxB) return a.nama.localeCompare(b.nama);
            return idxA - idxB;
        });

        const pejabat = data.pejabat.find(p => p.nip === pejabat_nip);
        if (!pejabat) throw new Error(`Pejabat dengan NIP ${pejabat_nip} tidak ditemukan`);

        const lama_perjalanan = Math.ceil((new Date(tglberakhir) - new Date(tglmulai)) / (1000 * 60 * 60 * 24)) + 1;
        const jpObj = data.jenis_pengawasan.find(jp => jp.value === jenis_pengawasan);

        const templateData = {
            jenis_pengawasan: jenis_pengawasan || "",
            dasar_hukum: jpObj ? jpObj.dasar_hukum : "",
            opd: opd ? `${opd} Provinsi Lampung` : "",
            tahun: tahun || "",
            tglmulai: formatTanggalIndonesia(tglmulai),
            tglberakhir: formatTanggalIndonesia(tglberakhir),
            bulanttd: bulanttd || "",
            tahunttd: new Date(tglmulai).getFullYear(),
            pejabat: pejabat.jabatan,
            namapejabat: pejabat.nama,
            pangkatpejabat: pejabat.pangkat,
            nippejabat: pejabat.nip,
            nama1: pegawaiList[0]?.nama || "",
            pangkat1: pegawaiList[0]?.pangkat || "",
            nip1: pegawaiList[0]?.nip || "",
            jabatan1: pegawaiList[0]?.jabatan || "",
            lama_perjalanan: `${lama_perjalanan} (${angkaKeTeks(lama_perjalanan)}) Hari`,
            pegawai: pegawaiList.slice(1).map((p, i) => ({ no: i + 2, ...p }))
        };

        const content = fs.readFileSync(path.resolve(__dirname, "../../templates/templatespt.docx"), "binary");
        const doc = new Docxtemplater(new PizZip(content), { paragraphLoop: true, linebreaks: true });
        doc.setData(templateData);
        doc.render();

        const buf = doc.getZip().generate({ type: "nodebuffer", compression: "DEFLATE" });

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": "attachment; filename=SPT_Generated.docx",
                "Access-Control-Allow-Origin": "*"
            },
            body: buf.toString('base64'),
            isBase64Encoded: true
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Gagal menghasilkan dokumen: " + error.message }) };
    }
};