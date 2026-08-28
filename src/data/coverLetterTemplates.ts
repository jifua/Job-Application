export type TemplateLanguage = "id" | "en";

export interface CoverLetterTemplate {
  id: string;
  /** Short label shown on the template card, e.g. "Professional / Formal". */
  title: string;
  /** One-line description of when to use this template. */
  useCase: string;
  category: "general" | "position-specific" | "format-specific" | "experience-level";
  language: TemplateLanguage;
  /** The full example letter, ready to read and adapt. */
  body: string;
  /** Short callouts on what makes this template work, shown alongside it. */
  tips: string[];
}

export const COVER_LETTER_TEMPLATES: CoverLetterTemplate[] = [
  {
    id: "formal-general",
    title: "Formal / Umum",
    useCase: "Cocok untuk melamar posisi apa pun di perusahaan yang belum kamu kenal budayanya — pilihan aman.",
    category: "general",
    language: "id",
    tips: [
      "Sebutkan sumber informasi lowongan di kalimat pembuka — ini menunjukkan kamu benar-benar mencari, bukan menyebar lamaran acak.",
      "Satu pencapaian dengan angka lebih kuat daripada tiga klaim tanpa bukti.",
    ],
    body: `Jakarta, 12 Maret 2026

Kepada Yth.
Bapak/Ibu Manajer HRD
PT Nusantara Digital Kreatif
Jl. Gatot Subroto No. 45, Jakarta Selatan

Dengan hormat,

Berdasarkan informasi lowongan kerja yang saya temukan di situs resmi perusahaan pada 5 Maret 2026, saya bermaksud melamar posisi Staff Operasional di PT Nusantara Digital Kreatif.

Perkenalkan, nama saya Ratna Wulandari, lulusan D3 Administrasi Bisnis dari Politeknik Negeri Jakarta. Selama dua tahun terakhir, saya bekerja sebagai admin operasional di sebuah perusahaan distribusi, dengan tanggung jawab mengelola jadwal pengiriman dan menyusun laporan stok mingguan.

Selama menjalankan tugas tersebut, saya berhasil merapikan sistem pencatatan stok sehingga tingkat kesalahan input berkurang dari sekitar 8% menjadi di bawah 2% dalam waktu tiga bulan. Saya terbiasa bekerja dengan tenggat ketat dan berkoordinasi dengan beberapa divisi sekaligus.

Sebagai bahan pertimbangan, saya lampirkan dokumen berikut:
- Curriculum Vitae (CV)
- Fotokopi KTP
- Ijazah dan transkrip nilai terakhir
- Sertifikat pelatihan Microsoft Excel

Saya sangat terbuka untuk berdiskusi lebih lanjut mengenai bagaimana pengalaman saya dapat mendukung tim operasional Bapak/Ibu. Saya dapat dihubungi melalui email ratna.wulandari@email.com atau nomor telepon 0812-xxxx-xxxx.

Atas perhatian dan waktu yang diberikan, saya ucapkan terima kasih.

Hormat saya,


Ratna Wulandari`,
  },
  {
    id: "simple-short",
    title: "Simple / Ringkas",
    useCase: "Untuk posisi yang tidak butuh surat panjang — cukup satu paragraf inti, langsung ke tujuan.",
    category: "general",
    language: "id",
    tips: [
      "Jangan buang ruang untuk basa-basi; HRD yang menyaring puluhan lamaran akan menghargai keringkasan.",
      "Tetap sertakan satu kalimat tentang kualifikasi utamamu, jangan cuma \"saya melamar posisi X\".",
    ],
    body: `Surabaya, 8 Februari 2026

Yth. HRD PT Sentra Logistik Prima
Jl. Raya Darmo No. 12, Surabaya

Dengan hormat,

Saya ingin mengajukan lamaran untuk posisi Admin Gudang di PT Sentra Logistik Prima, sebagaimana diiklankan di papan pengumuman perusahaan pada 3 Februari 2026. Saya lulusan SMK Jurusan Akuntansi dengan pengalaman satu tahun sebagai admin di toko bangunan, terbiasa mengelola pencatatan barang masuk-keluar secara manual maupun dengan spreadsheet.

Bersama surat ini, saya lampirkan CV yang berisi informasi lengkap mengenai pengalaman dan kualifikasi saya. Saya sangat berharap dapat diberi kesempatan untuk mengikuti tahap wawancara.

Terima kasih atas perhatian Bapak/Ibu.

Hormat saya,


Wahyu Setiawan`,
  },
  {
    id: "formal-english",
    title: "Formal (English)",
    useCase: "For applying to multinational companies or roles where English is the working language.",
    category: "general",
    language: "en",
    tips: [
      "Keep sentences shorter than you would in Indonesian — English formal writing favors directness over elaborate phrasing.",
      "Quantify at least one achievement; 'improved efficiency' means less than 'reduced processing time by 30%'.",
    ],
    body: `Bandung, March 10, 2026

Dear Hiring Manager,

I am writing to apply for the Marketing Coordinator position at Horizon Retail Group, which I found listed on your company's careers page. I hold a Bachelor's degree in Communications from Universitas Padjadjaran and have two years of experience coordinating social media campaigns for a local fashion brand.

In my current role, I planned and executed a product-launch campaign that grew our Instagram engagement rate by 35% over two months, while keeping the campaign within a limited budget. I am comfortable working across content planning, basic analytics, and coordinating with external vendors.

I have attached my resume and a short portfolio of past campaigns for your review. I would welcome the opportunity to discuss how my experience could contribute to Horizon Retail Group's upcoming marketing initiatives.

Thank you for considering my application. I look forward to the possibility of speaking with you.

Sincerely,


Dian Permatasari
dian.permatasari@email.com | 0812-xxxx-xxxx`,
  },
  {
    id: "internship",
    title: "Magang / Internship",
    useCase: "Untuk mahasiswa atau fresh graduate yang melamar program magang, minim pengalaman kerja formal.",
    category: "experience-level",
    language: "id",
    tips: [
      "Belum punya pengalaman kerja? Gunakan proyek kuliah, organisasi, atau lomba sebagai bukti kemampuan.",
      "Tunjukkan antusiasme belajar — perusahaan tahu peserta magang masih dalam proses berkembang.",
    ],
    body: `Yogyakarta, 20 Januari 2026

Kepada,
Koordinator Program Magang
PT Cipta Karya Teknologi
Jl. Kaliurang No. 8, Yogyakarta

Dengan hormat,

Saya, Fajar Nugraha, mahasiswa semester 6 Program Studi Teknik Informatika Universitas Gadjah Mada, bermaksud mengajukan diri sebagai peserta magang untuk posisi Junior Web Developer di PT Cipta Karya Teknologi. Saya mengetahui informasi program ini dari akun Instagram resmi perusahaan.

Selama kuliah, saya aktif mengerjakan proyek pengembangan aplikasi web berbasis React dan Laravel, termasuk sebagai ketua tim dalam proyek akhir mata kuliah Rekayasa Perangkat Lunak yang menghasilkan aplikasi manajemen inventaris sederhana untuk UMKM di sekitar kampus. Saya juga terbiasa menggunakan Git untuk kolaborasi tim.

Saya sangat ingin belajar langsung dari tim pengembang di PT Cipta Karya Teknologi dan yakin semangat belajar saya akan menjadi nilai tambah selama masa magang.

Sebagai bahan pertimbangan, saya lampirkan:
- CV
- Transkrip nilai sementara
- Tautan portofolio proyek (GitHub)

Terima kasih atas kesempatan yang diberikan. Saya sangat terbuka untuk dihubungi kapan pun dibutuhkan.

Hormat saya,


Fajar Nugraha`,
  },
  {
    id: "career-switch",
    title: "Pindah Karier / Tanpa Pengalaman Langsung",
    useCase: "Untuk pelamar yang beralih bidang dan perlu menjelaskan mengapa pengalaman sebelumnya tetap relevan.",
    category: "experience-level",
    language: "id",
    tips: [
      "Jangan sembunyikan latar belakang berbeda — jelaskan dengan percaya diri kaitan skill-nya, bukan minta maaf karena tidak linear.",
      "Fokus ke transferable skills: komunikasi, problem-solving, manajemen waktu, dsb.",
    ],
    body: `Semarang, 2 April 2026

Kepada Yth.
Bapak/Ibu HRD
PT Solusi Edukasi Nusantara
Jl. Pandanaran No. 20, Semarang

Dengan hormat,

Saya ingin melamar posisi Customer Success Specialist di PT Solusi Edukasi Nusantara yang saya lihat di LinkedIn. Latar belakang saya adalah guru Bahasa Inggris selama tiga tahun di sebuah lembaga kursus, dan saat ini saya sedang beralih fokus ke bidang customer support karena tertarik membantu pengguna memaksimalkan produk digital.

Meski berasal dari dunia pendidikan, pekerjaan saya sehari-hari menuntut kemampuan menjelaskan hal rumit dengan sederhana, menangani keluhan siswa dan orang tua dengan sabar, serta melacak perkembangan puluhan siswa sekaligus menggunakan spreadsheet — kemampuan yang saya yakini sangat relevan dengan peran customer success.

Saya telah mengikuti kursus daring mengenai dasar-dasar SaaS customer support untuk memperkuat pemahaman teknis saya, dan siap belajar cepat mengenai produk PT Solusi Edukasi Nusantara.

Saya lampirkan CV dan sertifikat kursus terkait sebagai bahan pertimbangan. Terima kasih atas waktu dan perhatian Bapak/Ibu.

Hormat saya,


Nadia Kusumawati`,
  },
  {
    id: "creative-design",
    title: "Posisi Kreatif / Desain",
    useCase: "Untuk posisi graphic designer, content creator, atau peran kreatif lain yang menilai portofolio.",
    category: "position-specific",
    language: "id",
    tips: [
      "Selalu sertakan tautan portofolio — surat lamaran kreatif tanpa contoh karya kurang meyakinkan.",
      "Boleh sedikit lebih personal/bergaya, tapi tetap jelas dan profesional.",
    ],
    body: `Bandung, 18 Mei 2026

Kepada Yth.
Creative Director
Studio Rekaraya
Jl. Riau No. 33, Bandung

Dengan hormat,

Nama saya Alief Hidayat, dan saya tertarik melamar posisi Graphic Designer di Studio Rekaraya. Saya lulusan Desain Komunikasi Visual dengan pengalaman dua tahun membuat materi visual untuk kampanye media sosial dan kemasan produk UMKM.

Salah satu proyek yang paling saya banggakan adalah rebranding identitas visual untuk sebuah brand kopi lokal, yang setelah diluncurkan berhasil meningkatkan interaksi di Instagram brand tersebut hampir dua kali lipat dalam sebulan. Saya terbiasa bekerja dengan Adobe Illustrator, Photoshop, dan Figma, serta nyaman menerima revisi berulang dari klien.

Portofolio lengkap dapat dilihat di alief-portfolio.com, dan saya lampirkan juga versi PDF-nya bersama CV ini.

Saya sangat ingin berkontribusi pada proyek-proyek kreatif Studio Rekaraya dan terbuka untuk berdiskusi lebih lanjut kapan pun memungkinkan.

Hormat saya,


Alief Hidayat`,
  },
  {
    id: "customer-service-sales",
    title: "Customer Service / Sales",
    useCase: "Untuk posisi yang menonjolkan kemampuan komunikasi dan pencapaian target.",
    category: "position-specific",
    language: "id",
    tips: [
      "Angka penjualan atau rating kepuasan pelanggan adalah bukti paling kuat untuk posisi ini — selalu sertakan jika ada.",
      "Tunjukkan sikap ramah lewat pilihan kata, bukan hanya klaim \"saya orangnya komunikatif\".",
    ],
    body: `Medan, 9 Juni 2026

Kepada Yth.
Bapak/Ibu Manajer HR
PT Mitra Ritel Sejahtera
Jl. Gatot Subroto No. 88, Medan

Dengan hormat,

Saya, Putri Anggraini, ingin melamar posisi Sales Associate di PT Mitra Ritel Sejahtera. Saya memiliki pengalaman satu setengah tahun sebagai kasir sekaligus sales lepas di sebuah toko elektronik, dengan tanggung jawab melayani pelanggan langsung dan menawarkan produk tambahan sesuai kebutuhan mereka.

Selama bekerja di sana, saya konsisten mencapai target penjualan bulanan dan pernah menjadi sales dengan tingkat konversi upselling tertinggi selama dua bulan berturut-turut. Saya terbiasa menangani keluhan pelanggan dengan tenang dan mencari solusi yang membuat mereka tetap puas.

Sebagai bahan pertimbangan, saya lampirkan CV dan surat keterangan kerja dari tempat sebelumnya.

Saya sangat antusias untuk bergabung dengan tim PT Mitra Ritel Sejahtera dan berkontribusi mencapai target penjualan bersama. Terima kasih atas perhatian Bapak/Ibu.

Hormat saya,


Putri Anggraini`,
  },
  {
    id: "it-tech",
    title: "IT / Teknologi",
    useCase: "Untuk posisi software engineer, IT support, atau peran teknis lain.",
    category: "position-specific",
    language: "id",
    tips: [
      "Sebut tools/bahasa pemrograman spesifik yang relevan dengan lowongan, bukan daftar generik semua yang pernah dipelajari.",
      "Kalau punya proyek open-source atau GitHub aktif, cantumkan — banyak recruiter tech memeriksanya.",
    ],
    body: `Jakarta, 14 Juli 2026

Kepada Yth.
Bapak/Ibu HRD
PT Teknologi Solusi Bangsa
Jl. HR Rasuna Said No. 10, Jakarta Selatan

Dengan hormat,

Saya ingin melamar posisi Backend Developer di PT Teknologi Solusi Bangsa yang saya temukan melalui LinkedIn. Saya lulusan D3 Teknik Informatika dengan pengalaman satu tahun sebagai backend developer di sebuah startup logistik, fokus pada pengembangan REST API menggunakan Node.js dan PostgreSQL.

Di posisi sebelumnya, saya ikut membangun sistem pelacakan pengiriman yang menangani lebih dari 5.000 permintaan API per hari, serta membantu mengoptimalkan query database sehingga waktu respons rata-rata turun dari 800ms menjadi di bawah 300ms. Saya juga terbiasa bekerja dengan Docker dan alur kerja Git dalam tim kecil.

Repositori proyek pribadi dapat dilihat di github.com/nama-pengguna, dan CV lengkap saya lampirkan bersama surat ini.

Saya terbuka untuk mendiskusikan bagaimana pengalaman saya dapat mendukung tim engineering Bapak/Ibu. Terima kasih atas waktu dan perhatiannya.

Hormat saya,


Reza Firmansyah`,
  },
  {
    id: "via-email",
    title: "Format Email",
    useCase: "Saat mengirim lamaran langsung lewat email, bukan lampiran surat terpisah.",
    category: "format-specific",
    language: "id",
    tips: [
      "Isi kolom subjek dengan format jelas: 'Lamaran Kerja – [Posisi] – [Nama]' agar mudah disortir HRD.",
      "Karena tempat & tanggal surat bersifat opsional untuk email, langsung mulai dari salam pembuka.",
    ],
    body: `Subjek: Lamaran Kerja – Content Writer – Bagus Prasetyo

Kepada Yth. Bapak/Ibu HRD,

Perkenalkan, nama saya Bagus Prasetyo. Saya tertarik melamar posisi Content Writer di PT Media Cerita Digital sebagaimana diiklankan di situs Glints. Saya memiliki pengalaman dua tahun menulis artikel SEO dan konten media sosial untuk sebuah agensi digital.

Selama bekerja di sana, saya menulis lebih dari 150 artikel dengan beberapa di antaranya berhasil menempati halaman pertama Google untuk kata kunci kompetitif di industri kuliner. Saya juga terbiasa riset kata kunci dasar dan menyesuaikan gaya tulisan untuk berbagai jenis audiens.

Berikut dokumen yang saya lampirkan sebagai bahan pertimbangan:
- CV
- Portofolio tulisan (tautan Google Drive)
- Contoh 3 artikel terbaik

Saya sangat terbuka untuk berdiskusi lebih lanjut mengenai bagaimana saya dapat berkontribusi di tim konten PT Media Cerita Digital. Terima kasih atas perhatian Bapak/Ibu.

Hormat saya,

Bagus Prasetyo
0812-xxxx-xxxx`,
  },
  {
    id: "fresh-graduate",
    title: "Fresh Graduate",
    useCase: "Untuk lulusan baru yang melamar posisi entry-level tanpa pengalaman kerja penuh waktu.",
    category: "experience-level",
    language: "id",
    tips: [
      "Manfaatkan IPK jika di atas 3.3, organisasi kampus, atau proyek akhir sebagai pengganti pengalaman kerja.",
      "Tunjukkan bahwa kamu sudah riset perusahaan — ini yang paling membedakan fresh graduate yang serius dari yang asal kirim CV.",
    ],
    body: `Malang, 25 Agustus 2026

Kepada Yth.
Bapak/Ibu HRD
PT Karya Finansial Indonesia
Jl. Ijen No. 15, Malang

Dengan hormat,

Saya, Salsabila Rahmawati, lulusan S1 Akuntansi Universitas Brawijaya dengan IPK 3.58, bermaksud melamar posisi Junior Accountant di PT Karya Finansial Indonesia. Saya tertarik dengan perusahaan Bapak/Ibu karena reputasinya yang kuat dalam layanan konsultasi keuangan untuk UMKM, sejalan dengan minat saya membantu bisnis kecil mengelola keuangan dengan lebih baik.

Selama kuliah, saya aktif sebagai bendahara himpunan mahasiswa jurusan selama satu tahun, mengelola laporan keuangan organisasi dengan total anggaran sekitar Rp50 juta per tahun. Skripsi saya juga membahas penerapan akuntansi sederhana pada UMKM, yang membuat saya cukup familiar dengan tantangan yang dihadapi bisnis kecil.

Saya lampirkan CV, transkrip nilai, dan sertifikat pelatihan Brevet Pajak A-B sebagai bahan pertimbangan.

Saya sangat berharap dapat diberi kesempatan untuk berdiskusi lebih lanjut mengenai bagaimana saya dapat berkontribusi bagi tim Bapak/Ibu. Terima kasih atas perhatiannya.

Hormat saya,


Salsabila Rahmawati`,
  },
];

