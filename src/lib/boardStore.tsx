'use client';

// This store syncs React state with an external store (localStorage) inside
// effects — the intended use of effects — so the set-state-in-effect rule is a
// false positive here and is disabled for the whole file.
/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '@/lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile 
} from 'firebase/auth';

/* ──────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────── */

export type ChecklistItem = { id: string; text: string; done: boolean };
export type CommentItem = { id: string; author: string; text: string; ts: number };

export type Card = {
  id: string;
  labels: string[];
  title: string;
  due?: string; // "25 Jun" style
  progress?: number;
  members: string[];
  featured?: boolean;
  description?: string;
  checklist?: ChecklistItem[];
  comments?: CommentItem[];
};

export type Column = {
  id: string;
  name: string;
  dot: { bg: string; border: string };
  cards: Card[];
};

export type WorkBoard = {
  id: string;
  name: string;
  color: string; // gradient for the cover
  columns: Column[];
};

export type Role = 'Superadmin' | 'Owner' | 'Manager' | 'Member';

export type User = {
  id: string;       // initials, unique — referenced by Card.members
  name: string;
  role: Role;
  color: string;    // gradient fallback when no photo
  avatar?: string;  // data URL photo
  email?: string;   // mapped from Firebase Auth
};

export type NotifKind = 'card' | 'move' | 'user' | 'comment' | 'ai';
export type Notif = { id: string; text: string; ts: number; read: boolean; kind: NotifKind };

export type ChatMsg = { id: string; author: string; text: string; ts: number };

export type MeetScope = 'board' | 'all' | 'dm';
export type Meeting = { id: string; scope: MeetScope; target?: string; hostId: string; startedAt: number };
export type ScheduledMeet = { id: string; title: string; scope: MeetScope; target?: string; at: number; hostId: string };

export const THEMES = {
  lime: { accent: '#AAFF00', dark: '#1A2E00' },
  cyan: { accent: '#2dd4bf', dark: '#0a2e2a' },
  blue: { accent: '#4A90FF', dark: '#0a1a3a' },
  purple: { accent: '#B44AFF', dark: '#1a0a2e' },
  orange: { accent: '#FF8C4A', dark: '#2e1a0a' },
  pink: { accent: '#FF6BAA', dark: '#3a1a2a' },
} as const;
export type ThemeKey = keyof typeof THEMES;

/* ──────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────── */

export const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export const dotForName = (name: string): { bg: string; border: string } => {
  const n = name.toLowerCase();
  if (n.includes('done') || name.includes('✅')) return { bg: '#2A2A2A', border: '#3A3A3A' };
  if (n.includes('progress')) return { bg: '#AAFF00', border: '#AAFF00' };
  if (n.includes('review')) return { bg: '#FFB84A', border: '#FFB84A' };
  return { bg: '#3A3A3A', border: '#555555' };
};

export const isDoneCol = (name: string) => name.toLowerCase().includes('done') || name.includes('✅');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const parseDue = (due?: string): Date | null => {
  if (!due) return null;
  const m = /^(\d{1,2})\s+([A-Za-z]{3})/.exec(due.trim());
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const month = MONTHS.indexOf(m[2][0].toUpperCase() + m[2].slice(1, 3).toLowerCase());
  if (month === -1) return null;
  return new Date(2025, month, day);
};

export const formatDue = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;

export const ALL_MEMBERS = ['JD', 'AR', 'SK', 'MF'];
export const ALL_LABELS = ['Design', 'Dev', 'Research', 'QA', 'Content', 'High', 'Medium', 'Low'];

export const BOARD_COLORS = [
  'linear-gradient(135deg,#1A2E00,#AAFF00)',
  'linear-gradient(135deg,#0a1a3a,#4A90FF)',
  'linear-gradient(135deg,#2e1a0a,#FF8C4A)',
  'linear-gradient(135deg,#1a0a2e,#B44AFF)',
  'linear-gradient(135deg,#3a1a1a,#FF6B6B)',
];

export const USER_COLORS = [
  'linear-gradient(135deg,#1a3a2a,#56cc6a)',
  'linear-gradient(135deg,#1a1a3a,#4A90FF)',
  'linear-gradient(135deg,#3a1a1a,#FF6B6B)',
  'linear-gradient(135deg,#3a2a1a,#FFB84A)',
  'linear-gradient(135deg,#1a0a2e,#B44AFF)',
  'linear-gradient(135deg,#0a2a2e,#2dd4bf)',
];

