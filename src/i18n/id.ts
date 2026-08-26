import type { Dictionary } from "./types";

export const id: Dictionary = {
  nav: {
    home: "Beranda",
    cvMatcher: "Cocokkan CV",
    jdAnalyzer: "Analisis Loker",
    coverLetter: "Surat Lamaran",
    interviewPractice: "Latihan Wawancara",
    tracker: "Tracker Lamaran",
    tryTools: "Coba Alatnya",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
  },
  footer: {
    tagline: "Job Application Toolkit. Alat gratis untuk lamaran kerja yang lebih cerdas.",
    aboutPrivacy: "Tentang & Privasi",
  },
  home: {
    eyebrow: "Alat gratis untuk lamaran kerja yang lebih cerdas",
    title: "Buat Lamaran Kerjamu Lebih Cerdas",
    subtitle:
      "Alat gratis untuk menganalisis lowongan kerja, mencocokkan CV, menyiapkan lamaran, dan berlatih wawancara — semuanya langsung di browser kamu.",
    ctaAnalyze: "Analisis Lowongan",
    ctaExplore: "Jelajahi Alat",
    previewLabel: "Cocokkan CV — pratinjau",
    previewMatch: "Python, SQL, Excel",
    previewMissing: "Tableau, Data Viz",
    previewDisclaimer: "Berdasarkan pencocokan kata kunci — bukan prediksi peluang diterima kerja.",
    toolkitTitle: "Kumpulan Alat",
    toolkitSubtitle: "Lima alat fokus yang menutupi bagian melamar kerja yang paling menyita waktu.",
    tryNow: "Coba Sekarang",
    howItWorksTitle: "Cara Kerjanya",
    steps: [
      {
        number: "01",
        title: "Tempel deskripsi lowongan kerja",
        description: "Salin lowongan dari mana saja — LinkedIn, situs perusahaan, atau email dari recruiter.",
      },
      {
        number: "02",
        title: "Analisis keahlianmu",
        description: "Lihat persis skill mana yang sudah ada di CV-mu, dan mana yang masih kurang.",
      },
      {
        number: "03",
        title: "Sempurnakan lamaranmu",
        description: "Gunakan hasil analisis untuk menyesuaikan CV, membuat surat lamaran, dan siap wawancara.",
      },
    ],
    privacyTitle: "CV kamu tetap di perangkatmu sendiri.",
    privacyBody:
      "Toolkit ini memproses CV dan deskripsi pekerjaanmu secara lokal di browser sebisa mungkin. Tidak ada yang diunggah ke server hanya untuk menjalankan analisis.",
    privacyCta: "Baca halaman privasi",
  },
  tools: {
    "cv-matcher": {
      name: "Cocokkan CV",
      description:
        "Bandingkan CV-mu dengan deskripsi lowongan kerja untuk melihat skill mana yang cocok, mana yang kurang, dan apa yang perlu ditambahkan.",
      cta: "Coba Sekarang",
    },
    "jd-analyzer": {
      name: "Analisis Lowongan Kerja",
      description:
        "Tempel deskripsi lowongan untuk mengambil posisi, skill yang dibutuhkan, level pengalaman, dan hal-hal yang perlu dicek ulang.",
      cta: "Coba Sekarang",
    },
    "cover-letter": {
      name: "Pembuat Surat Lamaran",
      description: "Isi formulir singkat dan dapatkan draf surat lamaran rapi yang bisa disalin, diedit, dan diunduh.",
      cta: "Coba Sekarang",
    },
    "interview-practice": {
      name: "Latihan Wawancara",
      description:
        "Pilih posisi dan berlatih menjawab pertanyaan wawancara umum lengkap dengan tips dan timer persiapan/jawaban.",
      cta: "Coba Sekarang",
    },
    tracker: {
      name: "Tracker Lamaran Kerja",
      description:
        "Simpan semua lamaranmu di satu tempat, lengkap dengan status, tenggat waktu, dan statistik — tersimpan hanya di perangkatmu.",
      cta: "Coba Sekarang",
    },
  },
  about: {
    title: "Tentang & Privasi",
    intro:
      "Job Application Toolkit adalah kumpulan alat gratis untuk membantu pencari kerja menganalisis lowongan kerja, mencocokkan CV dengan posisi yang dilamar, membuat surat lamaran, dan berlatih wawancara.",
    privacyTitle: "Privasi",
    privacyParagraphs: [
      "CV kamu tidak disimpan di server untuk alat-alat utama — analisis dirancang berjalan secara lokal di browser sebisa mungkin.",
      "Tracker Lamaran menyimpan data yang kamu masukkan (perusahaan, posisi, status, dan sebagainya) di local storage browser, di perangkatmu sendiri. Data ini tidak dikirim ke mana pun.",
      "Tidak ada konten CV atau deskripsi lowongan kerja yang dikirim ke API AI pihak ketiga oleh toolkit ini.",
      "Upload screenshot (untuk Analisis Lowongan Kerja atau Cocokkan CV) dibaca menggunakan pengenalan teks di perangkat kamu sendiri — gambarnya sendiri tidak pernah diunggah ke mana pun. Saat pertama kali memakai fitur ini, browser kamu akan mengunduh mesin pengenalan teks dari CDN pustaka publik (bukan server aplikasi ini); setelah itu tersimpan lokal.",
      "Kamu bisa menghapus data tracker yang tersimpan lokal kapan saja dari halaman Tracker, atau backup dulu lewat Export Data (mengunduh file JSON yang bisa diimpor lagi nanti atau di perangkat lain lewat Import Data). Menghapus data browser, memakai browser lain, atau berganti perangkat akan menghilangkan data lokal ini — belum ada akun atau backup cloud otomatis di versi ini.",
    ],
    disclaimer: "Ini adalah informasi umum tentang cara aplikasi ini dibangun, bukan jaminan keamanan mutlak.",
  },
  common: {
    skipToContent: "Langsung ke konten",
  },
};
