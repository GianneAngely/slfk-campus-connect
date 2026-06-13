import { useState } from "react";
import { cn } from "@/lib/utils";
import { STATUS_META, type ReportStatus } from "@/lib/data";

/* ---------------- Mascot ---------------- */
export function Mascot({
  src,
  alt = "PINO",
  className,
  sticker = false,
  imgClassName,
}: {
  src: string;
  alt?: string;
  className?: string;
  sticker?: boolean;
  imgClassName?: string;
}) {
  if (sticker) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-3xl bg-card p-2 shadow-card",
          className,
        )}
      >
        <img src={src} alt={alt} className={cn("h-full w-full object-contain", imgClassName)} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-contain", className, imgClassName)}
    />
  );
}

/* ---------------- Item photo with graceful fallback ---------------- */
export function ItemPhoto({
  src,
  alt,
  className,
  rounded = "rounded-3xl",
}: {
  src: string;
  alt: string;
  className?: string;
  rounded?: string;
}) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center bg-gradient-soft text-muted-foreground",
          rounded,
          className,
        )}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <span className="mt-1.5 text-xs font-medium">Foto tidak tersedia</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={cn("object-cover", rounded, className)}
    />
  );
}

/* ---------------- Status badge ---------------- */
export function StatusBadge({
  status,
  className,
}: {
  status: ReportStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold",
        meta.className,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {meta.label}
    </span>
  );
}

/* ---------------- Section heading ---------------- */
export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="font-heading text-base font-extrabold text-navy">{title}</h2>
      {action}
    </div>
  );
}

