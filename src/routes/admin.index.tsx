import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FileText, Activity, Clock, CheckCircle2, AlertTriangle, ChevronRight, ClipboardList } from "lucide-react";
import { MASCOT } from "@/lib/data";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/slfk/Shell";
import { SectionTitle, ItemPhoto, StatusBadge } from "@/components/slfk/Primitives";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { user, reports, claims } = useApp();
  const navigate = useNavigate();
  if (typeof window !== "undefined" && (!user || user.role !== "admin")) {
    navigate({ to: "/login" });
    return null;
  }
  if (!user) return null;

  const total = reports.length;
  const aktif = reports.filter((r) => r.status === "Aktif").length;
  const klaim = claims.filter((c) => c.status === "Menunggu" || c.status === "Klarifikasi").length;
  const selesai = reports.filter((r) => r.status === "Selesai" || r.status === "Diklaim").length;

  const stats = [
    { label: "Total Laporan", value: total, icon: FileText, grad: "bg-gradient-primary" },
    { label: "Laporan Aktif", value: aktif, icon: Activity, grad: "bg-gradient-success" },
    { label: "Klaim Diproses", value: klaim, icon: Clock, grad: "bg-gradient-purple" },
    { label: "Laporan Selesai", value: selesai, icon: CheckCircle2, grad: "bg-gradient-primary" },
  ];

  const butuhTindakan = reports.filter((r) => r.status === "Menunggu Verifikasi" || r.status === "Cocok");
  const aktivitas = [
    { text: "Klaim baru diajukan untuk Tumbler Biru Stainless", time: "5 menit lalu" },
    { text: "Laporan Flashdisk Silver mendapat kecocokan", time: "1 jam lalu" },
    { text: "Kunci Motor Honda telah diserahkan ke pemilik", time: "Kemarin" },
  ];

  return (
    <AppShell>
      {/* Hero */}
      <div className="bg-gradient-primary gloss-top relative mb-5 overflow-hidden rounded-[2rem] p-5 shadow-glow">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-md" />
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs font-medium text-white/85">Panel Administrator</p>
            <h1 className="font-heading text-lg font-extrabold text-white">Selamat datang, {user.nama}</h1>
            <p className="mt-1 text-xs text-white/85">Pantau aktivitas laporan barang hilang dan temuan.</p>
          </div>
          <img src={MASCOT.guide} alt="PINO" className="h-24 w-24 shrink-0 object-contain drop-shadow" />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card flex flex-col gap-2 rounded-3xl p-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${s.grad} text-white shadow-soft`}>
                <Icon size={18} />
              </span>
              <p className="font-heading text-2xl font-black leading-none text-navy">{s.value}</p>
              <p className="text-[11px] font-medium text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Ringkasan Hari Ini */}
      <SectionTitle title="Ringkasan Laporan Hari Ini" />
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          { label: "Barang Hilang", value: reports.filter((r) => r.type === "hilang").length },
          { label: "Barang Temuan", value: reports.filter((r) => r.type === "temuan").length },
          { label: "Cocok", value: reports.filter((r) => r.status === "Cocok").length },
        ].map((s) => (
          <div key={s.label} className="bg-gradient-soft rounded-3xl border border-border p-3 text-center">
            <p className="font-heading text-2xl font-black text-navy">{s.value}</p>
            <p className="text-[10px] font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Butuh Tindakan */}
      <SectionTitle title="Laporan Butuh Tindakan" action={<Link to="/admin/kelola" className="text-xs font-semibold text-primary">Kelola</Link>} />
      <div className="mb-5 space-y-3">
        {butuhTindakan.slice(0, 3).map((r) => (
          <Link key={r.id} to="/admin/kelola" className="glass-card flex items-center gap-3 rounded-3xl p-3 active:scale-[0.99]">
            <ItemPhoto src={r.foto} alt={r.nama} rounded="rounded-2xl" className="h-14 w-14 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-muted-foreground">{r.id}</p>
              <h3 className="truncate font-heading text-sm font-bold text-navy">{r.nama}</h3>
            </div>
            <StatusBadge status={r.status} />
          </Link>
        ))}
      </div>

      {/* Aktivitas Terbaru */}
      <SectionTitle title="Aktivitas Terbaru" />
      <div className="mb-5 space-y-2.5">
        {aktivitas.map((a, i) => (
          <div key={i} className="glass-card flex items-center gap-3 rounded-3xl p-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-primary">
              <AlertTriangle size={16} />
            </span>
            <p className="flex-1 text-xs text-navy">{a.text}</p>
            <span className="text-[10px] text-muted-foreground">{a.time}</span>
          </div>
        ))}
      </div>

      {/* Akses Cepat */}
      <SectionTitle title="Akses Cepat" />
      <Link to="/admin/kelola" className="bg-gradient-primary gloss-top relative flex items-center gap-3 overflow-hidden rounded-3xl p-4 shadow-soft active:scale-[0.99]">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-white/40">
          <ClipboardList size={22} />
        </span>
        <div className="flex-1">
          <h3 className="font-heading text-sm font-extrabold text-white">Kelola Laporan Barang</h3>
          <p className="text-[11px] text-white/85">Cari, filter, dan ubah status laporan.</p>
        </div>
        <ChevronRight size={18} className="text-white" />
      </Link>
    </AppShell>
  );
}
