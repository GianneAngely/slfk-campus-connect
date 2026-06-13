export type Role = "mahasiswa" | "satpam" | "admin";

export type ReportType = "hilang" | "temuan";

export type ReportStatus =
  | "Aktif"
  | "Cocok"
  | "Menunggu Verifikasi"
  | "Diklaim"
  | "Selesai";

export interface User {
  id: string;
  nama: string;
  identitas: string; // NIM atau ID
  identitasLabel: string;
  prodiJabatan: string;
  email: string;
  password: string;
  hp: string;
  role: Role;
}

export interface ItemReport {
  id: string;
  type: ReportType;
  nama: string;
  kategori: string;
  subkategori?: string;
  warna: string;
  lokasi: string;
  tanggal: string;
  jam: string;
  status: ReportStatus;
  pelapor: string;
  kontak?: string;
  deskripsi: string;
  ciri: string;
  kondisi?: string;
  penyimpanan?: string;
  foto: string;
  matchId?: string;
  matchScore?: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  status: "Baru" | "Sedang" | "Proses" | "Aktif" | "Selesai";
  read: boolean;
  reportId: string;
}

export interface Claim {
  id: string;
  reportId: string;
  namaPengklaim: string;
  nim: string;
  email: string;
  hp: string;
  bukti: string;
  ciri: string;
  status: "Menunggu" | "Diverifikasi" | "Ditolak" | "Klarifikasi";
  itemNama: string;
  foto: string;
}

export const FOTO = {
  tumbler:
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
  wallet:
    "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
  flashdrive:
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80",
  notebook:
    "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80",
  keys: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=900&q=80",
  earbuds:
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80",
  glasses:
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80",
  backpack:
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
};

export const USERS: User[] = [
  {
    id: "u-mhs",
    nama: "Nara Putri",
    identitas: "230101001",
    identitasLabel: "NIM",
    prodiJabatan: "Teknik Informatika",
    email: "nara@kampus.id",
    password: "12345678",
    hp: "081234567890",
    role: "mahasiswa",
  },
  {
    id: "u-satpam",
    nama: "Budi Santosa",
    identitas: "SATPAM-001",
    identitasLabel: "ID Petugas",
    prodiJabatan: "Satpam Kampus",
    email: "satpam@kampus.id",
    password: "12345678",
    hp: "081234567891",
    role: "satpam",
  },
  {
    id: "u-admin",
    nama: "Rina Maharani",
    identitas: "ADMIN-001",
    identitasLabel: "ID Admin",
    prodiJabatan: "Administrator",
    email: "admin@kampus.id",
    password: "12345678",
    hp: "081234567892",
    role: "admin",
  },
];

