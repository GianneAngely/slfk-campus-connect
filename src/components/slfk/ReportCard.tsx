import { Link } from "@tanstack/react-router";
import { MapPin, CalendarDays, ChevronRight } from "lucide-react";
import { ItemPhoto, StatusBadge } from "./Primitives";
import type { ItemReport } from "@/lib/data";

export function ReportCard({ report }: { report: ItemReport }) {
  return (
    <Link
      to="/detail/$id"
      params={{ id: report.id }}
      className="glass-card flex items-center gap-3 rounded-3xl p-3 transition-transform active:scale-[0.99]"
    >
      <ItemPhoto
        src={report.foto}
        alt={report.nama}
        rounded="rounded-2xl"
        className="h-16 w-16 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-primary">
            {report.type === "hilang" ? "Hilang" : "Temuan"}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground">{report.id}</span>
        </div>
        <h3 className="mt-1 truncate font-heading text-sm font-bold text-navy">
          {report.nama}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <MapPin size={11} /> <span className="max-w-[88px] truncate">{report.lokasi}</span>
          </span>
          <span className="flex items-center gap-0.5">
            <CalendarDays size={11} /> {report.tanggal}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <StatusBadge status={report.status} />
        <ChevronRight size={16} className="text-muted-foreground" />
      </div>
    </Link>
  );
}

export function MatchCard({ report }: { report: ItemReport }) {
  return (
    <Link
      to="/detail/$id"
      params={{ id: report.id }}
      className="relative w-[150px] shrink-0 overflow-hidden rounded-3xl shadow-card active:scale-[0.99]"
    >
      <ItemPhoto src={report.foto} alt={report.nama} rounded="rounded-none" className="h-28 w-full" />
      <div className="bg-card p-3">
        <div className="flex items-center gap-1">
          {report.matchScore && (
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
              {report.matchScore}% cocok
            </span>
          )}
        </div>
        <h3 className="mt-1 line-clamp-2 font-heading text-xs font-bold text-navy">
          {report.nama}
        </h3>
        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{report.lokasi}</p>
      </div>
    </Link>
  );
}
