const express = require("express");
const cors = require("cors");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Sajikan file statis dari folder public
app.use(express.static(path.join(__dirname, "../public")));

const port = process.env.PORT || 3000;

// Fungsi untuk memformat tanggal ke format Indonesia (DD MMMM YYYY)
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

app.get("/data", (req, res) => {
    console.log("Mengirim data ke frontend:", data);
    res.json(data);
});

app.post("/generate-spt", (req, res) => {
    try {
        const {
            jenis_pengawasan,
            opd,
            tahun,
            tglmulai,
            tglberakhir,
            selected_pegawai_indices = [],
            pejabat_index,
            bulanttd
        } = req.body;

        console.log("Data diterima untuk SPT:", req.body);

        // Validasi data
        if (!selected_pegawai_indices.length) {
            return res.status(400).json({ message: "Pilih setidaknya satu pegawai" });
        }
        if (!pejabat_index) {
            return res.status(400).json({ message: "Pilih pejabat" });
        }

        // Ambil data pegawai dan pejabat
        const pegawaiList = selected_pegawai_indices.map(index => {
            const pegawai = data.pegawai[parseInt(index)];
            if (!pegawai) {
                throw new Error(`Pegawai dengan indeks ${index} tidak ditemukan`);
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

        const pejabat = data.pejabat[parseInt(pejabat_index)];
        if (!pejabat) {
            throw new Error(`Pejabat dengan indeks ${pejabat_index} tidak ditemukan`);
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

        console.log("Data untuk template SPT:", templateData);

        // Load template
        const content = fs.readFileSync(path.resolve(__dirname, "../templates/templatespt.docx"), "binary");
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

        res.set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.set("Content-Disposition", "attachment; filename=SPT_Generated.docx");
        res.send(buf);
    } catch (error) {
        console.error("Error menghasilkan SPT:", error);
        res.status(500).json({ message: "Gagal menghasilkan dokumen: " + error.message });
    }
});

app.post("/generate-sppd", (req, res) => {
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
        } = req.body;

        console.log("Data diterima untuk SPPD:", req.body);

        // Validasi data
        if (!pegawai_utama_index || !pptk_index) {
            return res.status(400).json({ message: "Pilih pegawai utama dan PPTK" });
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

        console.log("Data untuk template SPPD:", templateData);

        // Load template
        const content = fs.readFileSync(path.resolve(__dirname, "../templates/templatesppd.docx"), "binary");
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

        res.set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.set("Content-Disposition", "attachment; filename=SPPD_Generated.docx");
        res.send(buf);
    } catch (error) {
        console.error("Error menghasilkan SPPD:", error);
        res.status(500).json({ message: "Gagal menghasilkan dokumen: " + error.message });
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});