/**
 * Generic cover-letter structure guide (original wording — not copied from
 * any source). Each step includes a short original example instead of a
 * full letter, so it works as a standalone reference even outside the
 * full templates above.
 */
export interface StructureGuideStep {
  step: number;
  title: string;
  description: string;
  example: string;
}

export const COVER_LETTER_STRUCTURE_GUIDE: StructureGuideStep[] = [
  {
    step: 1,
    title: "Tempat dan tanggal",
    description:
      "Tulis di kanan atas jika format Word atau tulisan tangan. Boleh dihilangkan sepenuhnya jika mengirim lewat email atau WhatsApp.",
    example: "Bandung, 3 Juni 2026",
  },
  {
    step: 2,
    title: "Salam pembuka & tujuan",
    description:
      "Sebutkan nama penerima jika tahu; kalau tidak, gunakan jabatan atau nama departemen. Hindari salam yang terlalu umum tanpa tujuan jelas.",
    example: "Kepada Yth. Bapak/Ibu HRD PT Karya Mandiri",
  },
  {
    step: 3,
    title: "Perkenalan diri",
    description: "Nama, latar belakang pendidikan, dan sumber informasi lowongan dalam satu-dua kalimat.",
    example: "Perkenalkan, saya Dinda Ayu, lulusan D3 Manajemen dari Universitas Airlangga.",
  },
  {
    step: 4,
    title: "Alasan melamar",
    description: "Kaitkan minatmu dengan hal spesifik tentang perusahaan — bukan pujian generik.",
    example: "Saya tertarik bergabung karena fokus perusahaan pada pengembangan UMKM lokal.",
  },
  {
    step: 5,
    title: "Pencapaian & kualifikasi",
    description: "Satu atau dua pencapaian dengan angka lebih meyakinkan daripada daftar sifat tanpa bukti.",
    example: "Berhasil menurunkan tingkat komplain pelanggan sebesar 20% dalam tiga bulan.",
  },
  {
    step: 6,
    title: "Lampiran",
    description: "Sebutkan dokumen pendukung dalam bentuk daftar singkat agar mudah dipindai HRD.",
    example: "CV, fotokopi ijazah, sertifikat pelatihan terkait.",
  },
  {
    step: 7,
    title: "Penutup",
    description: "Ucapan terima kasih plus ajakan untuk berdiskusi lebih lanjut, sertakan kontak yang aktif.",
    example: "Saya sangat terbuka untuk berdiskusi lebih lanjut dan dapat dihubungi melalui email/nomor berikut.",
  },
  {
    step: 8,
    title: "Tanda tangan",
    description: "Nama lengkap di bawah 'Hormat saya,' — tanda tangan fisik untuk cetak/tulisan tangan, cukup nama untuk email.",
    example: "Hormat saya,\n\nDinda Ayu",
  },
];