export const initialsFromName = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const seedUsers = (): User[] => [
  { id: 'SA', name: 'Super Admin', role: 'Superadmin', color: USER_COLORS[5] },
  { id: 'JD', name: 'Jane Doe', role: 'Owner', color: USER_COLORS[0] },
  { id: 'AR', name: 'Andi Rahman', role: 'Manager', color: USER_COLORS[1] },
  { id: 'SK', name: 'Siti Kartika', role: 'Member', color: USER_COLORS[2] },
  { id: 'MF', name: 'M. Fajar', role: 'Member', color: USER_COLORS[3] },
];

const newColumns = (): Column[] => [
  { id: uid(), name: 'TO DO', dot: dotForName('TO DO'), cards: [] },
  { id: uid(), name: 'IN PROGRESS', dot: dotForName('IN PROGRESS'), cards: [] },
  { id: uid(), name: 'DONE', dot: dotForName('DONE'), cards: [] },
];

/* ──────────────────────────────────────────────────────────
   Seed
   ────────────────────────────────────────────────────────── */

const seed = (): WorkBoard[] => [
  {
    id: uid(), name: 'Sprint Board', color: BOARD_COLORS[0],
    columns: [
      {
        id: uid(), name: 'TO DO', dot: dotForName('TO DO'),
        cards: [
          { id: uid(), labels: ['Design', 'High'], title: 'Redesign onboarding flow for mobile app', due: '25 Jun', progress: 30, members: ['JD'] },
          { id: uid(), labels: ['Dev', 'Medium'], title: 'Integrate Stripe payment gateway v3', due: '30 Jun', members: ['AR'] },
          { id: uid(), labels: ['Research'], title: 'User interview analysis — Q2 cohort', due: '2 Jul', members: ['SK'] },
        ],
      },
      {
        id: uid(), name: 'IN PROGRESS', dot: dotForName('IN PROGRESS'),
        cards: [
          { id: uid(), labels: ['Design', 'High'], title: 'Dashboard UI redesign — dark theme system', due: '21 Jun', progress: 65, members: ['AR'], featured: true },
          { id: uid(), labels: ['Dev', 'High'], title: 'Build REST API for notifications service', due: '22 Jun', progress: 80, members: ['MF'] },
          { id: uid(), labels: ['QA'], title: 'Write test cases for auth module', due: '24 Jun', progress: 45, members: ['SK'] },
        ],
      },
      {
        id: uid(), name: 'IN REVIEW', dot: dotForName('IN REVIEW'),
        cards: [
          { id: uid(), labels: ['Design'], title: 'Landing page hero section — new layout v4', due: '20 Jun', progress: 100, members: ['JD'] },
          { id: uid(), labels: ['Dev', 'Low'], title: 'Migrate database schema to PostgreSQL 16', due: '19 Jun', progress: 100, members: ['AR'] },
          { id: uid(), labels: ['Content'], title: 'UX copy audit — onboarding screens', due: '18 Jun', members: ['MF'] },
        ],
      },
      {
        id: uid(), name: 'DONE', dot: dotForName('DONE'),
        cards: [
          { id: uid(), labels: ['Design'], title: 'Setup Figma design tokens library', members: ['SK'] },
          { id: uid(), labels: ['Dev'], title: 'CI/CD pipeline setup with GitHub Actions', members: ['MF'] },
          { id: uid(), labels: ['Research'], title: 'Competitive analysis report 2025', members: ['JD'] },
        ],
      },
    ],
  },
  {
    id: uid(), name: 'Marketing Q3', color: BOARD_COLORS[1],
    columns: [
      {
        id: uid(), name: 'IDE', dot: dotForName('todo'),
        cards: [
          { id: uid(), labels: ['Content'], title: 'Kalender konten Instagram Juli', members: ['MF'] },
          { id: uid(), labels: ['Design'], title: 'Konsep kampanye launch v2', due: '5 Jul', members: ['JD'] },
        ],
      },
      {
        id: uid(), name: 'IN PROGRESS', dot: dotForName('IN PROGRESS'),
        cards: [
          { id: uid(), labels: ['Content', 'High'], title: 'Tulis 5 artikel blog SEO', due: '28 Jun', progress: 40, members: ['SK'] },
        ],
      },
      { id: uid(), name: 'DONE', dot: dotForName('DONE'), cards: [
        { id: uid(), labels: ['Content'], title: 'Riset keyword Q3', members: ['AR'] },
      ] },
    ],
  },
];

const STORAGE_KEY = 'sprint-board:v2';

