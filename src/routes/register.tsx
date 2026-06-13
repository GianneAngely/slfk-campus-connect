import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MASCOT } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Field, inputClass, PrimaryButton, SuccessModal } from "@/components/slfk/Modal";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useApp();
  const [form, setForm] = useState({
    nama: "",
    identitas: "",
    prodiJabatan: "",
    email: "",
    hp: "",
    password: "",
    konfirmasi: "",
  });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.konfirmasi) {
      setError("Kata sandi dan konfirmasi tidak sama.");
      return;
    }
    if (!agree) {
      setError("Harap setujui ketentuan terlebih dahulu.");
      return;
    }
    register({
      nama: form.nama,
      identitas: form.identitas,
      prodiJabatan: form.prodiJabatan,
      email: form.email,
      hp: form.hp,
      password: form.password,
      role: "mahasiswa",
    });
    setSuccess(true);
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background px-6 pb-12 pt-10">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-16 w-16 shrink-0 rounded-3xl bg-card p-1.5 shadow-card">
          <img src={MASCOT.guide} alt="PINO" className="h-full w-full object-contain" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-black text-navy">Buat Akun SLFK</h1>
          <p className="text-xs text-muted-foreground">Sistem Lost and Found kampus</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-3.5">
        <Field label="Nama lengkap">
          <input className={inputClass} value={form.nama} onChange={(e) => set("nama", e.target.value)} placeholder="Nama lengkap" required />
        </Field>
        <Field label="NIM / ID pengguna">
          <input className={inputClass} value={form.identitas} onChange={(e) => set("identitas", e.target.value)} placeholder="230101002" required />
        </Field>
        <Field label="Program studi / jabatan">
          <input className={inputClass} value={form.prodiJabatan} onChange={(e) => set("prodiJabatan", e.target.value)} placeholder="Teknik Informatika" required />
        </Field>
        <Field label="Email kampus">
          <input type="email" className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="nama@kampus.id" required />
        </Field>
        <Field label="Nomor HP">
          <input className={inputClass} value={form.hp} onChange={(e) => set("hp", e.target.value)} placeholder="08xxxxxxxxxx" required />
        </Field>
        <Field label="Kata sandi">
          <input type="password" className={inputClass} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Minimal 8 karakter" required />
        </Field>
        <Field label="Konfirmasi kata sandi">
          <input type="password" className={inputClass} value={form.konfirmasi} onChange={(e) => set("konfirmasi", e.target.value)} placeholder="Ulangi kata sandi" required />
        </Field>

        <label className="flex items-start gap-2 pt-1 text-xs font-medium text-navy">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border accent-[#3B82F6]" />
          Saya menyetujui ketentuan penggunaan dan kebijakan SLFK.
        </label>

        {error && (
          <p className="rounded-2xl bg-danger/10 px-3 py-2 text-xs font-medium text-danger">{error}</p>
        )}

        <PrimaryButton type="submit" className="mt-2">Daftar</PrimaryButton>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link to="/login" className="font-semibold text-primary">Masuk</Link>
      </p>

      <SuccessModal
        open={success}
        title="Akun berhasil dibuat."
        message="Silakan masuk menggunakan akun yang baru kamu buat."
        primaryLabel="Ke Halaman Masuk"
        onPrimary={() => navigate({ to: "/login" })}
      />
    </div>
  );
}
