import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, PackageCheck, Sparkles } from "lucide-react";
import { MASCOT } from "@/lib/data";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/slfk/Shell";

export const Route = createFileRoute("/lapor/")({
  component: LaporChooser,
});

function LaporChooser() {
  const { user } = useApp();
  const navigate = useNavigate();
  if (typeof window !== "undefined" && (!user || user.role !== "mahasiswa")) {
    navigate({ to: "/login" });
    return null;
  }

  return (
    <AppShell>
      <h1 className="font-heading text-xl font-extrabold text-navy">Buat Laporan</h1>
      <p className="mb-5 text-xs text-muted-foreground">
        Pilih jenis laporan yang ingin kamu buat.
      </p>

      <div className="space-y-4">
        <Link
          to="/lapor/hilang"
          className="bg-gradient-primary gloss-top relative flex items-center gap-4 overflow-hidden rounded-[2rem] p-5 shadow-glow active:scale-[0.99]"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-md" />
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-white/40">
            <Search size={26} />
          </span>
          <div className="flex-1">
            <h2 className="font-heading text-base font-extrabold text-white">Laporan Barang Hilang</h2>
            <p className="text-xs text-white/85">Laporkan barang yang kamu hilangkan.</p>
          </div>
          <img src={MASCOT.confusedEarbuds} alt="PINO" className="h-16 w-16 object-contain" />
        </Link>

        <Link
          to="/lapor/temuan"
          className="bg-gradient-success gloss-top relative flex items-center gap-4 overflow-hidden rounded-[2rem] p-5 shadow-glow active:scale-[0.99]"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-md" />
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-white/40">
            <PackageCheck size={26} />
          </span>
          <div className="flex-1">
            <h2 className="font-heading text-base font-extrabold text-white">Laporan Barang Temuan</h2>
            <p className="text-xs text-white/90">Serahkan barang yang kamu temukan.</p>
          </div>
          <img src={MASCOT.foundPhoneKey} alt="PINO" className="h-16 w-16 object-contain" />
        </Link>
      </div>

      {/* Tips section so bottom area isn't empty */}
      <div className="bg-gradient-soft mt-6 rounded-3xl border border-border p-4">
        <p className="flex items-center gap-1 font-heading text-sm font-bold text-navy">
          <Sparkles size={14} className="text-purple-accent" /> Tips dari PINO
        </p>
        <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
          <li className="flex gap-2"><span className="text-primary">•</span> Sebutkan warna, merek, dan ukuran barang dengan jelas.</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Tambahkan ciri unik seperti stiker, goresan, atau gantungan.</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Lampirkan foto sebagai bukti visual agar kecocokan lebih akurat.</li>
          <li className="flex gap-2"><span className="text-primary">•</span> Isi lokasi dan waktu sedekat mungkin dengan kejadian.</li>
        </ul>
      </div>
    </AppShell>
  );
}
