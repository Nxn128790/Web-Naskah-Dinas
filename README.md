# SPT & SPPD Generator

Aplikasi web untuk menghasilkan dokumen Surat Perintah Tugas (SPT) dan Surat Perjalanan Dinas (SPPD) untuk Inspektorat Provinsi Lampung.

## Struktur Proyek
- `public/`: Berisi file statis (HTML, CSS, JS) untuk frontend.
- `src/`: Berisi kode backend (Node.js dengan Express).
- `templates/`: Berisi template docx untuk SPT dan SPPD.
- `netlify.toml`: Konfigurasi untuk deployment ke Netlify.
- `.gitignore`: Mengabaikan file yang tidak perlu di Git.
- `package.json`: Dependensi dan skrip proyek.

## Prasyarat
- Node.js (v16 atau lebih tinggi)
- Akun GitHub
- Akun Netlify (untuk frontend)
- Akun Render (untuk backend)
- Visual Studio Code (atau editor lain)

## Setup Lokal
1. Clone repository:
   ```bash
   git clone https://github.com/username/spt-sppd-generator.git
   cd spt-sppd-generator