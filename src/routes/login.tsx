import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, GraduationCap, Shield, UserCog } from "lucide-react";
import { MASCOT, type Role } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Field, inputClass, PrimaryButton } from "@/components/slfk/Modal";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const ROLE_CHIPS: { role: Role; label: string; email: string; icon: typeof Shield }[] = [
  { role: "mahasiswa", label: "Mahasiswa", email: "nara@kampus.id", icon: GraduationCap },
  { role: "satpam", label: "Satpam", email: "satpam@kampus.id", icon: Shield },
  { role: "admin", label: "Admin", email: "admin@kampus.id", icon: UserCog },
];

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [activeChip, setActiveChip] = useState<Role | null>(null);

  function fill(role: Role) {
    const chip = ROLE_CHIPS.find((c) => c.role === role)!;
    setEmail(chip.email);
    setPassword("12345678");
    setActiveChip(role);
    setError("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const u = login(email.trim(), password);
    if (!u) {
      setError("Email atau kata sandi salah. Coba pilih chip Akun Akses di bawah.");
      return;
    }
    const dest = u.role === "satpam" ? "/satpam" : u.role === "admin" ? "/admin" : "/beranda";
    navigate({ to: dest });
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      {/* gradient hero */}
      <div className="bg-gradient-primary gloss-top relative overflow-hidden rounded-b-[2.5rem] px-6 pb-10 pt-12 text-center">
        <div className="absolute -right-6 top-6 h-24 w-24 rounded-full bg-white/10 blur-lg" />
        <div className="mx-auto mb-3 h-20 w-20 rounded-3xl bg-white/90 p-1.5 shadow-glow">
          <img src={MASCOT.face} alt="PINO" className="h-full w-full rounded-2xl object-cover" />
        </div>
        <h1 className="font-heading text-3xl font-black text-white">SLFK</h1>
        <p className="text-sm font-medium text-white/85">Sistem Lost and Found</p>
      </div>

      <div className="px-6 pb-12 pt-6">
        <h2 className="font-heading text-xl font-extrabold text-navy">Selamat datang kembali</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Masuk untuk melanjutkan laporan barang hilang dan temuan.
        </p>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <Field label="Email kampus">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@kampus.id"
                className={inputClass + " pl-10"}
                required
              />
            </div>
          </Field>

          <Field label="Kata sandi">
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass + " px-10"}
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          {error && (
            <p className="rounded-2xl bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-medium text-navy">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-[#3B82F6]"
              />
              Ingat saya
            </label>
            <button type="button" className="text-xs font-semibold text-primary">
              Lupa kata sandi?
            </button>
          </div>

          <PrimaryButton type="submit">Masuk</PrimaryButton>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link to="/register" className="font-semibold text-primary">
            Daftar akun
          </Link>
        </p>

        {/* Role chips */}
        <div className="mt-7 rounded-3xl border border-border bg-card p-4 shadow-soft">
          <p className="font-heading text-sm font-bold text-navy">Akun Akses</p>
          <div className="grid grid-cols-3 gap-2">
            {ROLE_CHIPS.map((chip) => {
              const Icon = chip.icon;
              const active = activeChip === chip.role;
              return (
                <button
                  key={chip.role}
                  type="button"
                  onClick={() => fill(chip.role)}
                  className={
                    "flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-xs font-semibold transition-all active:scale-95 " +
                    (active
                      ? "border-primary bg-accent text-primary shadow-soft"
                      : "border-border bg-background text-navy")
                  }
                >
                  <Icon size={18} />
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
