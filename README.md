# 📋 SiAbsen — Sistem Informasi Absensi Mahasiswa

## 📝 Deskripsi

**SiAbsen** adalah aplikasi web interaktif dan responsif berbasis *Vanilla JavaScript* yang dirancang untuk membantu dosen mengelola data mahasiswa, mencatat kehadiran perkuliahan harian, memantau statistik kehadiran melalui grafik visual, serta mengekspor rekapitulasi absensi secara digital.

Aplikasi ini dikembangkan untuk menyelesaikan permasalahan pencatatan absensi manual yang rentan hilang dan memakan waktu saat menghitung persentase kehadiran akhir semester, sekaligus mendeteksi secara otomatis mahasiswa yang memiliki tingkat kehadiran di bawah batas minimum ($75\%$).

## 🛠️ Teknologi yang Digunakan

* **HTML5 (Semantic HTML):** Menggunakan elemen semantik (`<main>`, `<nav>`, `<section>`, `<table>`, `<dialog>`) untuk struktur dokumen yang terorganisir dan ramah aksesibilitas (*ARIA attributes*).

* **CSS:** Tata letak responsif menggunakan **CSS Grid** dan **Flexbox**, variabel tema (`:root`), *media queries* untuk layar *desktop*, *tablet*, dan *mobile*, serta dukungan mode gelap/terang otomatis (`prefers-color-scheme`).

* **JavaScript (Vanilla JS / ES6+):** Pengolahan data menggunakan *Arrays* & *Objects*, *DOM Manipulation*, *Event Handling*, validasi formulir secara langsung, tanpa bergantung pada *framework* eksternal (React/Vue/Angular).

* **Web Storage API:** Menggunakan `localStorage` untuk penyimpanan data mahasiswa dan absensi secara persisten di browser, serta `sessionStorage` untuk manajemen sesi *login*.

* **Chart.js (v4.4.1):** Library visualisasi data (via CDN) untuk menampilkan grafik batang persentase kehadiran per pertemuan pada halaman Dashboard.

## ✨ Fitur

Aplikasi ini dilengkapi dengan berbagai fitur utama dan pendukung untuk pengelolaan absensi:

1. **Autentikasi Dosen (Simulasi Login):** Halaman masuk khusus dosen dengan validasi input kosong dan verifikasi akun demo.

2. **Dashboard & Visualisasi Data:**

   * Menampilkan 4 kartu ringkasan statistik (Total Mahasiswa, Total Pertemuan, Rata-rata Kehadiran, dan Jumlah Mahasiswa Perlu Perhatian).

   * Grafik batang interaktif persentase kehadiran hingga 8 pertemuan terakhir menggunakan **Chart.js**.

   * Daftar peringatan otomatis bagi mahasiswa dengan persentase kehadiran di bawah $75\%$.

3. **Manajemen Data Mahasiswa (CRUD Lengkap):**

   * Menambah, melihat, mengubah, dan menghapus data mahasiswa (`NIM`, `Nama`, `Kelas`).

   * Pencarian *real-time* berdasarkan **Nama** atau **NIM**, serta filter berdasarkan **Kelas** (`TI-1A`, `TI-1B`, `TI-2A`).

   * Validasi formulir ketat (NIM wajib 5–12 digit angka, pencegahan NIM ganda, dan Nama minimal 3 karakter).

4. **Input Absensi Harian:**

   * Pemilihan **Mata Kuliah** dan **Tanggal** pertemuan.

   * Penandaan status kehadiran tiap mahasiswa (**Hadir**, **Izin**, **Sakit**, **Alpa**) dengan tombol segmen interaktif serta tombol pintas **"Hadirkan semua"**.

   * Deteksi otomatis jika absensi pada tanggal dan mata kuliah yang sama sudah ada (data akan diperbarui, bukan digandakan).

5. **Rekapitulasi & Ekspor CSV:**

   * Tabel ringkasan jumlah Hadir, Izin, Sakit, Alpa, beserta *progress bar* persentase kehadiran tiap mahasiswa.

   * Tabel riwayat pertemuan yang dapat diubah atau dihapus kembali.

   * Filter berdasarkan mata kuliah, pencarian mahasiswa, dan fitur **Export CSV** (`rekap-absensi.csv`) sesuai data yang sedang difilter.

6. **Notifikasi & Konfirmasi Interaktif:**

   * Notifikasi *toast* otomatis setiap kali data berhasil disimpan, diperbarui, dihapus, atau diekspor.

   * Modal dialog konfirmasi sebelum menghapus data mahasiswa, menghapus riwayat pertemuan, atau keluar dari aplikasi.

7. **Desain Responsif:** Tampilan menyesuaikan ukuran layar secara otomatis, mengubah menu navigasi samping (*sidebar*) pada *desktop* menjadi bilah navigasi bawah (*bottom bar*) pada perangkat *mobile*.

## 🚀 Cara Menjalankan

