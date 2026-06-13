import { useRef, useState } from "react";
import { ImagePlus, RefreshCw, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="mb-5 flex items-center">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full font-heading text-sm font-bold transition-all",
                  active && "bg-gradient-primary text-primary-foreground shadow-soft",
                  done && "bg-success text-success-foreground",
                  !active && !done && "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check size={16} /> : i + 1}
              </span>
              <span
                className={cn(
                  "mt-1 max-w-[64px] text-center text-[10px] font-medium leading-tight",
                  active || done ? "text-navy" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("mx-1 h-0.5 flex-1 rounded-full", done ? "bg-success" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function PhotoUpload({
  value,
  onChange,
  label = "Upload foto barang",
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setKey] = useState(0);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
    setKey((k) => k + 1);
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold text-navy">{label}</span>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="bg-gradient-soft flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-primary/40 px-4 py-10 text-center active:scale-[0.99]"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-primary shadow-soft">
            <ImagePlus size={26} />
          </span>
          <span className="font-heading text-sm font-bold text-navy">Pilih Foto</span>
          <span className="text-[11px] text-muted-foreground">
            Tekan untuk menambahkan foto barang sebagai bukti visual.
          </span>
        </button>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
          <img src={value} alt="Pratinjau" className="h-48 w-full object-cover" />
          <div className="grid grid-cols-2 gap-2 bg-card p-2.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 rounded-full border border-border py-2 text-xs font-semibold text-navy active:scale-95"
            >
              <RefreshCw size={14} /> Ganti Foto
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center justify-center gap-1.5 rounded-full bg-danger/10 py-2 text-xs font-semibold text-danger active:scale-95"
            >
              <Trash2 size={14} /> Hapus Foto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-right text-xs font-semibold text-navy">{value || "-"}</span>
    </div>
  );
}
