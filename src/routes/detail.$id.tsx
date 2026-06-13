import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { Phone, ArrowLeft, MapPin, CalendarClock, User2, Tag, Palette, Box, FileText, Sparkles, CheckCircle2 } from "lucide-react";
import { MASCOT } from "@/lib/data";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/slfk/Shell";
import { ItemPhoto, StatusBadge } from "@/components/slfk/Primitives";
import { PrimaryButton } from "@/components/slfk/Modal";

export const Route = createFileRoute("/detail/$id")({
  component: DetailPage,
});

function Info({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2.5 py-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-primary">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-navy">{value}</p>
      </div>
    </div>
  );
}

function DetailPage() {
  const { id } = useParams({ from: "/detail/$id" });
  const navigate = useNavigate();
  const { reports, user } = useApp();
  const report = reports.find((r) => r.id === id);

  if (!report) {
    return (
      <AppShell>
        <div className="mt-20 text-center">
          <p className="text-sm text-muted-foreground">Laporan tidak ditemukan.</p>
          <Link to="/beranda" className="mt-3 inline-block text-sm font-semibold text-primary">Kembali</Link>
        </div>
      </AppShell>
    );
  }

  const timeline = [
    { label: "Laporan dibuat", done: true },
    { label: "Pencocokan dicari", done: report.status !== "Aktif" },
    { label: "Klaim / verifikasi", done: ["Diklaim", "Selesai", "Menunggu Verifikasi"].includes(report.status) },
    { label: "Selesai", done: report.status === "Selesai" },
  ];

  const isMatch = report.status === "Cocok";
  const home = user?.role === "satpam" ? "/satpam" : user?.role === "admin" ? "/admin" : "/beranda";

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-28">
      {/* Photo header */}
      <div className="relative">
        <ItemPhoto src={report.foto} alt={report.nama} rounded="rounded-b-[2rem]" className="h-60 w-full" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <button onClick={() => navigate({ to: home })} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card/90 text-navy shadow-soft backdrop-blur active:scale-95">
            <ArrowLeft size={18} />
          </button>
          <StatusBadge status={report.status} className="bg-card/90 backdrop-blur" />
        </div>
      </div>

      <div className="-mt-6 space-y-4 px-4">
        {/* Title card */}
        <div className="glass-card rounded-3xl p-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-primary">
              {report.type === "hilang" ? "Barang Hilang" : "Barang Temuan"}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">{report.id}</span>
          </div>
          <h1 className="mt-2 font-heading text-xl font-extrabold text-navy">{report.nama}</h1>
          <p className="mt-1 text-xs text-muted-foreground">{report.deskripsi}</p>
        </div>

        {/* Match card */}
        {isMatch && (
          <div className="bg-gradient-success gloss-top relative overflow-hidden rounded-3xl p-4 text-white shadow-glow">
            <div className="flex items-center gap-3">
              <img src={MASCOT.searchPhone} alt="PINO" className="h-16 w-16 object-contain" />
              <div className="flex-1">
                <p className="font-heading text-base font-extrabold">Kecocokan Ditemukan</p>
                <p className="text-xs text-white/90">Tingkat kecocokan {report.matchScore}%</p>
              </div>
              <span className="font-heading text-2xl font-black">{report.matchScore}%</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {["Kategori sama", "Warna sama", "Lokasi berdekatan", "Deskripsi mirip"].map((r) => (
                <span key={r} className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold">
                  <CheckCircle2 size={12} /> {r}
                </span>
              ))}
            </div>
            {user?.role === "mahasiswa" && (
              <Link to="/klaim/$id" params={{ id: report.matchId ?? report.id }} className="mt-3 block rounded-full bg-white py-2.5 text-center font-heading text-xs font-bold text-success active:scale-[0.99]">
                Ajukan Klaim
              </Link>
            )}
          </div>
        )}

        {/* Detail info */}
        <div className="rounded-3xl border border-border bg-card p-4 shadow-soft">
          <h2 className="mb-1 font-heading text-sm font-bold text-navy">Detail Laporan</h2>
          <div className="divide-y divide-border/60">
            <Info icon={Tag} label="Kategori" value={report.kategori} />
            <Info icon={Palette} label="Warna" value={report.warna} />
            <Info icon={MapPin} label="Lokasi" value={report.lokasi} />
            <Info icon={CalendarClock} label="Tanggal & Jam" value={`${report.tanggal} • ${report.jam}`} />
            <Info icon={User2} label={report.type === "hilang" ? "Pelapor" : "Penemu"} value={report.pelapor} />
            <Info icon={Phone} label="Kontak" value={report.kontak} />
            <Info icon={Box} label="Tempat penyimpanan" value={report.penyimpanan} />
            <Info icon={Sparkles} label="Ciri khusus" value={report.ciri} />
            <Info icon={FileText} label="Deskripsi" value={report.deskripsi} />
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-3xl border border-border bg-card p-4 shadow-soft">
          <h2 className="mb-3 font-heading text-sm font-bold text-navy">Proses Laporan</h2>
          <div className="space-y-0">
            {timeline.map((t, i) => (
              <div key={t.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${t.done ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {t.done ? <CheckCircle2 size={13} /> : i + 1}
                  </span>
                  {i < timeline.length - 1 && <span className={`h-7 w-0.5 ${t.done ? "bg-primary" : "bg-border"}`} />}
                </div>
                <span className={`pt-0.5 text-sm font-medium ${t.done ? "text-navy" : "text-muted-foreground"}`}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-2">
          {user?.role === "mahasiswa" && report.status !== "Selesai" && report.status !== "Diklaim" && (
            <PrimaryButton onClick={() => navigate({ to: "/klaim/$id", params: { id: report.matchId ?? report.id } })}>
              Ajukan Klaim
            </PrimaryButton>
          )}
          <PrimaryButton variant="outline" className="flex items-center justify-center gap-2" onClick={() => {}}>
            <Phone size={15} /> Hubungi Petugas
          </PrimaryButton>
          <button onClick={() => navigate({ to: home })} className="w-full py-2 text-center text-sm font-semibold text-muted-foreground">
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
