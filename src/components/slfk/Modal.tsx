import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MASCOT } from "@/lib/data";
import { cn } from "@/lib/utils";

/* ---------------- Success modal ---------------- */
export function SuccessModal({
  open,
  title,
  message,
  primaryLabel = "Lanjut",
  onPrimary,
  secondaryLabel,
  onSecondary,
}: {
  open: boolean;
  title: string;
  message: string;
  primaryLabel?: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-6 backdrop-blur-sm">
      <div className="animate-pop w-full max-w-sm rounded-4xl bg-card p-6 text-center shadow-glow">
        <div className="mx-auto mb-3 h-32 w-32">
          <img src={MASCOT.success} alt="PINO" className="h-full w-full object-contain" />
        </div>
        <h3 className="font-heading text-xl font-extrabold text-navy">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{message}</p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={onPrimary}
            className="bg-gradient-primary gloss-top relative w-full rounded-full py-3 font-heading text-sm font-bold text-primary-foreground shadow-soft active:scale-[0.98]"
          >
            {primaryLabel}
          </button>
          {secondaryLabel && (
            <button
              onClick={onSecondary}
              className="w-full rounded-full border border-border bg-card py-3 text-sm font-semibold text-navy active:scale-[0.98]"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Page header with back ---------------- */
export function PageHeader({
  title,
  subtitle,
  back = "/beranda",
  right,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Link
        to={back}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-navy shadow-soft active:scale-95"
      >
        <ArrowLeft size={18} />
      </Link>
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-heading text-lg font-extrabold text-navy">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

/* ---------------- Primary / pill button ---------------- */
export function PrimaryButton({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "success" | "danger" | "soft";
}) {
  const variants: Record<string, string> = {
    primary:
      "bg-gradient-primary gloss-top relative text-primary-foreground shadow-soft",
    success: "bg-gradient-success text-success-foreground shadow-soft",
    danger: "bg-danger text-danger-foreground shadow-soft",
    outline: "border border-border bg-card text-navy",
    soft: "bg-accent text-primary",
  };
  return (
    <button
      className={cn(
        "w-full rounded-full py-3 font-heading text-sm font-bold transition-transform active:scale-[0.98] disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------- Text input ---------------- */
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-navy">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-navy placeholder:text-muted-foreground/70 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20";
