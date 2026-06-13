import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { MASCOT, type Claim } from "@/lib/data";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/slfk/Shell";
import { PageHeader, PrimaryButton, Field, inputClass, SuccessModal } from "@/components/slfk/Modal";
import { PhotoUpload } from "@/components/slfk/FormParts";
import { ItemPhoto } from "@/components/slfk/Primitives";

export const Route = createFileRoute("/klaim/$id")({
  component: ClaimForm,
});

function ClaimForm() {
  const { id } = useParams({ from: "/klaim/$id" });
  const navigate = useNavigate();
  const { reports, user, addClaim } = useApp();
  const report = reports.find((r) => r.id === id) ?? reports.find((r) => r.matchId === id);
  const [success, setSuccess] = useState(false);

  const [f, setF] = useState({
    nama: user?.nama ?? "",
    nim: user?.identitas ?? "",
    email: user?.email ?? "",
    hp: user?.hp ?? "",
    bukti: "",
    ciri: "",
    foto: null as string | null,
    tanggal: "",
    jam: "",
    setuju: false,
  });

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((p) => ({ ...p, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.setuju) return;
    const claim: Claim = {
      id: `KLM-${String(Math.floor(Math.random() * 900) + 100)}`,
      reportId: report?.id ?? id,
      namaPengklaim: f.nama,
      nim: f.nim,
      email: f.email,
      hp: f.hp,
      bukti: f.bukti,
      ciri: f.ciri,
      status: "Menunggu",
      itemNama: report?.nama ?? "Barang",
      foto: report?.foto ?? MASCOT.verify,
    };
    addClaim(claim);
    setSuccess(true);
  }

  return (
    <AppShell>
      <PageHeader title="Pengajuan Klaim" subtitle="Lengkapi data klaim barang" back="/beranda" />

      {/* Summary */}
      {report && (
        <div className="mb-4 flex gap-3 rounded-3xl border border-border bg-card p-3 shadow-soft">
          <ItemPhoto src={report.foto} alt={report.nama} rounded="rounded-2xl" className="h-20 w-20 shrink-0" />
          <div className="min-w-0">
            <h2 className="truncate font-heading text-sm font-bold text-navy">{report.nama}</h2>
            <p className="text-[11px] text-muted-foreground">{report.id}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Ditemukan: {report.lokasi}</p>
            <p className="text-[11px] text-muted-foreground">Penyimpanan: {report.penyimpanan ?? "-"}</p>
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center gap-3 rounded-3xl bg-gradient-soft p-3">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-card p-1 shadow-soft">
          <img src={MASCOT.verify} alt="PINO" className="h-full w-full object-contain" />
        </div>
        <p className="text-xs text-muted-foreground">
          Isi bukti kepemilikan sejelas mungkin. Petugas akan memverifikasi sebelum barang diserahkan.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-3.5">
        <Field label="Nama pengklaim">
          <input className={inputClass} value={f.nama} onChange={(e) => set("nama", e.target.value)} required />
        </Field>
        <Field label="NIM">
          <input className={inputClass} value={f.nim} onChange={(e) => set("nim", e.target.value)} required />
        </Field>
        <Field label="Email kampus">
          <input type="email" className={inputClass} value={f.email} onChange={(e) => set("email", e.target.value)} required />
        </Field>
        <Field label="Nomor HP">
          <input className={inputClass} value={f.hp} onChange={(e) => set("hp", e.target.value)} required />
        </Field>
        <Field label="Bukti kepemilikan">
          <textarea className={inputClass + " min-h-20 resize-none"} value={f.bukti} onChange={(e) => set("bukti", e.target.value)} placeholder="Jelaskan bukti bahwa barang ini milikmu." required />
        </Field>
        <Field label="Ciri unik barang">
          <input className={inputClass} value={f.ciri} onChange={(e) => set("ciri", e.target.value)} placeholder="Ciri yang hanya pemilik tahu." required />
        </Field>
        <PhotoUpload value={f.foto} onChange={(v) => set("foto", v)} label="Upload bukti tambahan (opsional)" />
        <div className="grid grid-cols-2 gap-2">
          <Field label="Tanggal pengambilan">
            <input className={inputClass} value={f.tanggal} onChange={(e) => set("tanggal", e.target.value)} placeholder="13 Juni 2026" />
          </Field>
          <Field label="Jam pengambilan">
            <input className={inputClass} value={f.jam} onChange={(e) => set("jam", e.target.value)} placeholder="10.00" />
          </Field>
        </div>

        <label className="flex items-start gap-2 rounded-2xl bg-accent/50 p-3 text-xs font-medium text-navy">
          <input type="checkbox" checked={f.setuju} onChange={(e) => set("setuju", e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border accent-[#3B82F6]" />
          Saya menyatakan informasi yang saya isi benar dan bersedia melakukan verifikasi langsung.
        </label>

        <div className="grid grid-cols-2 gap-2">
          <PrimaryButton type="button" variant="outline" onClick={() => navigate({ to: "/beranda" })}>Batal</PrimaryButton>
          <PrimaryButton type="submit" disabled={!f.setuju}>Ajukan Klaim</PrimaryButton>
        </div>
      </form>

      <SuccessModal
        open={success}
        title="Klaim terkirim!"
        message="Klaim berhasil diajukan. Tunggu verifikasi dari petugas."
        primaryLabel="Ke Beranda"
        onPrimary={() => navigate({ to: "/beranda" })}
        secondaryLabel="Lihat Notifikasi"
        onSecondary={() => navigate({ to: "/notifikasi" })}
      />
    </AppShell>
  );
}