export const INITIAL_REPORTS: ItemReport[] = [
  {
    id: "LH-2026-001",
    type: "hilang",
    nama: "Tumbler Biru Stainless 600ml",
    kategori: "Botol Minum",
    subkategori: "Tumbler",
    warna: "Biru",
    lokasi: "Perpustakaan Lantai 1",
    tanggal: "12 Juni 2026",
    jam: "13.20",
    status: "Cocok",
    pelapor: "Nara Putri",
    kontak: "081234567890",
    deskripsi: "Tumbler stainless warna biru, ukuran 600ml dengan stiker kecil di badan botol.",
    ciri: "Ada stiker bintang dan goresan tipis di tutup.",
    foto: FOTO.tumbler,
    matchId: "LT-2026-006",
    matchScore: 92,
  },
  {
    id: "LH-2026-002",
    type: "hilang",
    nama: "Dompet Hitam Kulit",
    kategori: "Tas & Dompet",
    subkategori: "Dompet",
    warna: "Hitam",
    lokasi: "Kantin Utama",
    tanggal: "11 Juni 2026",
    jam: "12.10",
    status: "Aktif",
    pelapor: "Nara Putri",
    kontak: "081234567890",
    deskripsi: "Dompet kulit hitam berisi kartu mahasiswa dan beberapa kartu lain.",
    ciri: "Jahitan warna biru di pinggir dan inisial N.P.",
    foto: FOTO.wallet,
  },
  {
    id: "LH-2026-003",
    type: "hilang",
    nama: "Flashdisk Silver 32GB",
    kategori: "Elektronik",
    subkategori: "Penyimpanan Data",
    warna: "Silver",
    lokasi: "Lab Komputer 1",
    tanggal: "10 Juni 2026",
    jam: "15.30",
    status: "Cocok",
    pelapor: "Nara Putri",
    kontak: "081234567890",
    deskripsi: "Flashdisk silver kapasitas 32GB dengan gantungan tali pendek.",
    ciri: "Ada tempelan label nama dan gantungan tali merah.",
    foto: FOTO.flashdrive,
    matchId: "LT-2026-008",
    matchScore: 88,
  },
  {
    id: "LH-2026-004",
    type: "hilang",
    nama: "Buku Catatan Struktur Data",
    kategori: "Buku & Dokumen",
    subkategori: "Buku Catatan",
    warna: "Cokelat",
    lokasi: "Ruang A-204",
    tanggal: "9 Juni 2026",
    jam: "10.00",
    status: "Menunggu Verifikasi",
    pelapor: "Nara Putri",
    kontak: "081234567890",
    deskripsi: "Buku catatan sampul cokelat berisi materi struktur data.",
    ciri: "Sampul cokelat dengan stiker kampus dan tulisan tangan di halaman depan.",
    foto: FOTO.notebook,
  },
  {
    id: "LH-2026-005",
    type: "hilang",
    nama: "Kunci Motor Honda",
    kategori: "Kunci",
    subkategori: "Kunci Kendaraan",
    warna: "Hitam",
    lokasi: "Area Parkir Timur",
    tanggal: "8 Juni 2026",
    jam: "17.15",
    status: "Diklaim",
    pelapor: "Nara Putri",
    kontak: "081234567890",
    deskripsi: "Kunci motor Honda dengan gantungan tali biru bertuliskan nama.",
    ciri: "Gantungan tali biru dan kunci cadangan kecil.",
    foto: FOTO.keys,
  },
  {
    id: "LT-2026-006",
    type: "temuan",
    nama: "Tumbler Biru Stainless 600ml",
    kategori: "Botol Minum",
    subkategori: "Tumbler",
    warna: "Biru",
    lokasi: "Perpustakaan Lantai 1",
    tanggal: "12 Juni 2026",
    jam: "13.45",
    status: "Cocok",
    pelapor: "Budi Santosa",
    kondisi: "Baik",
    penyimpanan: "Pos Satpam Utama",
    deskripsi: "Tumbler biru ditemukan di meja baca perpustakaan lantai 1.",
    ciri: "Terdapat stiker bintang dan sedikit goresan pada tutup.",
    foto: FOTO.tumbler,
    matchId: "LH-2026-001",
    matchScore: 92,
  },
  {
    id: "LT-2026-007",
    type: "temuan",
    nama: "Dompet Hitam Kulit",
    kategori: "Tas & Dompet",
    subkategori: "Dompet",
    warna: "Hitam",
    lokasi: "Pos Satpam Gedung B",
    tanggal: "11 Juni 2026",
    jam: "12.30",
    status: "Aktif",
    pelapor: "Budi Santosa",
    kondisi: "Baik",
    penyimpanan: "Pos Satpam Utama",
    deskripsi: "Dompet kulit hitam diserahkan oleh mahasiswa ke pos satpam gedung B.",
    ciri: "Jahitan biru di pinggir dompet.",
    foto: FOTO.wallet,
  },
  {
    id: "LT-2026-008",
    type: "temuan",
    nama: "Flashdisk Silver 32GB",
    kategori: "Elektronik",
    subkategori: "Penyimpanan Data",
    warna: "Silver",
    lokasi: "Lab Komputer 1",
    tanggal: "10 Juni 2026",
    jam: "16.05",
    status: "Cocok",
    pelapor: "Budi Santosa",
    kondisi: "Baik",
    penyimpanan: "Pos Satpam Utama",
    deskripsi: "Flashdisk silver tertinggal di salah satu komputer lab.",
    ciri: "Ada label nama dan gantungan tali merah.",
    foto: FOTO.flashdrive,
    matchId: "LH-2026-003",
    matchScore: 88,
  },
  {
    id: "LT-2026-009",
    type: "temuan",
    nama: "Buku Catatan Struktur Data",
    kategori: "Buku & Dokumen",
    subkategori: "Buku Catatan",
    warna: "Cokelat",
    lokasi: "Ruang A-204",
    tanggal: "9 Juni 2026",
    jam: "10.15",
    status: "Menunggu Verifikasi",
    pelapor: "Budi Santosa",
    kondisi: "Baik",
    penyimpanan: "Front Office",
    deskripsi: "Buku catatan cokelat tertinggal di ruang kelas A-204.",
    ciri: "Sampul cokelat dengan stiker kampus.",
    foto: FOTO.notebook,
  },
  {
    id: "LT-2026-010",
    type: "temuan",
    nama: "Kunci Motor Honda",
    kategori: "Kunci",
    subkategori: "Kunci Kendaraan",
    warna: "Hitam",
    lokasi: "Gerbang Timur",
    tanggal: "8 Juni 2026",
    jam: "17.25",
    status: "Diklaim",
    pelapor: "Budi Santosa",
    kondisi: "Baik",
    penyimpanan: "Pos Satpam Utama",
    deskripsi: "Kunci motor Honda ditemukan di sekitar gerbang timur.",
    ciri: "Gantungan tali biru bertuliskan nama.",
    foto: FOTO.keys,
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "Kecocokan baru ditemukan",
    message: "Kecocokan baru untuk Tumbler Biru Stainless 600ml.",
    time: "5 menit lalu",
    status: "Baru",
    read: false,
    reportId: "LH-2026-001",
  },
  {
    id: "n2",
    title: "Kecocokan sedang",
    message: "Kecocokan sedang untuk Flashdisk Silver 32GB.",
    time: "1 jam lalu",
    status: "Sedang",
    read: false,
    reportId: "LH-2026-003",
  },
  {
    id: "n3",
    title: "Klaim sedang diverifikasi",
    message: "Klaim Buku Catatan sedang diverifikasi oleh petugas.",
    time: "3 jam lalu",
    status: "Proses",
    read: false,
    reportId: "LH-2026-004",
  },
  {
    id: "n4",
    title: "Laporan masih aktif",
    message: "Laporan Dompet Hitam Kulit masih aktif menunggu kecocokan.",
    time: "Kemarin",
    status: "Aktif",
    read: true,
    reportId: "LH-2026-002",
  },
  {
    id: "n5",
    title: "Barang sudah diklaim",
    message: "Kunci Motor Honda sudah diklaim dan diserahkan.",
    time: "2 hari lalu",
    status: "Selesai",
    read: true,
    reportId: "LH-2026-005",
  },
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: "KLM-001",
    reportId: "LT-2026-006",
    namaPengklaim: "Nara Putri",
    nim: "230101001",
    email: "nara@kampus.id",
    hp: "081234567890",
    bukti: "Ada stiker bintang dan goresan pada tutup tumbler.",
    ciri: "Stiker bintang biru, goresan tipis di tutup.",
    status: "Menunggu",
    itemNama: "Tumbler Biru Stainless 600ml",
    foto: FOTO.tumbler,
  },
  {
    id: "KLM-002",
    reportId: "LT-2026-008",
    namaPengklaim: "Nara Putri",
    nim: "230101001",
    email: "nara@kampus.id",
    hp: "081234567890",
    bukti: "Label nama tertempel dan ada gantungan tali merah.",
    ciri: "Gantungan tali merah, label nama.",
    status: "Menunggu",
    itemNama: "Flashdisk Silver 32GB",
    foto: FOTO.flashdrive,
  },
  {
    id: "KLM-003",
    reportId: "LT-2026-009",
    namaPengklaim: "Nara Putri",
    nim: "230101001",
    email: "nara@kampus.id",
    hp: "081234567890",
    bukti: "Tulisan tangan di halaman depan buku catatan.",
    ciri: "Stiker kampus pada sampul cokelat.",
    status: "Klarifikasi",
    itemNama: "Buku Catatan Struktur Data",
    foto: FOTO.notebook,
  },
];