/* ──────────────────────────────────────────────────────────
   Context
   ────────────────────────────────────────────────────────── */

type Persisted = { boards: WorkBoard[]; activeId: string; users?: User[]; notifications?: Notif[]; theme?: ThemeKey; chat?: ChatMsg[]; meeting?: Meeting | null; scheduledMeets?: ScheduledMeet[] };

type BoardCtx = {
  boards: WorkBoard[];
  activeId: string;
  activeBoard: WorkBoard | undefined;
  columns: Column[]; // active board's columns (back-compat for views)
  users: User[];
  userById: (id: string) => User | undefined;
  notifications: Notif[];
  pushNotif: (text: string, kind: NotifKind) => void;
  markNotifsRead: () => void;
  clearNotifs: () => void;
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
  chat: ChatMsg[];
  pushChat: (author: string, text: string) => void;
  clearChat: () => void;
  meeting: Meeting | null;
  startMeeting: (scope: MeetScope, hostId: string, target?: string) => Meeting;
  endMeeting: () => void;
  scheduledMeets: ScheduledMeet[];
  scheduleMeet: (data: Omit<ScheduledMeet, 'id'>) => void;
  deleteScheduledMeet: (id: string) => void;
  loaded: boolean;
  // user-level
  addUser: (name: string, role: Role) => string;
  editUser: (id: string, patch: Partial<User>) => void;
  deleteUser: (id: string) => void;
  // board-level
  setActive: (id: string) => void;
  addBoard: (name: string) => string;
  renameBoard: (id: string, name: string) => void;
  deleteBoard: (id: string) => void;
  // card / column mutations operate on the ACTIVE board
  addCard: (colId: string, title: string) => void;
  editCard: (colId: string, cardId: string, patch: Partial<Card>) => void;
  deleteCard: (colId: string, cardId: string) => void;
  renameCol: (colId: string, name: string) => void;
  deleteCol: (colId: string) => void;
  addColumn: () => void;
  moveCard: (cardId: string, fromCol: string, toCol: string, toIndex?: number) => void;
  moveColumn: (fromId: string, toId: string) => void;
  reset: () => void;

  me: User | null;
  toasts: { id: string; text: string; kind: NotifKind }[];
  loadingAuth: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
};

