// netlify/functions/generate-sppd.js
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

// Mengimpor data terpusat
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

function ambilTanggalLahirDariNip(nip) {
    if (!nip) return "";
    const nipClean = nip.replace(/\D/g, "");
    if (nipClean.length < 8) return "";
    return `${nipClean.substring(0, 4)}-${nipClean.substring(4, 6)}-${nipClean.substring(6, 8)}`;
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
        const { jenis_pengawasan, opd, tahun, tglmulai, tglberakhir, pegawai_utama_nip, pengikut_nips = [], alat_angkut, pptk_nip, tingkat_biaya } = JSON.parse(event.body);

        if (!pegawai_utama_nip || !pptk_nip) {
            return { statusCode: 400, body: JSON.stringify({ message: "Pilih pegawai utama dan PPTK" }) };
        }

        const pegawaiUtama = data.pegawai.find(p => p.nip === pegawai_utama_nip);
        if (!pegawaiUtama) throw new Error(`Pegawai utama dengan NIP ${pegawai_utama_nip} tidak ditemukan`);
        
        let pengikutList = pengikut_nips.map(nip => data.pegawai.find(p => p.nip === nip)).filter(p => p);

        // --- LOGIKA PENGURUTAN YANG SUDAH DIPERBAIKI ---
        pengikutList.sort((a, b) => {
            const idxA = getGol(a.pangkat);
            const idxB = getGol(b.pangkat);
            if (idxA === idxB) return a.nama.localeCompare(b.nama);
            return idxA - idxB;
        });

        const pptk = data.pejabat.find(p => p.nip === pptk_nip);
        if (!pptk) throw new Error(`PPTK dengan NIP ${pptk_nip} tidak ditemukan`);

        const lama_perjalanan = Math.ceil((new Date(tglberakhir) - new Date(tglmulai)) / (1000 * 60 * 60 * 24)) + 1;

        const templateData = {
            jenis_pengawasan: jenis_pengawasan || "",
            opd: opd ? `${opd} Provinsi Lampung` : "",
            tahun: tahun || "",
            tglmulai: formatTanggalIndonesia(tglmulai),
            tglberakhir: formatTanggalIndonesia(tglberakhir),
            alat_angkut: alat_angkut || "",
            nama: pegawaiUtama.nama,
            pangkat: pegawaiUtama.pangkat,
            nip: pegawaiUtama.nip,
            jabatan: pegawaiUtama.jabatan,
            tingkat_biaya: tingkat_biaya || "",
            tanggal_lahir: formatTanggalIndonesia(ambilTanggalLahirDariNip(pegawaiUtama.nip)),
            lama_perjalanan: `${lama_perjalanan} (${angkaKeTeks(lama_perjalanan)}) Hari`,
            jabatanpptk: pptk.jabatan,
            namapejabatpptk: pptk.nama,
            nippejabatpptk: pptk.nip,
            pegawai: pengikutList.map((p, i) => ({
                no: i + 1,
                nama: p.nama,
                tanggal_lahir: formatTanggalIndonesia(ambilTanggalLahirDariNip(p.nip)),
                jabatan: p.jabatan
            }))
        };

        const content = fs.readFileSync(path.resolve(__dirname, "../../templates/templatesppd.docx"), "binary");
        const doc = new Docxtemplater(new PizZip(content), { paragraphLoop: true, linebreaks: true });
        doc.setData(templateData);
        doc.render();

        const buf = doc.getZip().generate({ type: "nodebuffer", compression: "DEFLATE" });

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": "attachment; filename=SPPD_Generated.docx",
                "Access-Control-Allow-Origin": "*"
            },
            body: buf.toString('base64'),
            isBase64Encoded: true
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Gagal menghasilkan dokumen: " + error.message }) };
    }
};