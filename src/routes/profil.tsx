import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, IdCard, Pencil, LogOut, Briefcase } from "lucide-react";
import { MASCOT } from "@/lib/data";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/slfk/Shell";
import { Field, inputClass } from "@/components/slfk/Modal";

export const Route = createFileRoute("/profil")({
  component: ProfilPage,
});

const ROLE_LABEL = { mahasiswa: "Mahasiswa", satpam: "Satpam", admin: "Admin" } as const;
const ROLE_MASCOT = { mahasiswa: MASCOT.happyKey, satpam: MASCOT.verify, admin: MASCOT.guide } as const;

function ProfilPage() {
  const { user, reports, claims, logout } = useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  if (typeof window !== "undefined" && !user) {
    navigate({ to: "/login" });
    return null;
  }
  if (!user) return null;

  let stats: { label: string; value: number }[] = [];
  if (user.role === "mahasiswa") {
    stats = [
      { label: "Total laporan", value: reports.filter((r) => r.type === "hilang").length },
      { label: "Klaim aktif", value: claims.filter((c) => c.status === "Menunggu" || c.status === "Klarifikasi").length },
      { label: "Barang kembali", value: reports.filter((r) => r.status === "Diklaim" || r.status === "Selesai").length },
    ];
  } else if (user.role === "satpam") {
    stats = [
      { label: "Klaim diverifikasi", value: claims.filter((c) => c.status === "Diverifikasi").length },
      { label: "Barang temuan dikelola", value: reports.filter((r) => r.type === "temuan").length },
    ];
  } else {
    stats = [
      { label: "Laporan dikelola", value: reports.length },
      { label: "Status diubah", value: reports.filter((r) => r.status !== "Aktif").length },
    ];
  }

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="bg-gradient-primary gloss-top relative mb-5 overflow-hidden rounded-[2rem] p-5 text-center shadow-glow">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-md" />
        <div className="mx-auto mb-2 h-24 w-24 rounded-3xl bg-white/90 p-1.5 shadow">
          <img src={ROLE_MASCOT[user.role]} alt="PINO" className="h-full w-full object-contain" />
        </div>
        <h1 className="font-heading text-xl font-extrabold text-white">{user.nama}</h1>
        <span className="mt-1 inline-block rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold text-white ring-1 ring-white/40">
          {ROLE_LABEL[user.role]}
        </span>
      </div>

      {/* Info */}
      {!editing ? (
        <div className="mb-5 rounded-3xl border border-border bg-card p-4 shadow-soft">
          {[
            { icon: Mail, label: "Email", value: user.email },
            { icon: Phone, label: "Nomor HP", value: user.hp },
            { icon: IdCard, label: user.identitasLabel, value: user.identitas },
            { icon: Briefcase, label: "Program studi / jabatan", value: user.prodiJabatan },
          ].map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="flex items-center gap-3 border-b border-border/60 py-2.5 last:border-0">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-[11px] text-muted-foreground">{row.label}</p>
                  <p className="text-sm font-semibold text-navy">{row.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-5 space-y-3 rounded-3xl border border-border bg-card p-4 shadow-soft">
          <Field label="Nama"><input className={inputClass} defaultValue={user.nama} /></Field>
          <Field label="Email"><input className={inputClass} defaultValue={user.email} /></Field>
          <Field label="Nomor HP"><input className={inputClass} defaultValue={user.hp} /></Field>
          <button onClick={() => setEditing(false)} className="bg-gradient-primary gloss-top relative w-full rounded-full py-3 font-heading text-sm font-bold text-primary-foreground shadow-soft active:scale-95">
            Simpan Perubahan
          </button>
        </div>
      )}

      {/* Stats */}
      <h2 className="mb-3 font-heading text-base font-extrabold text-navy">Statistik</h2>
      <div className={`mb-5 grid gap-3 ${stats.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {stats.map((s) => (
          <div key={s.label} className="bg-gradient-soft rounded-3xl border border-border p-3 text-center">
            <p className="font-heading text-2xl font-black text-navy">{s.value}</p>
            <p className="text-[10px] font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="space-y-2.5">
        <button onClick={() => setEditing((e) => !e)} className="glass-card flex w-full items-center gap-3 rounded-3xl p-4 active:scale-[0.99]">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-primary">
            <Pencil size={17} />
          </span>
          <span className="flex-1 text-left font-heading text-sm font-bold text-navy">Edit Profil</span>
        </button>
        <button onClick={handleLogout} className="glass-card flex w-full items-center gap-3 rounded-3xl p-4 active:scale-[0.99]">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <LogOut size={17} />
          </span>
          <span className="flex-1 text-left font-heading text-sm font-bold text-danger">Keluar</span>
        </button>
      </div>
    </AppShell>
  );
}