const Ctx = createContext<BoardCtx | null>(null);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [boards, setBoards] = useState<WorkBoard[]>(seed);
  const [activeId, setActiveId] = useState<string>('');
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [theme, setThemeState] = useState<ThemeKey>('lime');
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [scheduledMeets, setScheduledMeets] = useState<ScheduledMeet[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [fbUser, setFbUser] = useState<any | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [guestMode, setGuestMode] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; text: string; kind: NotifKind }[]>([]);

  const pushNotif = (text: string, kind: NotifKind) => {
    setNotifications((ns) => [{ id: uid(), text, ts: Date.now(), read: false, kind }, ...ns].slice(0, 50));
    
    const toastId = uid();
    setToasts((prev) => [...prev, { id: toastId, text, kind }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4000);

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted' && document.hidden) {
        try {
          new Notification('TaskFlow Update', { body: text });
        } catch (e) {
          console.error('Failed to trigger OS notification:', e);
        }
      }
    }
  };

  // hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Persisted;
        if (p.boards?.length) {
          setBoards(p.boards);
          setActiveId(p.boards.some((b) => b.id === p.activeId) ? p.activeId : p.boards[0].id);
          if (p.users?.length) setUsers(p.users);
          if (p.notifications?.length) setNotifications(p.notifications);
          if (p.theme && THEMES[p.theme]) setThemeState(p.theme);
          if (p.chat?.length) setChat(p.chat);
          if (p.meeting) setMeeting(p.meeting);
          if (p.scheduledMeets?.length) setScheduledMeets(p.scheduledMeets);
          setLoaded(true);
          return;
        }
      }
    } catch { /* ignore */ }
    // fall back to seed's first board
    setActiveId((b) => b || '');
    setLoaded(true);
  }, []);

  // ensure activeId always valid once boards are present
  useEffect(() => {
    if (boards.length && !boards.some((b) => b.id === activeId)) {
      setActiveId(boards[0].id);
    }
  }, [boards, activeId]);

  // persist
  useEffect(() => {
    if (loaded) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ boards, activeId, users, notifications, theme, chat, meeting, scheduledMeets })); } catch { /* ignore */ }
    }
  }, [boards, activeId, users, notifications, theme, chat, meeting, scheduledMeets, loaded]);

  useEffect(() => {
    if (!auth) {
      setLoadingAuth(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      setFbUser(user);
      setLoadingAuth(false);
      if (user) {
        setGuestMode(false);
        const email = user.email || '';
        setUsers((prevUsers) => {
          const existing = prevUsers.find((u) => u.email === email);
          if (existing) {
            return prevUsers.map((u) =>
              u.email === email
                ? {
                    ...u,
                    name: user.displayName || u.name,
                    avatar: user.photoURL || u.avatar,
                  }
                : u
            );
          } else {
            const baseId = initialsFromName(user.displayName || email || 'U');
            let id = baseId;
            let n = 2;
            while (prevUsers.some((u) => u.id === id)) {
              id = baseId.slice(0, 1) + n++;
            }
            const color = USER_COLORS[prevUsers.length % USER_COLORS.length];
            const role: Role = email === 'disdukp@gmail.com' ? 'Superadmin' : 'Member';
            const newUser: User = {
              id,
              name: user.displayName || email.split('@')[0] || 'User Baru',
              role,
              color,
              avatar: user.photoURL || undefined,
              email,
            };
            return [...prevUsers, newUser];
          }
        });
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      try {
        Notification.requestPermission();
      } catch (e) {
        console.error('Failed to request notification permission:', e);
      }
    }
  }, []);

  const me = useMemo<User | null>(() => {
    if (loadingAuth) return null;
    if (fbUser) {
      const email = fbUser.email || '';
      return users.find((u) => u.email === email) || null;
    }
    if (guestMode) {
      return {
        id: 'GST',
        name: 'Tamu (Guest)',
        role: 'Member',
        color: 'linear-gradient(135deg,#555,#777)',
      };
    }
    return null;
  }, [fbUser, users, loadingAuth, guestMode]);

  const loginWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (!auth) return;
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    if (!auth) return;
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });
      setFbUser({ ...cred.user, displayName: name });
    }
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setGuestMode(false);
  };

  const continueAsGuest = () => {
    setGuestMode(true);
  };

  const updateActiveColumns = (fn: (cols: Column[]) => Column[]) =>
    setBoards((bs) => bs.map((b) => b.id === activeId ? { ...b, columns: fn(b.columns) } : b));

  const api = useMemo<BoardCtx>(() => {
    const activeBoard = boards.find((b) => b.id === activeId) || boards[0];
    return {
      boards,
      activeId,
      activeBoard,
      columns: activeBoard?.columns ?? [],
      users,
      userById: (id) => users.find((u) => u.id === id),
      notifications,
      pushNotif,
      markNotifsRead: () => setNotifications((ns) => ns.map((n) => ({ ...n, read: true }))),
      clearNotifs: () => setNotifications([]),
      theme,
      setTheme: (t) => setThemeState(t),
      chat,
      pushChat: (author, text) => setChat((cs) => [...cs, { id: uid(), author, text, ts: Date.now() }].slice(-200)),
      clearChat: () => setChat([]),
      meeting,
      startMeeting: (scope, hostId, target) => {
        const m: Meeting = { id: uid(), scope, target, hostId, startedAt: Date.now() };
        setMeeting(m);
        const label = scope === 'all' ? 'semua tim' : scope === 'dm' ? `1-on-1 dengan ${users.find((u) => u.id === target)?.name ?? target}` : `board ${activeBoard?.name ?? ''}`;
        pushNotif(`Meeting dimulai (${label})`, 'user');
        return m;
      },
      endMeeting: () => setMeeting(null),
      scheduledMeets,
      scheduleMeet: (data) => {
        setScheduledMeets((ms) => [...ms, { ...data, id: uid() }].sort((a, b) => a.at - b.at));
        const when = new Date(data.at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        pushNotif(`Meeting "${data.title}" dijadwalkan · ${when}`, 'user');
      },
      deleteScheduledMeet: (id) => setScheduledMeets((ms) => ms.filter((m) => m.id !== id)),
      loaded,

      addUser: (name, role) => {
        const base = initialsFromName(name);
        let id = base;
        let n = 2;
        while (users.some((u) => u.id === id)) id = base.slice(0, 1) + n++;
        const color = USER_COLORS[users.length % USER_COLORS.length];
        setUsers((us) => [...us, { id, name: name.trim() || 'User Baru', role, color }]);
        pushNotif(`User ${name.trim() || 'baru'} (${role}) ditambahkan`, 'user');
        return id;
      },
      editUser: (id, patch) => setUsers((us) => us.map((u) => u.id === id ? { ...u, ...patch } : u)),
      deleteUser: (id) => {
        setUsers((us) => us.filter((u) => u.id !== id));
        // also unassign from every card across all boards
        setBoards((bs) => bs.map((b) => ({ ...b, columns: b.columns.map((c) => ({ ...c, cards: c.cards.map((k) => ({ ...k, members: k.members.filter((m) => m !== id) })) })) })));
      },

      setActive: (id) => setActiveId(id),
      addBoard: (name) => {
        const id = uid();
        const color = BOARD_COLORS[boards.length % BOARD_COLORS.length];
        setBoards((bs) => [...bs, { id, name: name.trim() || 'Board Baru', color, columns: newColumns() }]);
        setActiveId(id);
        return id;
      },
      renameBoard: (id, name) => setBoards((bs) => bs.map((b) => b.id === id ? { ...b, name } : b)),
      deleteBoard: (id) => setBoards((bs) => {
        const next = bs.filter((b) => b.id !== id);
        return next.length ? next : seed().slice(0, 1);
      }),

      addCard: (colId, title) => {
        const col = activeBoard?.columns.find((c) => c.id === colId);
        updateActiveColumns((cols) => cols.map((c) => c.id === colId ? { ...c, cards: [...c.cards, { id: uid(), labels: [], title, members: [] }] } : c));
        pushNotif(`Kartu "${title}" ditambahkan ke ${col?.name ?? 'list'}`, 'card');
      },
      editCard: (colId, cardId, patch) =>
        updateActiveColumns((cols) => cols.map((c) => c.id === colId ? { ...c, cards: c.cards.map((k) => k.id === cardId ? { ...k, ...patch } : k) } : c)),
      deleteCard: (colId, cardId) =>
        updateActiveColumns((cols) => cols.map((c) => c.id === colId ? { ...c, cards: c.cards.filter((k) => k.id !== cardId) } : c)),
      renameCol: (colId, name) =>
        updateActiveColumns((cols) => cols.map((c) => c.id === colId ? { ...c, name, dot: dotForName(name) } : c)),
      deleteCol: (colId) =>
        updateActiveColumns((cols) => cols.filter((c) => c.id !== colId)),
      addColumn: () =>
        updateActiveColumns((cols) => [...cols, { id: uid(), name: 'NEW LIST', dot: dotForName('new'), cards: [] }]),
      moveCard: (cardId, fromCol, toCol, toIndex) => {
        if (fromCol !== toCol) {
          const dest = activeBoard?.columns.find((c) => c.id === toCol);
          const card = activeBoard?.columns.flatMap((c) => c.cards).find((k) => k.id === cardId);
          pushNotif(`"${card?.title ?? 'Kartu'}" dipindahkan ke ${dest?.name ?? 'list'}`, 'move');
        }
        updateActiveColumns((cols) => {
          let moved: Card | null = null;
          const stripped = cols.map((c) => {
            if (c.id !== fromCol) return c;
            const idx = c.cards.findIndex((k) => k.id === cardId);
            if (idx === -1) return c;
            moved = c.cards[idx];
            return { ...c, cards: c.cards.filter((k) => k.id !== cardId) };
          });
          if (!moved) return cols;
          return stripped.map((c) => {
            if (c.id !== toCol) return c;
            const next = [...c.cards];
            const at = toIndex === undefined || toIndex > next.length ? next.length : toIndex;
            next.splice(at, 0, moved as Card);
            return { ...c, cards: next };
          });
        });
      },
      moveColumn: (fromId, toId) =>
        updateActiveColumns((cols) => {
          if (fromId === toId) return cols;
          const from = cols.findIndex((c) => c.id === fromId);
          const to = cols.findIndex((c) => c.id === toId);
          if (from === -1 || to === -1) return cols;
          const next = [...cols];
          const [m] = next.splice(from, 1);
          next.splice(to, 0, m);
          return next;
        }),
      reset: () => { const s = seed(); setBoards(s); setActiveId(s[0].id); setUsers(seedUsers()); setNotifications([]); setThemeState('lime'); setChat([]); setMeeting(null); setScheduledMeets([]); },
      me,
      toasts,
      loadingAuth,
      loginWithGoogle,
      loginWithEmail,
      registerWithEmail,
      logout,
      continueAsGuest,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boards, activeId, users, notifications, theme, chat, meeting, scheduledMeets, loaded, fbUser, loadingAuth, guestMode, toasts]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useBoard() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useBoard must be used within <BoardProvider>');
  return ctx;
}
