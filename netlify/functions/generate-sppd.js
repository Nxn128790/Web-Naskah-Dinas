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
        { "nama": "Muh. Akbar Sholeh, S.Si., M.S.Ak.", "nip": "19800812 200312 1 006", "pangkat": "Pembina Muda/ IV.c", "jabatan": "AUDITOR MADYA" },
        { "nama": "Mardiana, S.Sos.", "nip": "19661106 198803 2 007", "pangkat": "Pembina Muda/ IV.c", "jabatan": "AUDITOR MADYA" },
        { "nama": "Maryana, S.E.", "nip": "19690325 199003 2 005", "pangkat": "Pembina/ IV.a", "jabatan": "PPUPD MUDA" },
        { "nama": "Krisna, S.Sos., M.M.", "nip": "19700807 199110 1 001", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Muhammad Ikhwan, S.E., M.M.", "nip": "19790602 200804 1 001", "pangkat": "Pembina/ IV.a", "jabatan": "PPUPD MUDA" },
        { "nama": "Reni Syafutri, S.Hut., M.M.", "nip": "19791031 200701 2 003", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Oke Dharmafitria, S.Sos., M.Si.", "nip": "19751001 201001 2 004", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Nina Ulfa, S.Psi., M.M.", "nip": "19810414 200501 2 010", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Said Al Chudri, S.Sos.", "nip": "19810213 200604 1 003", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Beatrix Dewi W S, S.H.", "nip": "19851214 201101 2 003", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Irna Eka Lisa, S.T., M.M.", "nip": "19860724 201001 2 020", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Hendry Dwi Kurniawan, S.I.P., M.M.", "nip": "19870807 201101 1 004", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Karlina, S.H., M.S.Ak.", "nip": "19871019 201001 2 006", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Dient Septianita, S.E.", "nip": "19830909 200801 2 013", "pangkat": "Penata/ III.c", "jabatan": "PPUPD MUDA" },
        { "nama": "Reffi Rizki Dwi Putri, S.E., M.M.", "nip": "19820211 201101 2 006", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR PERTAMA" },
        { "nama": "Nelya Roza AS, S.E.", "nip": "19820821 200312 2 001", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR PERTAMA" },
        { "nama": "Rio Ari Purnama, S.STP., M.M.", "nip": "19911026 201206 1 001", "pangkat": "Penata Muda Tk. I/ III.b", "jabatan": "PPUPD PERTAMA" },
        { "nama": "Ika Mutia Prasetya, S.Kom.", "nip": "19840310 201001 2 006", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR PERTAMA" },
        { "nama": "Iva Nova Yalina, S.H., M.H.", "nip": "19650922 199312 2 001", "pangkat": "Pembina Muda/ IV.c", "jabatan": "PPUPD MADYA" },
        { "nama": "Yusuf Effendi, S.E., M.Si.", "nip": "19680207 199612 1 002", "pangkat": "Pembina Muda/ IV.c", "jabatan": "AUDITOR MADYA" },
        { "nama": "Harun Syukri, S.H.", "nip": "19670626 199311 1 001", "pangkat": "Pembina Muda/ IV.c", "jabatan": "AUDITOR MADYA" },
        { "nama": "Devianti, S.E., M.M.", "nip": "19721224 199803 2 006", "pangkat": "Pembina Muda/ IV.c", "jabatan": "AUDITOR MADYA" },
        { "nama": "Neli Kartini, S.Sos., M.M.", "nip": "19701215 199203 2 006", "pangkat": "Pembina Tingkat I/ IV.b", "jabatan": "AUDITOR MADYA" },
        { "nama": "Heri Susanto, S.E., M.Si.", "nip": "19720105 199103 1 003", "pangkat": "Pembina Tingkat I/ IV.b", "jabatan": "PPUPD MADYA" },
        { "nama": "Neksen, S.Sos.", "nip": "19730913 199803 1 009", "pangkat": "Pembina Tingkat I/ IV.b", "jabatan": "PPUPD MADYA" },
        { "nama": "Iwan Novriza, S.E., M.M.", "nip": "19691116 200312 1 001", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Tutiek Pamiyati, S.E., M.M.", "nip": "19730618 200604 2 001", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Widiana, S.Sos.", "nip": "19771118 200003 2 002", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Serly Carolina Utami, S.E., M.M.", "nip": "19780107 201001 2 003", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PPUPD MUDA" },
        { "nama": "Adi Leo Saputra, S.I.P., M.M.", "nip": "19780724 200902 1 002", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Rinaldy, S.H., M.M.", "nip": "19790519 201001 1 004", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PPUPD MUDA" },
        { "nama": "Dwi Kusyandi Tiasmoro, S.H.", "nip": "19830128 200902 1 001", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PPUPD MUDA" },
        { "nama": "Abdullah Iqbal, S.H., M.H.", "nip": "19860317 201001 1 004", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Verlianita, S.P., M.M.", "nip": "19840824 201101 2 019", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Aries Pubalingga, S.I.P., M.Si.", "nip": "19850401 201101 1 008", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PPUPD MUDA" },
        { "nama": "Fristiani, S.H., M.H.", "nip": "19860201 200902 2 006", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Arsyad, S.E., M.M.", "nip": "19790910 200901 1 009", "pangkat": "Penata Muda Tk. I/ III.b", "jabatan": "PPUPD PERTAMA" },
        { "nama": "Harun Saputra, S.Sos.", "nip": "19731011 199603 1 002", "pangkat": "Penata Muda/ III.b", "jabatan": "PPUPD PERTAMA" },
        { "nama": "Suresmi, S.E., M.M.", "nip": "19650827 199203 2 004", "pangkat": "Pembina Muda/ IV.c", "jabatan": "AUDITOR MADYA" },
        { "nama": "Zainal Abidin, S.H.", "nip": "19690614 199803 1 007", "pangkat": "Pembina Muda/ IV.c", "jabatan": "PPUPD MADYA" },
        { "nama": "Diyah Herawati, S.T., M.M.", "nip": "19721121 200212 2 005", "pangkat": "Pembina Muda/ IV.c", "jabatan": "AUDITOR MADYA" },
        { "nama": "Muhammad Iqbal, S.T., M.T.", "nip": "19690622 200501 1 006", "pangkat": "Pembina Tingkat I/ IV.b", "jabatan": "PPUPD MADYA" },
        { "nama": "Susanti Dwiharsandi, S.E., M.M.", "nip": "19750930 200501 2 011", "pangkat": "Pembina Muda/ IV.c", "jabatan": "AUDITOR MADYA" },
        { "nama": "Febriani, S.T.", "nip": "19750215 200604 2 002", "pangkat": "Pembina/ IV.a", "jabatan": "PPUPD MUDA" },
        { "nama": "Ernawati, S.Ak.", "nip": "19690409 199402 2 002", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Indra Irawan, S.I.P., M.M.", "nip": "19720709 199603 1 002", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PPUPD MUDA" },
        { "nama": "Iwan Arwin Setyawan, S.T., M.M.", "nip": "19730618 199303 1 005", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PPUPD MUDA" },
        { "nama": "M. Efrizal Setiawan, S.T., M.T.", "nip": "19820725 201001 1 012", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PPUPD MUDA" },
        { "nama": "Dadang Suhendra, S.Sos., M.Si.", "nip": "19761125 201001 1 006", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Yose Rizal Suud, S.E.", "nip": "19770606 201101 1 005", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Nur'aini, S.Sos., M.M.", "nip": "19830119 200212 2 001", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Emy Novianty Irba, S.STP., M.M.", "nip": "19851130 200412 2 001", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Dewi Rosalina, S.I.P., M.M.", "nip": "19880317 200701 2 002", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PPUPD MUDA" },
        { "nama": "Rosi Gusnia, S.I.P., M.H.", "nip": "19880801 200701 2 001", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Putri W. Nopviati, S.I.P., M.M.", "nip": "19881108 200701 2 001", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Nixon, S.STP., M.M.", "nip": "19911107 201507 1 001", "pangkat": "Penata/ III.c", "jabatan": "PPUPD PERTAMA" },
        { "nama": "Evi Rifianty, S.E.", "nip": "19830403 201001 2 012", "pangkat": "Penata/ III.c", "jabatan": "AUDITOR PERTAMA" },
        { "nama": "Nopriwan B.S Putra, S.H., M.Kn.", "nip": "19791127 201402 1 001", "pangkat": "Penata Muda/ III.b", "jabatan": "PPUPD PERTAMA" },
        { "nama": "Dra. Amrina Sari", "nip": "19670925 199403 2 007", "pangkat": "Pembina Muda/ IV.c", "jabatan": "AUDITOR MADYA" },
        { "nama": "Sarwoko Nofi Hardi, S.E.", "nip": "19651108 198912 1 001", "pangkat": "Pembina Tingkat I/ IV.b", "jabatan": "AUDITOR MADYA" },
        { "nama": "Drs. Dafeta Ali", "nip": "19691221 199203 1 005", "pangkat": "Pembina Tingkat I/ IV.b", "jabatan": "PPUPD MADYA" },
        { "nama": "Drs. Antony", "nip": "19710407 199303 1 006", "pangkat": "Pembina Tingkat I/ IV.b", "jabatan": "PPUPD MADYA" },
        { "nama": "Shelfianah, S.E., M.M.", "nip": "19700421 199803 2 008", "pangkat": "Pembina Tingkat I/ IV.b", "jabatan": "AUDITOR MADYA" },
        { "nama": "Martin Mahisa, S.A.P., M.M.", "nip": "19751027 199803 1 005", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Alam Batin, S.H.", "nip": "19710430 199402 1 001", "pangkat": "Pembina/ IV.a", "jabatan": "PPUPD MUDA" },
        { "nama": "Yari Silviana, S.H.", "nip": "19760108 199503 2 001", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "E. Robert M. Siahaan, S.E., M.M.", "nip": "19790315 200604 1 003", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PPUPD MUDA" },
        { "nama": "Andi Fathi, S.E., M.M.", "nip": "19790602 199902 1 001", "pangkat": "Pembina/ IV.a", "jabatan": "PPUPD MUDA" },
        { "nama": "I Gde Candra Wikanaya, S.H., M.H.", "nip": "19801113 200903 1 005", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Yeni Rustika, S.H., M.M.", "nip": "19790718 200003 2 002", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Novita Sari, S.T.P., M.M.", "nip": "19811101 200604 2 014", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Kartika Utami, S.Sos., M.M.", "nip": "19830928 200604 2 005", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Bunga Citra Biru, S.H., M.H.", "nip": "19860622 201101 2 003", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Lia Oktavia, S.H., M.H.", "nip": "19831028 200604 2 004", "pangkat": "Penata/ III.c", "jabatan": "PPUPD PERTAMA" },
        { "nama": "Antika Dewi, S.STP., M.Si.", "nip": "19921221 201507 2 001", "pangkat": "Penata/ III.c", "jabatan": "PPUPD PERTAMA" },
        { "nama": "Budi Suprianto, S.E.", "nip": "19800607 200801 1 018", "pangkat": "Penata Muda Tk. I/ III.b", "jabatan": "PPUPD PERTAMA" },
        { "nama": "Syandra Wijaya, S.H., M.M.", "nip": "19860220 201001 1 003", "pangkat": "Penata Muda Tk. I/ III.b", "jabatan": "AUDITOR PERTAMA" },
        { "nama": "Dra. Lislaini", "nip": "19660515 199503 2 003", "pangkat": "Pembina Muda/ IV.c", "jabatan": "PPUPD MADYA" },
        { "nama": "Ratna Yulisa Raspati, S.H.", "nip": "19690719 199503 2 003", "pangkat": "Pembina Muda/ IV.c", "jabatan": "AUDITOR MADYA" },
        { "nama": "Gusti Rahmad, S.E., M.Si.", "nip": "19680819 199703 1 004", "pangkat": "Pembina Tingkat I/ IV.b", "jabatan": "AUDITOR MADYA" },
        { "nama": "Ramses Nainggolan, S.E., M.M.", "nip": "19690630 199703 1 005", "pangkat": "Pembina Tingkat I/ IV.b", "jabatan": "AUDITOR MADYA" },
        { "nama": "Agung Prianto, S.E., M.M.", "nip": "19720815 200312 1 006", "pangkat": "Pembina Tingkat I/ IV.b", "jabatan": "AUDITOR MADYA" },
        { "nama": "Andy Saputra, S.Sos., M.M.", "nip": "19741120 200312 1 007", "pangkat": "Pembina Muda/ IV.c", "jabatan": "PPUPD MADYA" },
        { "nama": "Pandan Liberty, S.T., M.M.", "nip": "19750521 200312 2 001", "pangkat": "Pembina Tingkat I/ IV.b", "jabatan": "AUDITOR MADYA" },
        { "nama": "Dedy Irwansyah, S.H.", "nip": "19800929 201001 1 013", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR MUDA" },
        { "nama": "Sapta Zubaidi, S.E., M.M.", "nip": "19751029 200804 1 001", "pangkat": "Pembina/ IV.a", "jabatan": "PPUPD MUDA" },
        { "nama": "Dicky Saputra, S.STP., M.M.", "nip": "19860327 200412 1 001", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PPUPD MUDA" },
        { "nama": "Aditya Putra Sesunan, S.H., M.M.", "nip": "19870909 201101 1 005", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR PERTAMA" },
        { "nama": "Rudi Setiawan, S.E., M.M.", "nip": "19731031 200212 1 005", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PPUPD MUDA" },
        { "nama": "Filda Anita, S.I.A., M.M.", "nip": "19860703 200812 2 001", "pangkat": "Penata/ III.c", "jabatan": "AUDITOR MUDA" },
        { "nama": "Holida Novitasari, S.H., M.H.", "nip": "19871119 201101 2 006", "pangkat": "Penata/ III.c", "jabatan": "PPUPD MUDA" },
        { "nama": "Galih Destiana Putri, S.I.P., M.I.P.", "nip": "19901230 201206 2 001", "pangkat": "Penata/ III.c", "jabatan": "PPUPD PERTAMA" },
        { "nama": "Elisa Putri, S.ST.", "nip": "19890617 201101 2 002", "pangkat": "Penata/ III.c", "jabatan": "KA.SUB. BAGIAN UMUM DAN KEUANGAN" },
        { "nama": "Henry Riduan, S.STP., M.H.", "nip": "19800309 199810 1 001", "pangkat": "Pembina Muda/ IV.c", "jabatan": "ANALIS SDM APARATUR MADYA" },
        { "nama": "Reta Ramadayanti, S.STP., M.Si.", "nip": "19940301 201609 2 003", "pangkat": "Penata/ III.c", "jabatan": "ANALIS KEBIJAKAN AHLI MUDA" },
        { "nama": "Faidil Falerie, S.E., M.M.", "nip": "19840626 200902 1 003", "pangkat": "Pembina Muda/ IV.b", "jabatan": "Pengolah data dan Informasi" },
        { "nama": "Moh. Iqbal, S.Sos., M.M.", "nip": "19760326 200903 1 001", "pangkat": "Pembina/ IV.a", "jabatan": "PENELAAH TEKNIS KEBIJAKAN" },
        { "nama": "Misward Rumba, S.H., M.H.", "nip": "19860512 201001 1 007", "pangkat": "Pembina/ IV.a", "jabatan": "PENELAAH TEKNIS KEBIJAKAN" },
        { "nama": "Yenni Eka Putri, S.Pi., M.M.", "nip": "19760806 201001 2 006", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PENELAAH TEKNIS KEBIJAKAN" },
        { "nama": "M. Rizal Nasution, S.E., M.M.", "nip": "19800902 201001 1 012", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PENELAAH TEKNIS KEBIJAKAN" },
        { "nama": "M. Fakhri, S.E.", "nip": "19730721 200012 1 001", "pangkat": "Penata/ III.c", "jabatan": "PENELAAH TEKNIS KEBIJAKAN" },
        { "nama": "Ailsa Salsabila Putri Fadilah, S.Tr.IP.", "nip": "20001011 202108 2 001", "pangkat": "Penata Muda/ III.a", "jabatan": "PENELAAH TEKNIS KEBIJAKAN" },
        { "nama": "Muhammad Andi Timor Pratama, S.Tr.IP.", "nip": "20010410 202308 1 001", "pangkat": "Penata Muda/ III.a", "jabatan": "PENELAAH TEKNIS KEBIJAKAN" },
        { "nama": "Agus Zaelani", "nip": "19720817 200801 1 021", "pangkat": "Penata Muda/ III.a", "jabatan": "PENGADMINISTRASI PERKANTORAN" },
        { "nama": "Dwi Kusuma, S.Kom.", "nip": "19900101 202504 2 001", "pangkat": "Penata Muda/ III.a", "jabatan": "PENATA KELOLA SISTEM DAN TEKNOLOGI INFORMASI" },
        { "nama": "Rizki Nurhidayah, S.Kom.", "nip": "19920102 202504 2 002", "pangkat": "Penata Muda/ III.a", "jabatan": "PENATA KELOLA SISTEM DAN TEKNOLOGI INFORMASI" },
        { "nama": "Rizki Nurhidayani, S.Kom.", "nip": "19920102 202504 2 003", "pangkat": "Penata Muda/ III.a", "jabatan": "PENATA KELOLA SISTEM DAN TEKNOLOGI INFORMASI" },
        { "nama": "Dwi Kusuma, S.Kom.", "nip": "19900101 202504 2 004", "pangkat": "Penata Muda/ III.a", "jabatan": "PENATA KELOLA SISTEM DAN TEKNOLOGI INFORMASI" },
        { "nama": "Rizki Nurhidayani, S.Kom.", "nip": "19920102 202504 2 005", "pangkat": "Penata Muda/ III.a", "jabatan": "PENATA KELOLA SISTEM DAN TEKNOLOGI INFORMASI" },
        { "nama": "Dwi Kusuma, S.Kom.", "nip": "19900101 202504 2 006", "pangkat": "Penata Muda/ III.a", "jabatan": "PENATA KELOLA SISTEM DAN TEKNOLOGI INFORMASI" },
        { "nama": "Makmun", "nip": "19740205 200801 1 012", "pangkat": "Penata Muda/ III.a", "jabatan": "PENGADMINISTRASI PERKANTORAN" },
        { "nama": "Dian Asmara Dahana, S.Kom.", "nip": "19990920 202504 2 004", "pangkat": "Penata Muda/ III.a", "jabatan": "PENATA KELOLA SISTEM DAN TEKNOLOGI INFORMASI" },
        { "nama": "Egidiah Amalia, S.Kom.", "nip": "1997024 202504 2 002", "pangkat": "Penata Muda/ III.a", "jabatan": "PENATA KELOLA SISTEM DAN TEKNOLOGI INFORMASI" },
        { "nama": "Steven Pratama Putra, S.Kom.", "nip": "19960225 202504 1 003", "pangkat": "Penata Muda/ III.a", "jabatan": "PENATA KELOLA SISTEM DAN TEKNOLOGI INFORMASI" },
        { "nama": "Risa Mutiara, A.Md.", "nip": "19800321 201001 2 006", "pangkat": "Pengatur Tk. I/ II.d", "jabatan": "PENGADMINISTRASI PERKANTORAN" },
        { "nama": "M. Sopyan", "nip": "19750806 200801 1 015", "pangkat": "Pengatur Muda Tk. I/ II.b", "jabatan": "PENGADMINISTRASI PERKANTORAN" },
        { "nama": "Asiman", "nip": "19760802 200801 1 012", "pangkat": "Pengatur Muda Tk. I/ II.b", "jabatan": "PENGADMINISTRASI PERKANTORAN" },
        { "nama": "M. Sopian", "nip": "19770627 200801 1 009", "pangkat": "Pengatur Muda Tk. I/ II.b", "jabatan": "PENGADMINISTRASI PERKANTORAN" },
        { "nama": "Andi Asmara", "nip": "19770830 200801 1 014", "pangkat": "Pengatur Muda Tk. I/ II.b", "jabatan": "PENGADMINISTRASI PERKANTORAN" },
        { "nama": "Doni Rahmadi", "nip": "19820723 200801 1 016", "pangkat": "Pengatur Muda Tk. I/ II.b", "jabatan": "PENGADMINISTRASI PERKANTORAN" },
        { "nama": "Hasan Zainudin", "nip": "19820705 200801 1 014", "pangkat": "Pengatur Muda Tk. I/ II.b", "jabatan": "PENGADMINISTRASI UMUM" },
        { "nama": "Trimo", "nip": "", "pangkat": "P3K", "jabatan": "PENGADMINISTRASI PERKANTORAN" },
        { "nama": "Septi Dwi Harsanti, S.Psi.", "nip": "", "pangkat": "P3K", "jabatan": "PENGADMINISTRASI PERKANTORAN" },
        { "nama": "Mega Octaviany", "nip": "", "pangkat": "P3K", "jabatan": "Pengelola Pelayanan Oprasional" },
        { "nama": "Wayan Hari Kurniawan, S.STP., M.IP.", "nip": "19900519 201001 1 001", "pangkat": "Penata/ III.c", "jabatan": "PERENCANA MUDA" },
        { "nama": "Febriani, S.E., M.Si.", "nip": "19710226 200003 2 001", "pangkat": "Pembina/ IV.a", "jabatan": "PERENCANA MADYA" },
        { "nama": "Indah Purnamasari, S.Sos., M.M.", "nip": "19781107 200604 2 005", "pangkat": "Pembina/ IV.a", "jabatan": "PERENCANA MADYA" },
        { "nama": "Haderiansyah Priala Hatang, S.STP., M.H.", "nip": "19871123 200602 1 001", "pangkat": "Pembina Muda/ IV.b", "jabatan": "Pengolah Data dan Informasi" },
        { "nama": "Novika Sinta Ningrum, S.E.", "nip": "19761130 200501 2 013", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PERENCANA MUDA" },
        { "nama": "Ahmad Rozi Subing, S.H., M.M.", "nip": "19760425 201001 1 007", "pangkat": "Penata Tk. I/ III.d", "jabatan": "PERENCANA MUDA" },
        { "nama": "Robbie Oktasuryantas Kesumayuda, S.STP., M.Si.", "nip": "19891018 201206 1 001", "pangkat": "Penata/ III.c", "jabatan": "PERENCANA MUDA" },
        { "nama": "Muhammad Yudha Dharma Prawira, S.STP.", "nip": "19980122 202208 1 001", "pangkat": "Penata Muda/ III.a", "jabatan": "ANALIS PERENCANAAN" },
        { "nama": "M. Topan S", "nip": "19840707 200801 1 009", "pangkat": "Pengatur Muda Tk. I/ II.b", "jabatan": "PENGADMINISTRASIAN PERENCANAAN DAN PROGRAM" },
        { "nama": "M. Royhan Andri, S.E., M.M.", "nip": "19820720 201001 1 013", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR MUDA" },
        { "nama": "Exy Evratiza, S.E., S.Si., M.M.", "nip": "19830406 200804 2 002", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR PERTAMA" },
        { "nama": "Nova Lestari, S.E., M.M.", "nip": "19801103 201001 2 008", "pangkat": "Pembina/ IV.a", "jabatan": "AUDITOR PERTAMA" },
        { "nama": "Mahendra Gunandi, S.Psi.", "nip": "19810102 201101 1 004", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR PERTAMA" },
        { "nama": "Riasmira, S.E., M.M.", "nip": "19880505 201001 2 009", "pangkat": "Penata Tk. I/ III.d", "jabatan": "AUDITOR PERTAMA" },
        { "nama": "Artonov Graha Perdana Sumeang, S.Kom.", "nip": "19871109 201101 1 009", "pangkat": "Penata Muda Tk. I/ III.b", "jabatan": "AUDITOR PERTAMA" },
        { "nama": "Dita Renisa Nawawi, S.Sos., M.M.", "nip": "19880513 201001 2 007", "pangkat": "Penata Tk. I/ III.d", "jabatan": "ANALIS MONITORING, EVALUASI DAN PELAPORAN" },
        { "nama": "Hendri Yoni, A.Md.", "nip": "19741203 200903 1 004", "pangkat": "Penata/ III.c", "jabatan": "PENGELOLA DATA TEMUAN" }
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
    ],
    jenis_pengawasan: [
        {
            nama: "Reviu Rencana Kerja Pemerintah Daerah Tahun 2026",
            value: "Reviu Rencana Kerja Pemerintah Daerah Tahun 2026",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 86 Tahun 2017 tentang Tata Cara Perencanaan, Pengendalian dan Evaluasi Pembangunan Daerah, Tata Cara Evaluasi Rancangan Peraturan Daerah tentang Rencana Pembangunan Jangka Panjang Daerah dan Rencana Pembangunan Jangka Menengah Daerah, serta Tata Cara Perubahan Rencana Pembangunan Jangka Menengah Daerah, Rencana Kerja Pemerintah Daerah, dan Rencana Kerja Perangkat Daerah"
        },
        {
            nama: "Reviu Perubahan Rencana Kerja Pemerintah Daerah Tahun 2025",
            value: "Reviu Perubahan Rencana Kerja Pemerintah Daerah Tahun 2025",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 86 Tahun 2017 tentang Tata Cara Perencanaan, Pengendalian dan Evaluasi Pembangunan Daerah, Tata Cara Evaluasi Rancangan Peraturan Daerah tentang Rencana Pembangunan Jangka Panjang Daerah dan Rencana Pembangunan Jangka Menengah Daerah, serta Tata Cara Perubahan Rencana Pembangunan Jangka Menengah Daerah, Rencana Kerja Pemerintah Daerah, dan Rencana Kerja Perangkat Daerah"
        },
        {
            nama: "Reviu Rencana Kerja Perangkat Daerah Tahun 2026 (Renja PD)",
            value: "Reviu Rencana Kerja Perangkat Daerah Tahun 2026 (Renja PD)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 86 Tahun 2017 tentang Tata Cara Perencanaan, Pengendalian dan Evaluasi Pembangunan Daerah, Tata Cara Evaluasi Rancangan Peraturan Daerah tentang Rencana Pembangunan Jangka Panjang Daerah dan Rencana Pembangunan Jangka Menengah Daerah, serta Tata Cara Perubahan Rencana Pembangunan Jangka Menengah Daerah, Rencana Kerja Pemerintah Daerah, dan Rencana Kerja Perangkat Daerah"
        },
        {
            nama: "Reviu Perubahan Rencana Kerja Perangkat Daerah Tahun 2025 (Renja PD Perubahan)",
            value: "Reviu Perubahan Rencana Kerja Perangkat Daerah Tahun 2025 (Renja PD Perubahan)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 86 Tahun 2017 tentang Tata Cara Perencanaan, Pengendalian dan Evaluasi Pembangunan Daerah, Tata Cara Evaluasi Rancangan Peraturan Daerah tentang Rencana Pembangunan Jangka Panjang Daerah dan Rencana Pembangunan Jangka Menengah Daerah, serta Tata Cara Perubahan Rencana Pembangunan Jangka Menengah Daerah, Rencana Kerja Pemerintah Daerah, dan Rencana Kerja Perangkat Daerah"
        },
        {
            nama: "Reviu Kebijakan Umum Anggaran dan Prioritas Plafon Anggaran Sementara Tahun 2026 (KUA-PPAS)",
            value: "Reviu Kebijakan Umum Anggaran dan Prioritas Plafon Anggaran Sementara Tahun 2026 (KUA-PPAS)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah"
        },
        {
            nama: "Reviu Perubahan Kebijakan Umum Anggaran dan Prioritas Plafon Anggaran Sementara Tahun 2025 (KUA-PPAS Perubahan)",
            value: "Reviu Perubahan Kebijakan Umum Anggaran dan Prioritas Plafon Anggaran Sementara Tahun 2025 (KUA-PPAS Perubahan)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah"
        },
        {
            nama: "Reviu Rencana Kerja dan Anggaran Perangkat Daerah Tahun 2026 (RKA PD)",
            value: "Reviu Rencana Kerja dan Anggaran Perangkat Daerah Tahun 2026 (RKA PD)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah"
        },
        {
            nama: "Reviu Perubahan Rencana Kerja dan Anggaran Perangkat Daerah Tahun 2025 (RKA PD Perubahan)",
            value: "Reviu Perubahan Rencana Kerja dan Anggaran Perangkat Daerah Tahun 2025 (RKA PD Perubahan)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah"
        },
        {
            nama: "Reviu Rencana Pembangunan Jangka Menengah Daerah (RPJMD)",
            value: "Reviu Rencana Pembangunan Jangka Menengah Daerah (RPJMD)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 86 Tahun 2017 tentang Tata Cara Perencanaan, Pengendalian dan Evaluasi Pembangunan Daerah, Tata Cara Evaluasi Rancangan Peraturan Daerah tentang Rencana Pembangunan Jangka Panjang Daerah dan Rencana Pembangunan Jangka Menengah Daerah, serta Tata Cara Perubahan Rencana Pembangunan Jangka Menengah Daerah, Rencana Kerja Pemerintah Daerah, dan Rencana Kerja Perangkat Daerah"
        },
        {
            nama: "Reviu Rencana Strategis Perangkat Daerah (Renstra PD)",
            value: "Reviu Rencana Strategis Perangkat Daerah (Renstra PD)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 86 Tahun 2017 tentang Tata Cara Perencanaan, Pengendalian dan Evaluasi Pembangunan Daerah, Tata Cara Evaluasi Rancangan Peraturan Daerah tentang Rencana Pembangunan Jangka Panjang Daerah dan Rencana Pembangunan Jangka Menengah Daerah, serta Tata Cara Perubahan Rencana Pembangunan Jangka Menengah Daerah, Rencana Kerja Pemerintah Daerah, dan Rencana Kerja Perangkat Daerah"
        },
        {
            nama: "Reviu Laporan Keuangan Pemerintah Daerah",
            value: "Reviu Laporan Keuangan Pemerintah Daerah",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah"
        },
        {
            nama: "Reviu Laporan Penyelenggaraan Pemerintahan Daerah (LPPD)",
            value: "Reviu Laporan Penyelenggaraan Pemerintahan Daerah (LPPD)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 18 Tahun 2020 tentang Peraturan Pelaksanaan Peraturan Pemerintah Nomor 13 Tahun 2019 tentang Laporan dan Evaluasi Penyelenggaraan Pemerintahan Daerah"
        },
        {
            nama: "Reviu Laporan Kinerja Pemerintah Daerah (LKJ)",
            value: "Reviu Laporan Kinerja Pemerintah Daerah (LKJ)",
            dasar_hukum: "Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 88 Tahun 2021 tentang Evaluasi Akuntabilitas Kinerja Instansi Pemerintah"
        },
        {
            nama: "Evaluasi Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP)",
            value: "Evaluasi Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP)",
            dasar_hukum: "Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 88 Tahun 2021 tentang Evaluasi Akuntabilitas Kinerja Instansi Pemerintah"
        },
        {
            nama: "Evaluasi Laporan Penyelenggaraan Pemerintahan Daerah Kabupaten/Kota",
            value: "Evaluasi Laporan Penyelenggaraan Pemerintahan Daerah Kabupaten/Kota",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 18 Tahun 2020 tentang Peraturan Pelaksanaan Peraturan Pemerintah Nomor 13 Tahun 2019 tentang Laporan dan Evaluasi Penyelenggaraan Pemerintahan Daerah"
        },
        {
            nama: "Evaluasi Pengelolaan Risiko",
            value: "Evaluasi Pengelolaan Risiko",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 60 Tahun 2008 tentang Sistem Pengendalian Intern Pemerintah"
        },
        {
            nama: "Pengawasan Pengelolaan Keuangan Desa",
            value: "Pengawasan Pengelolaan Keuangan Desa",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 20 Tahun 2018 tentang Pengelolaan Keuangan Desa"
        },
        {
            nama: "Pengawasan Pencapaian Standar Pelayanan Minimum (SPM)",
            value: "Pengawasan Pencapaian Standar Pelayanan Minimum (SPM)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 59 Tahun 2021 tentang Penerapan Standar Pelayanan Minimum"
        },
        {
            nama: "Reviu Dana Alokasi Khusus Fisik (DAK)",
            value: "Reviu Dana Alokasi Khusus Fisik (DAK)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah"
        },
        {
            nama: "Reviu Dana Alokasi Umum (DAU)",
            value: "Reviu Dana Alokasi Umum (DAU)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah"
        },
        {
            nama: "E-Audit Pengadaan Barang dan Jasa Melalui E-Purchasing",
            value: "E-Audit Pengadaan Barang dan Jasa Melalui E-Purchasing",
            dasar_hukum: "Peraturan Presiden Nomor 12 Tahun 2021 tentang Perubahan atas Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah"
        },
        {
            nama: "Penjaminan Kualitas Sistem Pengendalian Intern Pemerintah (SPIP)",
            value: "Penjaminan Kualitas Sistem Pengendalian Intern Pemerintah (SPIP)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 60 Tahun 2008 tentang Sistem Pengendalian Intern Pemerintah"
        },
        {
            nama: "Audit Belanja dan Pengadaan Barang dan Jasa",
            value: "Audit Belanja dan Pengadaan Barang dan Jasa",
            dasar_hukum: "Peraturan Presiden Nomor 12 Tahun 2021 tentang Perubahan atas Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah"
        },
        {
            nama: "Pemeriksaan Ketaatan terhadap Norma, Standar, Prosedur, dan Kriteria (NSPK)",
            value: "Pemeriksaan Ketaatan terhadap Norma, Standar, Prosedur, dan Kriteria (NSPK)",
            dasar_hukum: "Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 36 Tahun 2020 tentang Penetapan Norma, Standar, Prosedur dan Kriteria"
        },
        {
            nama: "Kas Opname dan Stock Opname",
            value: "Kas Opname dan Stock Opname",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah"
        },
        {
            nama: "Reviu Tunda Bayar Pengadaan Barang dan Jasa Tahun 2024",
            value: "Reviu Tunda Bayar Pengadaan Barang dan Jasa Tahun 2024",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah"
        },
        {
            nama: "Reviu Anggaran dan Sumber Daya Manusia Inspektorat",
            value: "Reviu Anggaran dan Sumber Daya Manusia Inspektorat",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah"
        },
        {
            nama: "Monitoring dan Evaluasi serta Audit Badan Usaha Milik Daerah (BUMD)",
            value: "Monitoring dan Evaluasi serta Audit Badan Usaha Milik Daerah (BUMD)",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 118 Tahun 2018 tentang Rencana Bisnis, Rencana Kerja dan Anggaran, Kerja Sama, Pelaporan dan Evaluasi Badan Usaha Milik Daerah"
        },
        {
            nama: "Reviu Pengadaan Barang dan Jasa",
            value: "Reviu Pengadaan Barang dan Jasa",
            dasar_hukum: "Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah"
        },
        {
            nama: "Asistensi Manajemen Risiko",
            value: "Asistensi Manajemen Risiko",
            dasar_hukum: "Peraturan Menteri Dalam Negeri Nomor 60 Tahun 2008 tentang Sistem Pengendalian Intern Pemerintah"
        },
        {
            nama: "Asistensi Zona Integritas",
            value: "Asistensi Zona Integritas",
            dasar_hukum: "Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 90 Tahun 2021 tentang Pembangunan dan Evaluasi Zona Integritas Menuju Wilayah Bebas dari Korupsi dan Wilayah Birokrasi Bersih dan Melayani di Lingkungan Instansi Pemerintah"
        },
        {
            nama: "Evaluasi Reformasi Birokrasi",
            value: "Evaluasi Reformasi Birokrasi",
            dasar_hukum: "Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 25 Tahun 2020 tentang Road Map Reformasi Birokrasi 2020–2024"
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
            pptk_index,
            tingkat_biaya,
            tanggal_lahir
        } = JSON.parse(event.body);


        // Validasi data
        if (!pegawai_utama_nip || !pptk_index) {
            return { statusCode: 400, body: JSON.stringify({ message: "Pilih pegawai utama dan PPTK" }), headers: { "Access-Control-Allow-Origin": "*" } };
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