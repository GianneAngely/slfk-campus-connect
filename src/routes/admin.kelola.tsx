import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Eye, Pencil } from "lucide-react";
import { useApp } from "@/lib/store";
import { type ReportStatus } from "@/lib/data";
import { AppShell } from "@/components/slfk/Shell";
import { PageHeader } from "@/components/slfk/Modal";
import { ItemPhoto, StatusBadge } from "@/components/slfk/Primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/kelola")({
  component: KelolaPage,
});

const STATUSES: ReportStatus[] = ["Aktif", "Cocok", "Menunggu Verifikasi", "Diklaim", "Selesai"];

function KelolaPage() {
  const { user, reports, updateReportStatus } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<"semua" | "hilang" | "temuan">("semua");
  const [statusFilter, setStatusFilter] = useState<"Semua" | ReportStatus>("Semua");
  const [editId, setEditId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>("Aktif");
  const [note, setNote] = useState("");

  if (typeof window !== "undefined" && (!user || user.role !== "admin")) {
    navigate({ to: "/login" });
    return null;
  }

  const filtered = reports.filter((r) => {
    if (typeFilter !== "semua" && r.type !== typeFilter) return false;
    if (statusFilter !== "Semua" && r.status !== statusFilter) return false;
    if (q && !`${r.nama} ${r.id} ${r.pelapor}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const editing = reports.find((r) => r.id === editId);

  function save() {
    if (editing) updateReportStatus(editing.id, newStatus);
    setEditId(null);
    setNote("");
  }

  return (
    <AppShell>
      <PageHeader title="Kelola Laporan Barang" subtitle="Cari, filter, dan ubah status" back="/admin" />

      {/* Search */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama barang, ID, atau pelapor"
          className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Type filter */}
      <div className="mb-2 flex gap-2">
        {([
          { k: "semua", l: "Semua" },
          { k: "hilang", l: "Barang Hilang" },
          { k: "temuan", l: "Barang Temuan" },
        ] as const).map((t) => (
          <button
            key={t.k}
            onClick={() => setTypeFilter(t.k)}
            className={cn(
              "flex-1 rounded-full py-2 text-xs font-bold transition-all",
              typeFilter === t.k ? "bg-gradient-primary text-primary-foreground shadow-soft" : "border border-border bg-card text-muted-foreground",
            )}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {(["Semua", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
              statusFilter === s ? "border-primary bg-accent text-primary" : "border-border bg-card text-muted-foreground",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">Tidak ada laporan yang cocok.</p>
        )}
        {filtered.map((r) => (
          <div key={r.id} className="glass-card rounded-3xl p-3.5">
            <div className="flex gap-3">
              <ItemPhoto src={r.foto} alt={r.nama} rounded="rounded-2xl" className="h-16 w-16 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-medium text-muted-foreground">{r.id}</span>
                  <StatusBadge status={r.status} />
                </div>
                <h3 className="truncate font-heading text-sm font-bold text-navy">{r.nama}</h3>
                <p className="text-[11px] text-muted-foreground">
                  {r.type === "hilang" ? "Hilang" : "Temuan"} • {r.pelapor}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">{r.lokasi} • {r.tanggal}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link to="/detail/$id" params={{ id: r.id }} className="flex items-center justify-center gap-1.5 rounded-full bg-accent py-2 text-xs font-bold text-primary active:scale-95">
                <Eye size={14} /> Detail
              </Link>
              <button onClick={() => { setEditId(r.id); setNewStatus(r.status); }} className="flex items-center justify-center gap-1.5 rounded-full border border-border py-2 text-xs font-semibold text-navy active:scale-95">
                <Pencil size={13} /> Ubah Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Change status modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-6 backdrop-blur-sm">
          <div className="animate-pop w-full max-w-sm rounded-3xl bg-card p-5 shadow-glow">
            <h3 className="font-heading text-base font-extrabold text-navy">Ubah Status</h3>
            <p className="mb-3 text-xs text-muted-foreground">{editing.nama} • {editing.id}</p>
            <span className="mb-1.5 block text-xs font-semibold text-navy">Status</span>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as ReportStatus)} className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <span className="mb-1.5 mt-3 block text-xs font-semibold text-navy">Catatan admin</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Catatan perubahan status." />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setEditId(null)} className="rounded-full border border-border bg-card py-3 text-sm font-semibold text-navy active:scale-95">Batal</button>
              <button onClick={save} className="bg-gradient-primary gloss-top relative rounded-full py-3 font-heading text-sm font-bold text-primary-foreground shadow-soft active:scale-95">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
