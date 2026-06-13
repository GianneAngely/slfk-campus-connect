import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Check, ChevronRight, Sparkles, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { MASCOT, type AppNotification } from "@/lib/data";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/slfk/Shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifikasi")({
  component: NotifPage,
});

const STATUS_STYLE: Record<AppNotification["status"], { icon: typeof Bell; cls: string }> = {
  Baru: { icon: Sparkles, cls: "bg-gradient-primary text-white" },
  Sedang: { icon: AlertCircle, cls: "bg-gradient-purple text-white" },
  Proses: { icon: Clock, cls: "bg-warning text-warning-foreground" },
  Aktif: { icon: Bell, cls: "bg-secondary text-white" },
  Selesai: { icon: CheckCircle2, cls: "bg-gradient-success text-white" },
};

function NotifPage() {
  const { user, notifications, markNotificationRead } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"semua" | "belum" | "sudah">("semua");

  if (typeof window !== "undefined" && (!user || user.role !== "mahasiswa")) {
    navigate({ to: "/login" });
    return null;
  }

  const filtered = notifications.filter((n) =>
    tab === "belum" ? !n.read : tab === "sudah" ? n.read : true,
  );

  const tabs = [
    { key: "semua", label: "Semua" },
    { key: "belum", label: "Belum Dibaca" },
    { key: "sudah", label: "Sudah Dibaca" },
  ] as const;

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-16 w-16 shrink-0 rounded-3xl bg-card p-1.5 shadow-card">
          <img src={MASCOT.notification} alt="PINO" className="h-full w-full object-contain" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-extrabold text-navy">Notifikasi</h1>
          <p className="text-xs text-muted-foreground">Kabar terbaru tentang laporanmu.</p>
        </div>
      </div>

      <div className="mb-4 flex gap-2 rounded-full border border-border bg-card p-1 shadow-soft">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 rounded-full py-2 text-xs font-bold transition-all",
              tab === t.key ? "bg-gradient-primary text-primary-foreground shadow-soft" : "text-muted-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <div className="mx-auto mb-2 h-20 w-20">
              <img src={MASCOT.confusedEarbuds} alt="PINO" className="h-full w-full object-contain" />
            </div>
            <p className="text-sm text-muted-foreground">Belum ada notifikasi di sini.</p>
          </div>
        )}
        {filtered.map((n) => {
          const meta = STATUS_STYLE[n.status];
          const Icon = meta.icon;
          return (
            <div key={n.id} className={cn("glass-card rounded-3xl p-3.5", !n.read && "ring-1 ring-primary/20")}>
              <div className="flex gap-3">
                <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-soft", meta.cls)}>
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate font-heading text-sm font-bold text-navy">{n.title}</h3>
                    {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-danger" />}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{n.time}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Link
                  to="/detail/$id"
                  params={{ id: n.reportId }}
                  className="flex flex-1 items-center justify-center gap-1 rounded-full bg-accent py-2 text-xs font-bold text-primary active:scale-95"
                >
                  Lihat Detail <ChevronRight size={13} />
                </Link>
                {!n.read && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    className="flex items-center justify-center gap-1 rounded-full border border-border px-3 py-2 text-xs font-semibold text-navy active:scale-95"
                  >
                    <Check size={13} /> Tandai Dibaca
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
