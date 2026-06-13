import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, PackageSearch, CheckCircle2, Handshake, ChevronRight, Clock } from "lucide-react";
import { MASCOT } from "@/lib/data";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/slfk/Shell";
import { SectionTitle, ItemPhoto, StatusBadge } from "@/components/slfk/Primitives";

export const Route = createFileRoute("/satpam/")({
  component: SatpamHome,
});

function SatpamHome() {
  const { user, reports, claims } = useApp();
  const navigate = useNavigate();
  if (typeof window !== "undefined" && (!user || user.role !== "satpam")) {
    navigate({ to: "/login" });
    return null;
  }
  if (!user) return null;

  const menunggu = claims.filter((c) => c.status === "Menunggu" || c.status === "Klarifikasi").length;
  const temuanAktif = reports.filter((r) => r.type === "temuan" && r.status === "Aktif").length;
  const cocok = reports.filter((r) => r.status === "Cocok").length;
  const temuanReports = reports.filter((r) => r.type === "temuan");

  const stats = [
    { label: "Klaim Menunggu Verifikasi", value: menunggu, icon: ShieldCheck, grad: "bg-gradient-primary", to: "/satpam/verifikasi" },
    { label: "Barang Temuan Aktif", value: temuanAktif, icon: PackageSearch, grad: "bg-gradient-success", to: "/satpam/verifikasi" },
    { label: "Laporan Cocok", value: cocok, icon: CheckCircle2, grad: "bg-gradient-purple", to: "/satpam/verifikasi" },
    { label: "Serah Terima Hari Ini", value: 2, icon: Handshake, grad: "bg-gradient-primary", to: "/satpam/verifikasi" },
  ];

  const jadwal = [
    { nama: "Nara Putri", item: "Tumbler Biru Stainless", jam: "Hari ini • 14.00", tempat: "Pos Satpam Utama" },
    { nama: "Nara Putri", item: "Flashdisk Silver 32GB", jam: "Hari ini • 15.30", tempat: "Pos Satpam Utama" },
  ];

  return (
    <AppShell>
      {/* Header hero */}
      <div className="bg-gradient-primary gloss-top relative mb-5 overflow-hidden rounded-[2rem] p-5 shadow-glow">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-md" />
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs font-medium text-white/85">Pos Satpam Kampus</p>
            <h1 className="font-heading text-lg font-extrabold text-white">Selamat bertugas, {user.nama}</h1>
            <p className="mt-1 text-xs text-white/85">Pantau barang temuan dan klaim dari satu tempat.</p>
          </div>
          <img src={MASCOT.verify} alt="PINO" className="h-24 w-24 shrink-0 object-contain drop-shadow" />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} to={s.to} className="glass-card flex flex-col gap-2 rounded-3xl p-3 active:scale-[0.98]">
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${s.grad} text-white shadow-soft`}>
                <Icon size={18} />
              </span>
              <p className="font-heading text-2xl font-black leading-none text-navy">{s.value}</p>
              <p className="text-[11px] font-medium text-muted-foreground">{s.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Klaim Terbaru */}
      <SectionTitle title="Klaim Terbaru" action={<Link to="/satpam/verifikasi" className="text-xs font-semibold text-primary">Verifikasi</Link>} />
      <div className="mb-5 space-y-3">
        {claims.slice(0, 3).map((c) => (
          <Link key={c.id} to="/satpam/verifikasi" className="glass-card flex items-center gap-3 rounded-3xl p-3 active:scale-[0.99]">
            <ItemPhoto src={c.foto} alt={c.itemNama} rounded="rounded-2xl" className="h-14 w-14 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-muted-foreground">{c.id}</p>
              <h3 className="truncate font-heading text-sm font-bold text-navy">{c.itemNama}</h3>
              <p className="truncate text-[11px] text-muted-foreground">Pengklaim: {c.namaPengklaim}</p>
            </div>
            <span className="rounded-full bg-warning/20 px-2.5 py-1 text-[10px] font-bold text-warning-foreground">{c.status}</span>
          </Link>
        ))}
      </div>

      {/* Barang Temuan Terbaru */}
      <SectionTitle title="Barang Temuan Terbaru" />
      <div className="mb-5 space-y-3">
        {temuanReports.slice(0, 3).map((r) => (
          <Link key={r.id} to="/detail/$id" params={{ id: r.id }} className="glass-card flex items-center gap-3 rounded-3xl p-3 active:scale-[0.99]">
            <ItemPhoto src={r.foto} alt={r.nama} rounded="rounded-2xl" className="h-14 w-14 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-muted-foreground">{r.id}</p>
              <h3 className="truncate font-heading text-sm font-bold text-navy">{r.nama}</h3>
              <p className="truncate text-[11px] text-muted-foreground">{r.penyimpanan}</p>
            </div>
            <StatusBadge status={r.status} />
          </Link>
        ))}
      </div>

      {/* Jadwal Pengambilan */}
      <SectionTitle title="Jadwal Pengambilan" />
      <div className="mb-5 space-y-3">
        {jadwal.map((j, i) => (
          <div key={i} className="glass-card flex items-center gap-3 rounded-3xl p-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <Clock size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-heading text-sm font-bold text-navy">{j.item}</h3>
              <p className="text-[11px] text-muted-foreground">{j.nama} • {j.tempat}</p>
            </div>
            <span className="text-[11px] font-semibold text-primary">{j.jam}</span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-2 gap-2">
        <Link to="/satpam/verifikasi" className="bg-gradient-primary gloss-top relative rounded-full py-3 text-center font-heading text-xs font-bold text-primary-foreground shadow-soft active:scale-95">
          Verifikasi Klaim
        </Link>
        <Link to="/satpam/verifikasi" className="rounded-full border border-border bg-card py-3 text-center font-heading text-xs font-bold text-navy active:scale-95">
          Kelola Laporan Barang
        </Link>
      </div>
    </AppShell>
  );
}