export const KATEGORI = [
  "Botol Minum",
  "Tas & Dompet",
  "Elektronik",
  "Buku & Dokumen",
  "Kunci",
  "Aksesoris",
  "Lainnya",
];

export const PENYIMPANAN = ["Pos Satpam Utama", "Front Office", "Ruang Administrasi"];

export const MASCOT = {
  face: "/images/pino-face-closeup.png",
  guide: "/images/pino-guide.png",
  happyKey: "/images/pino-happy-key.png",
  foundPhoneKey: "/images/pino-found-phone-key.png",
  confusedEarbuds: "/images/pino-confused-earbuds.png",
  searchPhone: "/images/pino-search-phone.png",
  verify: "/images/pino-verify.png",
  notification: "/images/pino-notification-alert.png",
  success: "/images/pino-success-key-sparkle.png",
};

export const STATUS_META: Record<
  ReportStatus,
  { label: string; className: string }
> = {
  Aktif: { label: "Aktif", className: "bg-secondary/15 text-secondary border-secondary/30" },
  Cocok: { label: "Cocok", className: "bg-success/15 text-success border-success/30" },
  "Menunggu Verifikasi": {
    label: "Menunggu Verifikasi",
    className: "bg-warning/20 text-warning-foreground border-warning/40",
  },
  Diklaim: { label: "Diklaim", className: "bg-purple-accent/15 text-purple-accent border-purple-accent/30" },
  Selesai: { label: "Selesai", className: "bg-muted text-muted-foreground border-border" },
};
