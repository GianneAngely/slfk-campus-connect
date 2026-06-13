import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MASCOT } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const { user } = useApp();

  useEffect(() => {
    const t = setTimeout(() => {
      if (user) {
        const dest =
          user.role === "satpam" ? "/satpam" : user.role === "admin" ? "/admin" : "/beranda";
        navigate({ to: dest });
      } else {
        navigate({ to: "/login" });
      }
    }, 2400);
    return () => clearTimeout(t);
  }, [navigate, user]);

  return (
    <div className="bg-gradient-primary gloss-top relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center overflow-hidden px-8">
      {/* decorative bubbles */}
      <div className="absolute -left-10 top-16 h-32 w-32 rounded-full bg-white/10 blur-xl" />
      <div className="absolute -right-8 bottom-24 h-40 w-40 rounded-full bg-white/10 blur-xl" />

      <div className="animate-float mb-7 h-40 w-40 rounded-[2.5rem] bg-white/90 p-3 shadow-glow">
        <img src={MASCOT.face} alt="PINO" className="h-full w-full rounded-[2rem] object-cover" />
      </div>

      <h1 className="font-heading text-5xl font-black tracking-tight text-white drop-shadow">
        SLFK
      </h1>
      <p className="mt-1 font-heading text-base font-semibold text-white/90">
        Sistem Lost and Found
      </p>
      <p className="mt-3 text-sm font-medium text-white/80">Temukan. Klaim. Kembalikan.</p>

      <div className="mt-10 flex items-center gap-2">
        <span className="dot-1 h-2.5 w-2.5 rounded-full bg-white" />
        <span className="dot-2 h-2.5 w-2.5 rounded-full bg-white" />
        <span className="dot-3 h-2.5 w-2.5 rounded-full bg-white" />
      </div>

      <button
        onClick={() => navigate({ to: "/login" })}
        className="absolute bottom-10 text-sm font-semibold text-white/80 underline-offset-4 hover:underline"
      >
        Lanjut ke Masuk
      </button>
    </div>
  );
}
