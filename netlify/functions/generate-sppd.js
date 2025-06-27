// netlify/functions/generate-sppd.js
const fs = require("fs");
const path = require("path");
const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const { formatTanggalIndonesia } = require("./utils");
const data = require("./data");

exports.handler = async function (event, context) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        console.log("======= [SPPD GENERATION START] =======");

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

        console.log("Data diterima dari frontend:");
        console.log("jenis_pengawasan:", jenis_pengawasan);
        console.log("opd:", opd);
        console.log("tahun:", tahun);
        console.log("tglmulai:", tglmulai);
        console.log("tglberakhir:", tglberakhir);
        console.log("pegawai_utama_index:", pegawai_utama_index);
        console.log("pengikut_indices:", pengikut_indices);
        console.log("alat_angkut:", alat_angkut);
        console.log("pptk_index:", pptk_index);
        console.log("tingkat_biaya:", tingkat_biaya);
        console.log("tanggal_lahir (dari frontend):", tanggal_lahir);

        const pegawaiUtama = data.pegawai[parseInt(pegawai_utama_index)];
        if (!pegawaiUtama) {
            throw new Error("Pegawai utama tidak ditemukan di data.js");
        }

        const pptk = data.pejabat[parseInt(pptk_index)];
        if (!pptk) {
            throw new Error("PPTK tidak ditemukan di data.js");
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

        console.log("Pengikut list (debug):", pengikutList);

        const templateData = {
            jenis_pengawasan: jenis_pengawasan || "Tidak Diketahui",
            opd: opd || "Tidak Diketahui",
            tahun: tahun || "Tidak Diketahui",
            tglmulai: formatTanggalIndonesia(tglmulai) || "Tidak Diketahui",
            tglberakhir: formatTanggalIndonesia(tglberakhir) || "Tidak Diketahui",
            alat_angkut: alat_angkut || "Tidak Diketahui",
            tingkat_biaya: tingkat_biaya || "Tidak Diketahui",
            tanggal_lahir: formatTanggalIndonesia(tanggal_lahir) || "Tidak Diketahui",
            nama: pegawaiUtama.nama || "Tidak Diketahui",
            pangkat: pegawaiUtama.pangkat || "Tidak Diketahui",
            nip: pegawaiUtama.nip || "Tidak Diketahui",
            jabatan: pegawaiUtama.jabatan || "Tidak Diketahui",
            pptk_nama: pptk.nama || "Tidak Diketahui",
            pptk_nip: pptk.nip || "Tidak Diketahui",
            pptk_jabatan: pptk.jabatan || "Tidak Diketahui",
            pengikut_list: pengikutList
        };

        console.log("templateData yang akan di-inject ke template:", templateData);

        const templatePath = path.join(__dirname, "../templates/sppd_template.docx");
        const templateContent = fs.readFileSync(templatePath, "binary");
        const zip = new PizZip(templateContent);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        doc.render(templateData);

        const buffer = doc.getZip().generate({ type: "nodebuffer" });

        console.log("======= [SPPD GENERATION SUCCESS] =======");

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": "attachment; filename=sppd.docx",
            },
            body: buffer.toString("base64"),
            isBase64Encoded: true,
        };
    } catch (error) {
        console.error("Error generating SPPD:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};