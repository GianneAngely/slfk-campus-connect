import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, FileText, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { MASCOT } from "@/lib/data";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/slfk/Shell";
import { MatchCard, ReportCard } from "@/components/slfk/ReportCard";
import { SectionTitle } from "@/components/slfk/Primitives";

export const Route = createFileRoute("/beranda")({
  component: BerandaMahasiswa,
});

function BerandaMahasiswa() {
  const { user, reports, unreadCount, claims } = useApp();
  const navigate = useNavigate();

  if (typeof window !== "undefined" && (!user || user.role !== "mahasiswa")) {
    navigate({ to: "/login" });
    return null;
  }
  if (!user) return null;

  const mine = reports.filter((r) => r.type === "hilang");
  const aktif = reports.filter((r) => r.status === "Aktif").length;
  const cocok = reports.filter((r) => r.status === "Cocok").length;
  const klaim = claims.filter((c) => c.status === "Menunggu" || c.status === "Klarifikasi").length;
  const matches = reports.filter((r) => r.status === "Cocok" && r.type === "temuan");

  const stats = [
    { label: "Laporan Aktif", value: aktif, icon: FileText, to: "/notifikasi", grad: "bg-gradient-primary" },
    { label: "Cocok Ditemukan", value: cocok, icon: CheckCircle2, to: "/notifikasi", grad: "bg-gradient-success" },
    { label: "Klaim Diproses", value: klaim, icon: Clock, to: "/notifikasi", grad: "bg-gradient-purple" },
    { label: "Notifikasi Baru", value: unreadCount, icon: Bell, to: "/notifikasi", grad: "bg-gradient-primary" },
  ];

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-extrabold text-navy">Halo, {user.nama}</h1>
          <p className="text-xs text-muted-foreground">
            Semoga barangmu cepat ditemukan bersama PINO.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/notifikasi" className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card shadow-soft">
            <Bell size={18} className="text-navy" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-danger-foreground">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link to="/profil" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary font-heading text-sm font-bold text-primary-foreground shadow-soft">
            {user.nama.charAt(0)}
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-primary gloss-top relative mb-5 overflow-hidden rounded-[2rem] p-5 shadow-glow">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-md" />
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h2 className="font-heading text-lg font-extrabold leading-tight text-white">
              Kehilangan sesuatu?
            </h2>
            <p className="mt-1 text-xs text-white/85">
              Laporkan sekarang, PINO bantu cocokkan laporanmu.
            </p>
          </div>
          <img src={MASCOT.happyKey} alt="PINO" className="h-24 w-24 shrink-0 object-contain drop-shadow" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link to="/lapor/hilang" className="rounded-full bg-white py-2.5 text-center font-heading text-xs font-bold text-primary shadow active:scale-95">
            Lapor Barang Hilang
          </Link>
          <Link to="/lapor/temuan" className="rounded-full bg-white/20 py-2.5 text-center font-heading text-xs font-bold text-white ring-1 ring-white/40 active:scale-95">
            Laporkan Barang Temuan
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} to={s.to} className="glass-card flex items-center gap-3 rounded-3xl p-3 active:scale-[0.98]">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${s.grad} text-white shadow-soft`}>
                <Icon size={18} />
              </span>
              <div>
                <p className="font-heading text-xl font-black leading-none text-navy">{s.value}</p>
                <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{s.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pencocokan Teratas */}
      <SectionTitle title="Pencocokan Teratas" />
      <div className="no-scrollbar -mx-4 mb-5 flex gap-3 overflow-x-auto px-4 pb-1">
        {matches.map((r) => (
          <MatchCard key={r.id} report={r} />
        ))}
      </div>

      {/* Laporan Terbaru */}
      <SectionTitle
        title="Laporan Terbaru"
        action={<Link to="/notifikasi" className="text-xs font-semibold text-primary">Lihat semua</Link>}
      />
      <div className="mb-5 space-y-3">
        {mine.slice(0, 4).map((r) => (
          <ReportCard key={r.id} report={r} />
        ))}
      </div>

      {/* Tips */}
      <div className="bg-gradient-soft flex items-center gap-3 rounded-3xl border border-border p-4">
        <div className="h-16 w-16 shrink-0 rounded-2xl bg-card p-1 shadow-soft">
          <img src={MASCOT.guide} alt="PINO" className="h-full w-full object-contain" />
        </div>
        <div>
          <p className="flex items-center gap-1 font-heading text-sm font-bold text-navy">
            <Sparkles size={14} className="text-purple-accent" /> Tips dari PINO
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Tambahkan ciri unik seperti warna, goresan, stiker, atau gantungan agar laporan lebih mudah dicocokkan.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
