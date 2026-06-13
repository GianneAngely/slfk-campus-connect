import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Home,
  PlusCircle,
  Bell,
  User,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/data";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  badge?: boolean;
}

function navForRole(role: Role): NavItem[] {
  if (role === "satpam") {
    return [
      { to: "/satpam", label: "Beranda", icon: Home },
      { to: "/satpam/verifikasi", label: "Verifikasi", icon: ShieldCheck },
      { to: "/profil", label: "Profil", icon: User },
    ];
  }
  if (role === "admin") {
    return [
      { to: "/admin", label: "Beranda", icon: Home },
      { to: "/admin/kelola", label: "Kelola Laporan", icon: ClipboardList },
      { to: "/profil", label: "Profil", icon: User },
    ];
  }
  return [
    { to: "/beranda", label: "Beranda", icon: Home },
    { to: "/lapor", label: "Lapor", icon: PlusCircle },
    { to: "/notifikasi", label: "Notifikasi", icon: Bell, badge: true },
    { to: "/profil", label: "Profil", icon: User },
  ];
}

export function BottomNav() {
  const { user, unreadCount } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!user) return null;
  const items = navForRole(user.role);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md">
      <div className="glass-card m-3 flex items-center justify-around rounded-3xl px-2 py-2">
        {items.map((item) => {
          const active =
            pathname === item.to ||
            (item.to !== "/beranda" &&
              item.to !== "/satpam" &&
              item.to !== "/admin" &&
              pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-semibold transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-2xl transition-all",
                  active ? "bg-gradient-primary text-primary-foreground shadow-soft" : "",
                )}
              >
                <Icon size={19} strokeWidth={2.2} />
                {item.badge && unreadCount > 0 && (
                  <span className="absolute right-2 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-danger-foreground">
                    {unreadCount}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <div className="px-4 pb-28 pt-4">{children}</div>
      <BottomNav />
    </div>
  );
}

export function useRequireRole(allowed: Role[]) {
  const { user } = useApp();
  const navigate = useNavigate();
  if (typeof window !== "undefined" && (!user || !allowed.includes(user.role))) {
    navigate({ to: "/login" });
  }
  return user;
}
