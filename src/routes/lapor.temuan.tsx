import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { KATEGORI, MASCOT, PENYIMPANAN, type ItemReport } from "@/lib/data";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/slfk/Shell";
import { PageHeader, PrimaryButton, Field, inputClass, SuccessModal } from "@/components/slfk/Modal";
import { Stepper, PhotoUpload, SummaryRow } from "@/components/slfk/FormParts";
import { ItemPhoto } from "@/components/slfk/Primitives";

export const Route = createFileRoute("/lapor/temuan")({
  component: FoundForm,
});

const STEPS = ["Detail Barang", "Foto & Penyimpanan", "Review & Kirim"];

function FoundForm() {
  const navigate = useNavigate();
  const { user, addReport } = useApp();
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [f, setF] = useState({
    nama: "",
    kategori: KATEGORI[0],
    subkategori: "",
    warna: "",
    kondisi: "Baik",
    ciri: "",
    foto: null as string | null,
    lokasi: "",
    tanggal: "",
    jam: "",
    penyimpanan: PENYIMPANAN[0],
    catatan: "",
  });

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((p) => ({ ...p, [k]: v }));
  }

  function submit() {
    const id = `LT-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    const report: ItemReport = {
      id,
      type: "temuan",
      nama: f.nama || "Barang Temuan",
      kategori: f.kategori,
      subkategori: f.subkategori,
      warna: f.warna,
      lokasi: f.lokasi,
      tanggal: f.tanggal || "Hari ini",
      jam: f.jam,
      status: "Aktif",
      pelapor: user?.nama ?? "Mahasiswa",
      kondisi: f.kondisi,
      penyimpanan: f.penyimpanan,
      deskripsi: f.catatan,
      ciri: f.ciri,
      foto: f.foto || MASCOT.foundPhoneKey,
    };
    addReport(report);
    setSuccess(true);
  }

  return (
    <AppShell>
      <PageHeader title="Laporan Barang Temuan" subtitle={STEPS[step]} back="/lapor" />

      <div className="mb-4 flex items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-soft">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-soft p-1">
          <img src={MASCOT.foundPhoneKey} alt="PINO" className="h-full w-full object-contain" />
        </div>
        <p className="text-xs text-muted-foreground">
          Terima kasih sudah menemukan barang. Lengkapi data agar pemiliknya cepat ditemukan.
        </p>
      </div>

      <Stepper steps={STEPS} current={step} />

      {step === 0 && (
        <div className="space-y-3.5">
          <Field label="Nama / jenis barang">
            <input className={inputClass} value={f.nama} onChange={(e) => set("nama", e.target.value)} placeholder="Contoh: Dompet Hitam Kulit" />
          </Field>
          <Field label="Kategori">
            <select className={inputClass} value={f.kategori} onChange={(e) => set("kategori", e.target.value)}>
              {KATEGORI.map((k) => <option key={k}>{k}</option>)}
            </select>
          </Field>
          <Field label="Subkategori">
            <input className={inputClass} value={f.subkategori} onChange={(e) => set("subkategori", e.target.value)} placeholder="Contoh: Dompet" />
          </Field>
          <Field label="Warna utama">
            <input className={inputClass} value={f.warna} onChange={(e) => set("warna", e.target.value)} placeholder="Contoh: Hitam" />
          </Field>
          <Field label="Kondisi barang">
            <select className={inputClass} value={f.kondisi} onChange={(e) => set("kondisi", e.target.value)}>
              <option>Baik</option>
              <option>Lecet ringan</option>
              <option>Rusak</option>
            </select>
          </Field>
          <Field label="Ciri khusus">
            <input className={inputClass} value={f.ciri} onChange={(e) => set("ciri", e.target.value)} placeholder="Stiker, jahitan, inisial, dll." />
          </Field>
          <PrimaryButton onClick={() => setStep(1)}>Lanjut</PrimaryButton>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3.5">
          <PhotoUpload value={f.foto} onChange={(v) => set("foto", v)} />
          <Field label="Lokasi ditemukan">
            <input className={inputClass} value={f.lokasi} onChange={(e) => set("lokasi", e.target.value)} placeholder="Contoh: Kantin Utama" />
          </Field>
          <Field label="Tanggal ditemukan">
            <input className={inputClass} value={f.tanggal} onChange={(e) => set("tanggal", e.target.value)} placeholder="Contoh: 11 Juni 2026" />
          </Field>
          <Field label="Jam ditemukan">
            <input className={inputClass} value={f.jam} onChange={(e) => set("jam", e.target.value)} placeholder="Contoh: 12.30" />
          </Field>
          <Field label="Tempat penyimpanan">
            <select className={inputClass} value={f.penyimpanan} onChange={(e) => set("penyimpanan", e.target.value)}>
              {PENYIMPANAN.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Catatan tambahan">
            <textarea className={inputClass + " min-h-20 resize-none"} value={f.catatan} onChange={(e) => set("catatan", e.target.value)} placeholder="Catatan untuk petugas (opsional)." />
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
            <SummaryRow label="Kondisi" value={f.kondisi} />
            <SummaryRow label="Lokasi ditemukan" value={f.lokasi} />
            <SummaryRow label="Tanggal" value={f.tanggal} />
            <SummaryRow label="Penyimpanan" value={f.penyimpanan} />
            <SummaryRow label="Ciri khusus" value={f.ciri} />
            <SummaryRow label="Catatan" value={f.catatan} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <PrimaryButton variant="outline" onClick={() => setStep(1)}>Kembali</PrimaryButton>
            <PrimaryButton variant="success" onClick={submit}>Kirim Laporan</PrimaryButton>
          </div>
        </div>
      )}

      <SuccessModal
        open={success}
        title="Laporan terkirim!"
        message="Laporan barang temuan berhasil dikirim."
        primaryLabel="Ke Beranda"
        onPrimary={() => navigate({ to: "/beranda" })}
      />
    </AppShell>
  );
}
