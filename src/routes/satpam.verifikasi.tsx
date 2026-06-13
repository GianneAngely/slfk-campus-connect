import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Check, X, MessageCircleQuestion } from "lucide-react";
import { MASCOT, type Claim } from "@/lib/data";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/slfk/Shell";
import { PageHeader } from "@/components/slfk/Modal";
import { ItemPhoto } from "@/components/slfk/Primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/satpam/verifikasi")({
  component: VerifikasiPage,
});

const CLAIM_STATUS: Record<Claim["status"], string> = {
  Menunggu: "bg-warning/20 text-warning-foreground",
  Diverifikasi: "bg-success/15 text-success",
  Ditolak: "bg-danger/15 text-danger",
  Klarifikasi: "bg-purple-accent/15 text-purple-accent",
};

const CHECKS = ["Ciri barang sesuai", "Bukti kepemilikan cukup", "Identitas sesuai", "Barang tersedia"];

function VerifikasiPage() {
  const { user, claims, reports, updateClaimStatus } = useApp();
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState("");

  if (typeof window !== "undefined" && (!user || user.role !== "satpam")) {
    navigate({ to: "/login" });
    return null;
  }

  const active = claims.find((c) => c.id === openId);
  const report = active ? reports.find((r) => r.id === active.reportId) : undefined;

  function decide(status: Claim["status"]) {
    if (!active) return;
    updateClaimStatus(active.id, status);
    setOpenId(null);
    setChecks({});
    setNote("");
  }

  return (
    <AppShell>
      <PageHeader title="Verifikasi Klaim" subtitle="Tinjau klaim dari mahasiswa" back="/satpam" />

      <div className="mb-4 flex items-center gap-3 rounded-3xl bg-gradient-soft p-3">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-card p-1 shadow-soft">
          <img src={MASCOT.verify} alt="PINO" className="h-full w-full object-contain" />
        </div>
        <p className="text-xs text-muted-foreground">
          Periksa ciri barang dan bukti kepemilikan sebelum menyetujui klaim.
        </p>
      </div>

      <div className="space-y-3">
        {claims.map((c) => (
          <div key={c.id} className="glass-card rounded-3xl p-3.5">
            <div className="flex gap-3">
              <ItemPhoto src={c.foto} alt={c.itemNama} rounded="rounded-2xl" className="h-16 w-16 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-medium text-muted-foreground">{c.id}</span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold", CLAIM_STATUS[c.status])}>{c.status}</span>
                </div>
                <h3 className="truncate font-heading text-sm font-bold text-navy">{c.itemNama}</h3>
                <p className="text-[11px] text-muted-foreground">Pengklaim: {c.namaPengklaim}</p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">Bukti: {c.bukti}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => { setOpenId(c.id); setChecks({}); setNote(""); }} className="col-span-2 flex items-center justify-center gap-1.5 rounded-full bg-accent py-2 text-xs font-bold text-primary active:scale-95">
                <Eye size={14} /> Lihat Detail
              </button>
              <button onClick={() => updateClaimStatus(c.id, "Diverifikasi")} className="flex items-center justify-center gap-1 rounded-full bg-gradient-success py-2 text-xs font-bold text-success-foreground active:scale-95">
                <Check size={13} /> Verifikasi
              </button>
              <button onClick={() => updateClaimStatus(c.id, "Ditolak")} className="flex items-center justify-center gap-1 rounded-full bg-danger/10 py-2 text-xs font-bold text-danger active:scale-95">
                <X size={13} /> Tolak
              </button>
              <button onClick={() => updateClaimStatus(c.id, "Klarifikasi")} className="col-span-2 flex items-center justify-center gap-1 rounded-full border border-border py-2 text-xs font-semibold text-navy active:scale-95">
                <MessageCircleQuestion size={13} /> Minta Klarifikasi
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 backdrop-blur-sm">
          <div className="animate-pop max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-[2rem] bg-background p-5">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />
            <div className="flex gap-3">
              <ItemPhoto src={active.foto} alt={active.itemNama} rounded="rounded-2xl" className="h-20 w-20 shrink-0" />
              <div>
                <h2 className="font-heading text-base font-extrabold text-navy">{active.itemNama}</h2>
                <p className="text-[11px] text-muted-foreground">{active.id} • {report?.id ?? "-"}</p>
                <p className="text-[11px] text-muted-foreground">Penyimpanan: {report?.penyimpanan ?? "-"}</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-card p-3">
              <h3 className="mb-1 font-heading text-sm font-bold text-navy">Data Pengklaim</h3>
              <p className="text-xs text-muted-foreground">Nama: <span className="font-semibold text-navy">{active.namaPengklaim}</span></p>
              <p className="text-xs text-muted-foreground">NIM: <span className="font-semibold text-navy">{active.nim}</span></p>
              <p className="text-xs text-muted-foreground">Email: <span className="font-semibold text-navy">{active.email}</span></p>
              <p className="text-xs text-muted-foreground">HP: <span className="font-semibold text-navy">{active.hp}</span></p>
            </div>

            <div className="mt-3 rounded-2xl border border-border bg-card p-3">
              <h3 className="mb-1 font-heading text-sm font-bold text-navy">Bukti Kepemilikan</h3>
              <p className="text-xs text-muted-foreground">{active.bukti}</p>
              <p className="mt-1 text-xs text-muted-foreground">Ciri unik: {active.ciri}</p>
            </div>

            <div className="mt-3 rounded-2xl border border-border bg-card p-3">
              <h3 className="mb-2 font-heading text-sm font-bold text-navy">Checklist Verifikasi</h3>
              <div className="space-y-2">
                {CHECKS.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-xs font-medium text-navy">
                    <input type="checkbox" checked={!!checks[c]} onChange={(e) => setChecks((p) => ({ ...p, [c]: e.target.checked }))} className="h-4 w-4 rounded border-border accent-[#3B82F6]" />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <span className="mb-1.5 block text-xs font-semibold text-navy">Catatan petugas</span>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Tambahkan catatan keputusan." />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setOpenId(null)} className="rounded-full border border-border bg-card py-3 text-sm font-semibold text-navy active:scale-95">Tutup</button>
              <button onClick={() => decide("Diverifikasi")} className="bg-gradient-primary gloss-top relative rounded-full py-3 font-heading text-sm font-bold text-primary-foreground shadow-soft active:scale-95">Simpan Keputusan</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
