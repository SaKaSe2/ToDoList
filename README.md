# NewGen To-Do

Platform produktivitas cerdas yang mengintegrasikan **Kecerdasan Buatan (AI)**, **Pomodoro Timer**, dan **Dashboard Analitik** untuk membantu pengguna merencanakan, mengeksekusi, dan melacak produktivitas mereka secara menyeluruh.

- **Frontend:** React (Vite) + Tailwind CSS + Recharts  
- **Backend:** Laravel 11 + PostgreSQL (Aiven)  
- **Deployment:** Vercel (Frontend) + Render (Backend)  
- **AI Engine:** LLaMA-3 via Groq API  

**Live Demo:** [https://to-do-list-swart-xi.vercel.app](https://to-do-list-swart-xi.vercel.app)

---

## Fitur Utama

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 1 | **AI Task Assistant** | Memecah tujuan besar menjadi langkah-langkah kecil secara otomatis menggunakan AI (LLaMA-3) |
| 2 | **Adaptive Smart Scheduling** | Penjadwalan ulang otomatis (+2 jam) untuk tugas yang terlewat |
| 3 | **Goal → Task Decomposition** | Input tujuan besar, AI otomatis membuat roadmap langkah-langkah yang realistis |
| 4 | **Deep Work Analytics Dashboard** | Visualisasi produktivitas 7 hari terakhir (waktu fokus & tugas selesai) |
| 5 | **Contextual Reminder (Smart Trigger)** | Notifikasi otomatis berdasarkan lokasi GPS pengguna |

---

## Pengujian Kualitas Perangkat Lunak (ISO 25010)

### 1. Functional Suitability (Kesesuaian Fungsional)

Menguji apakah setiap fitur berjalan sesuai dengan kebutuhan yang telah dirancang.

| No | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Status |
|----|--------------------|-------------------|-----------------------|--------|
| FS-01 | Registrasi akun baru | Buka halaman Register, isi semua field, klik "Daftar Sekarang" | Akun berhasil dibuat, redirect ke Dashboard | Lolos |
| FS-02 | Login dengan akun valid | Masukkan email dan password yang benar pada halaman Login | Login berhasil, redirect ke Dashboard | Lolos |
| FS-03 | Login dengan password salah | Masukkan email benar dan password salah | Muncul pesan error "Email atau password salah." | Lolos |
| FS-04 | Menambah tugas baru | Isi field "Tugas Baru", klik tombol "Tambah" | Tugas muncul di daftar secara instan (optimistic UI) | Lolos |
| FS-05 | Menambah tugas dengan jadwal | Isi field tugas dan pilih waktu pada datetime picker, klik "Tambah" | Tugas muncul dengan label waktu di bawah judul | Lolos |
| FS-06 | Menandai tugas selesai | Klik checkbox pada salah satu tugas | Tugas berubah menjadi bergaris (line-through) | Lolos |
| FS-07 | Menghapus tugas | Klik ikon tempat sampah merah pada tugas, konfirmasi "Yakin ingin menghapus?" | Tugas hilang dari daftar | Lolos |
| FS-08 | Jadwalkan ulang tugas | Klik tombol "Jadwalkan Ulang" pada tugas yang sudah lewat jadwal | Jadwal diperbarui +2 jam dari waktu sekarang | Lolos |
| FS-09 | Memulai sesi Fokus (Pomodoro) | Klik tombol "Fokus" pada tugas yang belum selesai | Muncul timer 25:00 di pojok kanan bawah | Lolos |
| FS-10 | Menghentikan sesi Fokus | Klik "Hentikan Sesi" pada panel timer | Timer berhenti, data durasi disimpan ke database | Lolos |
| FS-11 | AI memecah tujuan besar | Isi tujuan "Menyelesaikan Skripsi", klik "Pecah Menjadi Tugas Kecil" | AI menghasilkan daftar langkah-langkah kecil dengan efek typewriter | Lolos |
| FS-12 | Menyimpan hasil AI ke Tugas Pintar | Setelah AI selesai, klik "Simpan Semua ke Tugas Pintar" | Semua tugas AI masuk ke halaman Tugas Pintar dengan label "AI" | Lolos |
| FS-13 | Dashboard menampilkan statistik | Buka halaman Dashboard setelah memiliki data | Menampilkan Total Tugas Selesai, Waktu Fokus, Tingkat Penyelesaian | Lolos |
| FS-14 | Grafik mingguan menampilkan data real | Selesaikan tugas dan jalankan sesi fokus, lalu buka Dashboard | Bar Chart menampilkan data hari ini yang berubah sesuai aktivitas | Lolos |
| FS-15 | Logout dari aplikasi | Klik tombol logout (ikon merah) di pojok kanan atas | Redirect ke halaman Login, token dihapus | Lolos |

### 2. Performance Efficiency (Efisiensi Kinerja)

Menguji waktu respons dan efisiensi penggunaan sumber daya aplikasi.

| No | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Status |
|----|--------------------|-------------------|-----------------------|--------|
| PE-01 | Waktu muat halaman pertama (cold start) | Buka aplikasi saat server Render sedang tertidur | Tampil animasi "Membangunkan Server..." selama proses loading | Lolos |
| PE-02 | Waktu muat halaman setelah server aktif | Refresh halaman setelah server aktif | Halaman dimuat dalam kurang dari 2 detik | Gagal |
| PE-03 | Respons tambah tugas (optimistic UI) | Tambahkan tugas baru dan perhatikan waktu munculnya | Tugas muncul instan di UI sebelum server merespons | Lolos |
| PE-04 | Respons checkbox (optimistic UI) | Klik checkbox tugas dan perhatikan perubahan visual | Status berubah instan tanpa menunggu respons server | Lolos |
| PE-05 | Respons hapus tugas (optimistic UI) | Hapus tugas dan perhatikan hilangnya dari daftar | Tugas hilang instan dari UI sebelum server mengonfirmasi | Lolos |
| PE-06 | Skeleton loading pada Dashboard | Buka Dashboard saat data sedang dimuat | Skeleton placeholder muncul dengan animasi pulse | Lolos |

### 3. Compatibility (Kompatibilitas)

Menguji apakah aplikasi dapat berjalan dengan baik di berbagai browser dan perangkat.

| No | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Status |
|----|--------------------|-------------------|-----------------------|--------|
| CO-01 | Kompatibilitas Google Chrome | Buka aplikasi di Chrome versi terbaru | Semua fitur berjalan normal, tampilan sesuai | Lolos |
| CO-02 | Kompatibilitas Mozilla Firefox | Buka aplikasi di Firefox versi terbaru | Semua fitur berjalan normal, checkbox dan scrollbar konsisten | Lolos |
| CO-03 | Kompatibilitas Microsoft Edge | Buka aplikasi di Edge versi terbaru | Semua fitur berjalan normal | Lolos |
| CO-04 | Kompatibilitas Safari (macOS/iOS) | Buka aplikasi di Safari | Animasi dan layout tampil dengan benar berkat -webkit prefix | Lolos |
| CO-05 | Tampilan di layar mobile (responsif) | Buka aplikasi di perangkat mobile atau resize browser ke 375px | Sidebar tersembunyi, muncul tombol hamburger, layout menyesuaikan | Lolos |
| CO-06 | Tampilan di layar tablet | Resize browser ke ukuran tablet (768px) | Layout menyesuaikan antara mobile dan desktop | Lolos |
| CO-07 | Tampilan di layar desktop | Buka aplikasi di layar lebar (1920px) | Sidebar tetap terlihat, konten mengisi area dengan max-width | Lolos |

### 4. Usability (Kegunaan)

Menguji kemudahan penggunaan dan kenyamanan antarmuka pengguna.

| No | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Status |
|----|--------------------|-------------------|-----------------------|--------|
| US-01 | Bahasa antarmuka konsisten | Navigasi seluruh halaman aplikasi | Semua label, tombol, dan pesan menggunakan Bahasa Indonesia | Lolos |
| US-02 | Placeholder membantu user | Buka form tambah tugas dan form AI | Setiap input memiliki placeholder yang informatif | Lolos |
| US-03 | Feedback visual saat aksi berhasil | Tambah tugas, selesaikan tugas, hapus tugas | Muncul notifikasi toast hijau dengan pesan sukses | Lolos |
| US-04 | Feedback visual saat aksi gagal | Coba aksi saat server mati (misal hapus tugas) | Muncul notifikasi toast merah dengan pesan error spesifik | Lolos |
| US-05 | Navigasi sidebar intuitif | Klik menu Dashboard, Tugas Pintar, Asisten AI | Halaman berpindah dengan benar, menu aktif di-highlight biru | Lolos |
| US-06 | Konfirmasi sebelum hapus | Klik ikon hapus pada tugas | Muncul dialog konfirmasi "Yakin ingin menghapus tugas ini?" | Lolos |
| US-07 | Empty state informatif | Buka Tugas Pintar saat tidak ada tugas | Muncul pesan "Belum ada tugas. Selamat menikmati hari Anda!" | Lolos |
| US-08 | Loading state mencegah kebingungan | Buka halaman saat server cold start | Muncul animasi server loading, bukan layar kosong | Lolos |

### 5. Reliability (Keandalan)

Menguji kemampuan aplikasi dalam menangani kesalahan dan kondisi tidak terduga.

| No | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Status |
|----|--------------------|-------------------|-----------------------|--------|
| RE-01 | Error handling saat server mati | Matikan koneksi internet, lalu coba tambah tugas | Muncul pesan "Gagal menambahkan tugas", data di-rollback | Lolos |
| RE-02 | Error handling login gagal | Masukkan password salah berulang kali | Pesan error inline muncul, tombol tidak bisa di-spam | Lolos |
| RE-03 | Error handling register duplikat | Daftar dengan email yang sudah terdaftar | Muncul pesan "Email sudah terdaftar atau data tidak valid." | Lolos |
| RE-04 | Pencegahan double-click pada Fokus | Klik tombol "Fokus" dengan cepat berulang kali | Tombol disabled setelah klik pertama, muncul spinner | Lolos |
| RE-05 | Pencegahan double-click pada Hapus | Klik ikon hapus dengan cepat berulang kali | Tombol disabled, ikon berubah menjadi spinner | Lolos |
| RE-06 | Pencegahan double-click pada Checkbox | Klik checkbox tugas berulang kali dengan cepat | Hanya 1 request yang diproses berkat processingIds guard | Lolos |
| RE-07 | Rollback saat hapus gagal | Coba hapus tugas saat server tidak merespons | Tugas yang sempat hilang muncul kembali (rollback) | Lolos |
| RE-08 | Dashboard error state | Buka Dashboard saat backend benar-benar mati | Muncul halaman error merah dengan tombol "Coba Lagi" | Lolos |
| RE-09 | Geolocation tidak didukung | Buka aplikasi di browser yang tidak mendukung GPS | Tidak ada crash, fitur lokasi di-skip secara diam-diam | Lolos |
| RE-10 | Notification API tidak didukung | Buka aplikasi di Safari iOS (tidak mendukung Notification) | Tidak ada error, fitur notifikasi di-skip dengan guard | Lolos |

### 6. Security (Keamanan)

Menguji mekanisme keamanan autentikasi dan proteksi data pengguna.

| No | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Status |
|----|--------------------|-------------------|-----------------------|--------|
| SE-01 | Proteksi halaman tanpa login | Akses URL /dashboard langsung tanpa login | Redirect otomatis ke halaman Login | Lolos |
| SE-02 | Token disimpan dengan aman | Login, lalu periksa localStorage di DevTools | Token tersimpan di localStorage, dikirim via header Authorization | Lolos |
| SE-03 | Token dihapus saat logout | Logout, lalu periksa localStorage di DevTools | Token dihapus, user diarahkan ke halaman Login | Lolos |
| SE-04 | Validasi input di frontend | Isi form login dengan email tanpa "@" atau password < 6 karakter | Muncul pesan error inline sebelum request ke server | Lolos |
| SE-05 | API dilindungi oleh middleware auth | Coba panggil API /tasks tanpa token (via Postman) | Server mengembalikan status 401 Unauthorized | Lolos |
| SE-06 | Data user terisolasi | Login dengan 2 akun berbeda, bandingkan data tugas | Setiap akun hanya melihat tugas miliknya sendiri | Lolos |

### 7. Maintainability (Kemudahan Pemeliharaan)

Menguji struktur dan kualitas kode untuk kemudahan pengembangan di masa depan.

| No | Aspek Pengujian | Deskripsi | Hasil | Status |
|----|-----------------|-----------|-------|--------|
| MA-01 | Struktur komponen modular | Setiap halaman dipisah ke file tersendiri (Tasks, Dashboard, AIAssistant, Login, Register) | Kode terorganisir per fitur | Lolos |
| MA-02 | Pemisahan concern (SoC) | Layout (MainLayout, Sidebar, TopNav) terpisah dari halaman konten | Komponen reusable dan mudah diubah | Lolos |
| MA-03 | Konsistensi penamaan | Semua komponen menggunakan PascalCase, variabel menggunakan camelCase | Seragam di seluruh codebase | Lolos |
| MA-04 | Centralized API config | Semua panggilan API melalui satu instance Axios (`api/axios.js`) | Mudah mengganti base URL atau menambah interceptor | Lolos |
| MA-05 | State management terpusat (Auth) | Autentikasi dikelola oleh AuthContext, bukan per-komponen | Login/Logout konsisten di seluruh aplikasi | Lolos |

### 8. Portability (Portabilitas)

Menguji kemampuan aplikasi untuk berjalan di berbagai lingkungan.

| No | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Status |
|----|--------------------|-------------------|-----------------------|--------|
| PO-01 | Deployment ke Vercel | Push kode ke GitHub, Vercel auto-build | Build berhasil, aplikasi bisa diakses via URL publik | Lolos |
| PO-02 | Deployment backend ke Render | Push kode backend ke GitHub, Render auto-deploy | API berjalan dan dapat diakses oleh frontend | Lolos |
| PO-03 | Akses dari jaringan berbeda | Buka aplikasi dari jaringan WiFi dan data seluler | Aplikasi berjalan normal di kedua jaringan | Lolos |
| PO-04 | Build target lintas browser | Periksa vite.config.js build target | Target: Chrome 87+, Firefox 78+, Safari 14+, Edge 88+ | Lolos |

---

## Teknologi yang Digunakan

| Komponen | Teknologi |
|----------|-----------|
| Frontend Framework | React 19 (Vite 7) |
| Styling | Tailwind CSS 3.4 |
| Chart Library | Recharts 3.8 |
| HTTP Client | Axios 1.15 |
| Notifikasi UI | React Hot Toast 2.6 |
| Backend Framework | Laravel 11 |
| Database | PostgreSQL (Aiven Cloud) |
| AI Engine | LLaMA-3 via Groq API |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## Cara Menjalankan Secara Lokal

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

### Backend
```bash
cd Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
```

---

## Kontributor

- **Rikza** - Full-Stack Developer