### Prasyarat

Sebelum menjalankan aplikasi, pastikan perangkat Anda memenuhi prasyarat berikut:

* **Web Browser Modern:** Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari versi terbaru dengan fitur **JavaScript** dan **Local Storage** aktif.

* **Koneksi Internet (Opsional):** Diperlukan hanya untuk memuat grafik **Chart.js** dari CDN pada halaman Dashboard (fitur utama lainnya tetap berjalan normal secara *offline*).

* **Code Editor & Local Server (Disarankan):** Visual Studio Code dengan ekstensi **Live Server** untuk pengalaman pengembangan yang optimal.

### Langkah demi Langkah

1. **Unduh atau Clone Repositori**
   Salin repositori ini ke komputer lokal Anda menggunakan Git, atau unduh file ZIP dan ekstrak isinya:

   ```
   git clone https://github.com/username-anda/siabsen.git
   cd siabsen
   
   ```

2. **Buka Aplikasi di Browser**

   * **Cara Langsung:** Buka folder `siabsen`, lalu klik dua kali pada file `index.html` untuk membukanya di browser pilihan Anda.

   * **Menggunakan Live Server (Disarankan):** Buka folder `siabsen` di Visual Studio Code, klik kanan pada file `index.html`, lalu pilih **"Open with Live Server"**.

3. **Masuk Menggunakan Akun Demo**
   Pada halaman Login, masukkan kredensial berikut lalu klik tombol **Masuk**:

   * **Username:** `dosen`

   * **Password:** `dosen123`

4. **Mulai Menggunakan Aplikasi**

   * Lihat statistik keseluruhan di menu **Dashboard**.

   * Kelola daftar mahasiswa di menu **Mahasiswa**.

   * Catat kehadiran kelas di menu **Absensi**.

   * Pantau persentase dan unduh laporan di menu **Rekap**.

5. **Membuka Link Deploy**
   * [Kami sudam menyediakan link deploy untuk web SiAbsen:] (siabsen-wd.vercel.app)

## 📁 Struktur Folder

```
siabsen/
├── index.html          # Halaman login dosen
├── dashboard.html      # Halaman ringkasan statistik & grafik Chart.js
├── mahasiswa.html      # Halaman manajemen data mahasiswa (CRUD, cari & filter)
├── absensi.html        # Halaman pencatatan kehadiran harian per mata kuliah
├── rekap.html          # Halaman rekapitulasi persentase, riwayat & ekspor CSV
├── css/
│   └── style.css       # Stylesheet utama (variabel tema, Grid/Flexbox, Dark Mode & responsif)
├── js/
│   └── script.js       # Logika aplikasi (CRUD, validasi, LocalStorage, Chart.js & ekspor CSV)
├── screenshots/        # Folder penyimpanan tangkapan layar aplikasi
│   ├── IMG-20261117-WA0081.jpg
│   ├── IMG-20261117-WA0079.jpg
│   ├── IMG-20261117-WA0080.jpg
│   ├── IMG-20261117-WA0078.jpg
│   └── IMG-20261117-WA0082.jpg
└── README.md           # Dokumentasi proyek

```

## 📌 Catatan

* **Simulasi Autentikasi:** Fitur *login* pada proyek ini merupakan simulasi sisi klien (*client-side*) untuk keperluan tugas akhir mata kuliah *Web Design* dan tidak menggunakan autentikasi server maupun basis data eksternal.

* **Penyimpanan Lokal:** Seluruh perubahan data mahasiswa dan absensi disimpan secara lokal di browser pengguna menggunakan `localStorage`. Data akan hilang apabila pengguna membersihkan *cache/site data* browser, dan tidak tersinkronisasi antarperangkat.

* **Data Awal (Dummy):** Aplikasi menyediakan 8 data mahasiswa contoh dan 3 riwayat pertemuan awal secara otomatis saat pertama kali dijalankan agar grafik dan rekap langsung dapat diuji.

## 📸 Tangkapan Layar
* Login
<img width="1600" height="899" alt="Interface 1" src="https://github.com/user-attachments/assets/69d0f1d9-bda2-46d8-860b-7c04c592b223" />
* Dashboard
<img width="1600" height="727" alt="Interface 5" src="https://github.com/user-attachments/assets/4027ff3c-927a-4ec6-b155-6055ad5c83ee" />
* Data Mahasiswa
<img width="1600" height="728" alt="Interface 4" src="https://github.com/user-attachments/assets/76b9bf34-b4a7-4ee2-91f4-c8c55ab753bb" />
* Input Absensi
<img width="1600" height="729" alt="Interface 3" src="https://github.com/user-attachments/assets/8747aedf-62d6-4f62-b555-60e57bbc8fcb" />
* Rekap Kehadiran
<img width="1600" height="899" alt="Interface 2" src="https://github.com/user-attachments/assets/c9b725ef-d27c-44ad-a207-28b1644d0478" />

