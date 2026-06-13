import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { KATEGORI, MASCOT, type ItemReport } from "@/lib/data";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/slfk/Shell";
import { PageHeader, PrimaryButton, Field, inputClass, SuccessModal } from "@/components/slfk/Modal";
import { Stepper, PhotoUpload, SummaryRow } from "@/components/slfk/FormParts";
import { ItemPhoto } from "@/components/slfk/Primitives";

export const Route = createFileRoute("/lapor/hilang")({
  component: LostForm,
});

const STEPS = ["Detail Barang", "Foto & Waktu", "Review & Kirim"];

function LostForm() {
  const navigate = useNavigate();
  const { user, addReport } = useApp();
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [f, setF] = useState({
    nama: "",
    kategori: KATEGORI[0],
    subkategori: "",
    warna: "",
    ciri: "",
    deskripsi: "",
    foto: null as string | null,
    lokasi: "",
    tanggal: "",
    jam: "",
    kontak: user?.hp ?? "",
  });

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((p) => ({ ...p, [k]: v }));
  }

  function submit(draft = false) {
    const id = `LH-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    const report: ItemReport = {
      id,
      type: "hilang",
      nama: f.nama || "Barang Hilang",
      kategori: f.kategori,
      subkategori: f.subkategori,
      warna: f.warna,
      lokasi: f.lokasi,
      tanggal: f.tanggal || "Hari ini",
      jam: f.jam,
      status: draft ? "Aktif" : "Aktif",
      pelapor: user?.nama ?? "Mahasiswa",
      kontak: f.kontak,
      deskripsi: f.deskripsi,
      ciri: f.ciri,
      foto: f.foto || MASCOT.confusedEarbuds,
    };
    addReport(report);
    setSuccess(true);
  }

  return (
    <AppShell>
      <PageHeader title="Laporan Barang Hilang" subtitle={STEPS[step]} back="/lapor" />

      <div className="mb-4 flex items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-soft">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-soft p-1">
          <img src={MASCOT.confusedEarbuds} alt="PINO" className="h-full w-full object-contain" />
        </div>
        <p className="text-xs text-muted-foreground">
          Isi data selengkap mungkin agar PINO bisa membantu mencocokkan barangmu.
        </p>
      </div>

      <Stepper steps={STEPS} current={step} />

      {step === 0 && (
        <div className="space-y-3.5">
          <Field label="Nama barang">
            <input className={inputClass} value={f.nama} onChange={(e) => set("nama", e.target.value)} placeholder="Contoh: Tumbler Biru Stainless" />
          </Field>
          <Field label="Kategori">
            <select className={inputClass} value={f.kategori} onChange={(e) => set("kategori", e.target.value)}>
              {KATEGORI.map((k) => <option key={k}>{k}</option>)}
            </select>
          </Field>
          <Field label="Subkategori">
            <input className={inputClass} value={f.subkategori} onChange={(e) => set("subkategori", e.target.value)} placeholder="Contoh: Tumbler" />
          </Field>
          <Field label="Warna utama">
            <input className={inputClass} value={f.warna} onChange={(e) => set("warna", e.target.value)} placeholder="Contoh: Biru" />
          </Field>
          <Field label="Ciri khusus">
            <input className={inputClass} value={f.ciri} onChange={(e) => set("ciri", e.target.value)} placeholder="Stiker, goresan, gantungan, dll." />
          </Field>
          <Field label="Deskripsi barang">
            <textarea className={inputClass + " min-h-24 resize-none"} value={f.deskripsi} onChange={(e) => set("deskripsi", e.target.value)} placeholder="Jelaskan detail barang yang hilang." />
          </Field>
          <PrimaryButton onClick={() => setStep(1)}>Lanjut</PrimaryButton>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3.5">
          <PhotoUpload value={f.foto} onChange={(v) => set("foto", v)} />
          <Field label="Lokasi hilang">
            <input className={inputClass} value={f.lokasi} onChange={(e) => set("lokasi", e.target.value)} placeholder="Contoh: Perpustakaan Lantai 1" />
          </Field>
          <Field label="Tanggal hilang">
            <input className={inputClass} value={f.tanggal} onChange={(e) => set("tanggal", e.target.value)} placeholder="Contoh: 12 Juni 2026" />
          </Field>
          <Field label="Jam perkiraan">
            <input className={inputClass} value={f.jam} onChange={(e) => set("jam", e.target.value)} placeholder="Contoh: 13.20" />
          </Field>
          <Field label="Kontak yang bisa dihubungi">
            <input className={inputClass} value={f.kontak} onChange={(e) => set("kontak", e.target.value)} placeholder="08xxxxxxxxxx" />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <PrimaryButton variant="outline" onClick={() => setStep(0)}>Kembali</PrimaryButton>
            <PrimaryButton onClick={() => setStep(2)}>Lanjut</PrimaryButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
            {f.foto ? (
              <img src={f.foto} alt="Barang" className="h-44 w-full object-cover" />
            ) : (
              <ItemPhoto src="" alt="Barang" rounded="rounded-none" className="h-44 w-full" />
            )}
          </div>
          <div className="rounded-3xl border border-border bg-card p-4 shadow-soft">
            <SummaryRow label="Nama barang" value={f.nama} />
            <SummaryRow label="Kategori" value={f.kategori} />
            <SummaryRow label="Warna" value={f.warna} />
            <SummaryRow label="Lokasi" value={f.lokasi} />
            <SummaryRow label="Tanggal" value={f.tanggal} />
            <SummaryRow label="Kontak" value={f.kontak} />
            <SummaryRow label="Ciri khusus" value={f.ciri} />
            <SummaryRow label="Deskripsi" value={f.deskripsi} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <PrimaryButton variant="outline" onClick={() => submit(true)}>Simpan Draft</PrimaryButton>
            <PrimaryButton onClick={() => submit(false)}>Kirim Laporan</PrimaryButton>
          </div>
        </div>
      )}

      <SuccessModal
        open={success}
        title="Laporan terkirim!"
        message="Laporan barang hilang berhasil dikirim."
        primaryLabel="Ke Beranda"
        onPrimary={() => navigate({ to: "/beranda" })}
        secondaryLabel="Lihat Notifikasi"
        onSecondary={() => navigate({ to: "/notifikasi" })}
      />
    </AppShell>
  );
}
