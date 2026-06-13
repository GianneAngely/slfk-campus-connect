import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_CLAIMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
  USERS,
  type AppNotification,
  type Claim,
  type ItemReport,
  type Role,
  type ReportStatus,
  type User,
} from "./data";

interface AppState {
  user: User | null;
  reports: ItemReport[];
  notifications: AppNotification[];
  claims: Claim[];
  login: (email: string, password: string) => User | null;
  register: (u: Partial<User>) => void;
  logout: () => void;
  addReport: (r: ItemReport) => void;
  updateReportStatus: (id: string, status: ReportStatus) => void;
  addClaim: (c: Claim) => void;
  updateClaimStatus: (id: string, status: Claim["status"]) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = "slfk-state-v1";

interface Persisted {
  userEmail: string | null;
  reports: ItemReport[];
  notifications: AppNotification[];
  claims: Claim[];
  registered: User[];
}

function load(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [registered, setRegistered] = useState<User[]>(USERS);
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<ItemReport[]>(INITIAL_REPORTS);
  const [notifications, setNotifications] =
    useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const p = load();
    if (p) {
      if (p.registered?.length) setRegistered(p.registered);
      if (p.reports?.length) setReports(p.reports);
      if (p.notifications?.length) setNotifications(p.notifications);
      if (p.claims?.length) setClaims(p.claims);
      if (p.userEmail) {
        const all = p.registered?.length ? p.registered : USERS;
        setUser(all.find((u) => u.email === p.userEmail) ?? null);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const data: Persisted = {
      userEmail: user?.email ?? null,
      reports,
      notifications,
      claims,
      registered,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [user, reports, notifications, claims, registered, hydrated]);

  const value = useMemo<AppState>(() => {
    return {
      user,
      reports,
      notifications,
      claims,
      login(email, password) {
        const found = registered.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
        );
        if (found) setUser(found);
        return found ?? null;
      },
      register(u) {
        const newUser: User = {
          id: `u-${Date.now()}`,
          nama: u.nama ?? "Pengguna Baru",
          identitas: u.identitas ?? "-",
          identitasLabel: "NIM / ID",
          prodiJabatan: u.prodiJabatan ?? "-",
          email: u.email ?? `user${Date.now()}@kampus.id`,
          password: u.password ?? "12345678",
          hp: u.hp ?? "-",
          role: (u.role as Role) ?? "mahasiswa",
        };
        setRegistered((prev) => [...prev, newUser]);
      },
      logout() {
        setUser(null);
      },
      addReport(r) {
        setReports((prev) => [r, ...prev]);
      },
      updateReportStatus(id, status) {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r)),
        );
      },
      addClaim(c) {
        setClaims((prev) => [c, ...prev]);
      },
      updateClaimStatus(id, status) {
        setClaims((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c)),
        );
      },
      markNotificationRead(id) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
      },
      unreadCount: notifications.filter((n) => !n.read).length,
    };
  }, [user, reports, notifications, claims, registered]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
