'use client';

import React from 'react';
import { useBoard } from '@/lib/boardStore';

export const LABEL_TONES: Record<string, { text: string; bg: string }> = {
  Design: { text: '#4A90FF', bg: '#0a1a3a' },
  High: { text: '#FF8C4A', bg: '#2e1a0a' },
  Dev: { text: '#AAFF00', bg: '#1A2E00' },
  Medium: { text: '#777', bg: '#222' },
  Research: { text: '#B44AFF', bg: '#1a0a2e' },
  QA: { text: '#4A90FF', bg: '#0a1a3a' },
  Low: { text: '#777', bg: '#222' },
  Content: { text: '#B44AFF', bg: '#1a0a2e' },
};

export const AVATAR_GRADIENTS: Record<string, string> = {
  JD: 'linear-gradient(135deg,#1a3a2a,#56cc6a)',
  AR: 'linear-gradient(135deg,#1a1a3a,#4A90FF)',
  SK: 'linear-gradient(135deg,#3a1a1a,#FF6B6B)',
  MF: 'linear-gradient(135deg,#3a2a1a,#FFB84A)',
};

/** Static avatar (initials + gradient). Used when there is no user record. */
export function Avatar({ initials, size = 28, ring = '#0E0E0E', overlap = false, gradient }: { initials: string; size?: number; ring?: string; overlap?: boolean; gradient?: string }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: gradient || AVATAR_GRADIENTS[initials] || 'linear-gradient(135deg,#2a2a2a,#444)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${ring}`, flex: 'none', marginLeft: overlap ? -6 : 0 }}>
      <span style={{ fontSize: size <= 22 ? 7 : 9, fontWeight: 700, color: '#fff' }}>{initials}</span>
    </div>
  );
}

/** User avatar: shows profile photo if set, else initials + the user's gradient. */
export function UserAvatar({ id, size = 28, ring = '#0E0E0E', overlap = false }: { id: string; size?: number; ring?: string; overlap?: boolean }) {
  const { userById } = useBoard();
  const u = userById(id);
  if (u?.avatar) {
    return (
      // Avatars are user-uploaded data URLs (not remote assets), so next/image is unnecessary here.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={u.avatar} alt={u.name} title={u.name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${ring}`, flex: 'none', marginLeft: overlap ? -6 : 0, display: 'block' }} />
    );
  }
  return <Avatar initials={id} size={size} ring={ring} overlap={overlap} gradient={u?.color} />;
}

export const Ic = {
  logo: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="2" fill="#0E0E0E" /><rect x="13" y="3" width="8" height="8" rx="2" fill="#0E0E0E" /><rect x="3" y="13" width="8" height="8" rx="2" fill="#0E0E0E" /><rect x="13" y="13" width="8" height="8" rx="2" fill="#0E0E0E" /></svg>),
  home: (c: string) => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /><polyline points="9 22 9 12 15 12 15 22" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  boards: (c: string) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke={c} strokeWidth="2" /><rect x="14" y="3" width="7" height="7" rx="1.5" stroke={c} strokeWidth="2" /><rect x="3" y="14" width="7" height="7" rx="1.5" stroke={c} strokeWidth="2" /><rect x="14" y="14" width="7" height="7" rx="1.5" stroke={c} strokeWidth="2" /></svg>),
  calendar: (c: string) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke={c} strokeWidth="2" /><line x1="16" y1="2" x2="16" y2="6" stroke={c} strokeWidth="2" strokeLinecap="round" /><line x1="8" y1="2" x2="8" y2="6" stroke={c} strokeWidth="2" strokeLinecap="round" /><line x1="3" y1="10" x2="21" y2="10" stroke={c} strokeWidth="2" /></svg>),
  team: (c: string) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke={c} strokeWidth="2" /><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke={c} strokeWidth="2" strokeLinecap="round" /><path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>),
  analytics: (c: string) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke={c} strokeWidth="2" strokeLinecap="round" /><line x1="12" y1="20" x2="12" y2="4" stroke={c} strokeWidth="2" strokeLinecap="round" /><line x1="6" y1="20" x2="6" y2="14" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>),
  bell: (c: string) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  settings: (c: string) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="2" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={c} strokeWidth="2" /></svg>),
  search: (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#444" strokeWidth="2" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#444" strokeWidth="2" strokeLinecap="round" /></svg>),
  filter: (c = '#555') => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><line x1="4" y1="6" x2="20" y2="6" stroke={c} strokeWidth="2" strokeLinecap="round" /><line x1="8" y1="12" x2="16" y2="12" stroke={c} strokeWidth="2" strokeLinecap="round" /><line x1="11" y1="18" x2="13" y2="18" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>),
  plusDark: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="#0E0E0E" strokeWidth="2.5" strokeLinecap="round" /><line x1="5" y1="12" x2="19" y2="12" stroke="#0E0E0E" strokeWidth="2.5" strokeLinecap="round" /></svg>),
  plusMuted: (<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="#444" strokeWidth="2.5" strokeLinecap="round" /><line x1="5" y1="12" x2="19" y2="12" stroke="#444" strokeWidth="2.5" strokeLinecap="round" /></svg>),
  viewBoard: (c: string) => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="5" height="18" rx="1" fill={c} /><rect x="10" y="3" width="5" height="18" rx="1" fill={c} /><rect x="17" y="3" width="5" height="18" rx="1" fill={c} /></svg>),
  viewList: (c: string) => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><line x1="3" y1="6" x2="21" y2="6" stroke={c} strokeWidth="2" strokeLinecap="round" /><line x1="3" y1="12" x2="21" y2="12" stroke={c} strokeWidth="2" strokeLinecap="round" /><line x1="3" y1="18" x2="21" y2="18" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>),
  calSmall: (stroke: string) => (<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke={stroke} strokeWidth="2" /><line x1="16" y1="2" x2="16" y2="6" stroke={stroke} strokeWidth="2" strokeLinecap="round" /><line x1="8" y1="2" x2="8" y2="6" stroke={stroke} strokeWidth="2" strokeLinecap="round" /></svg>),
  shield: (c: string) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  chat: (c: string, s = 15) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  video: (c: string, s = 15) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M23 7l-7 5 7 5V7z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><rect x="1" y="5" width="15" height="14" rx="2" stroke={c} strokeWidth="2" /></svg>),
  sparkles: (c: string, s = 14) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" stroke={c} strokeWidth="1.8" strokeLinejoin="round" /><path d="M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /></svg>),
  arrowRight: (c: string, s = 14) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><line x1="4" y1="12" x2="19" y2="12" stroke={c} strokeWidth="2" strokeLinecap="round" /><polyline points="13 6 19 12 13 18" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  cardNew: (c: string, s = 14) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke={c} strokeWidth="2" /><line x1="12" y1="8" x2="12" y2="16" stroke={c} strokeWidth="2" strokeLinecap="round" /><line x1="8" y1="12" x2="16" y2="12" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>),
  clock: (c: string, s = 14) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2" /><polyline points="12 7 12 12 15 14" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  alert: (c: string, s = 14) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" stroke={c} strokeWidth="2" strokeLinejoin="round" /><line x1="12" y1="9" x2="12" y2="13" stroke={c} strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="17" r="1" fill={c} /></svg>),
  check: (c: string, s = 11) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke={c} strokeWidth="2" /><polyline points="8 12 11 15 16 9" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  mic: (c: string, s = 16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="9" y="2" width="6" height="11" rx="3" stroke={c} strokeWidth="2" /><path d="M5 11a7 7 0 0014 0" stroke={c} strokeWidth="2" strokeLinecap="round" /><line x1="12" y1="18" x2="12" y2="22" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>),
  micOff: (c: string, s = 16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M9 9V5a3 3 0 016 0v4M5 11a7 7 0 0011 5.3M12 18v4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="3" y1="3" x2="21" y2="21" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>),
  screen: (c: string, s = 16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="13" rx="2" stroke={c} strokeWidth="2" /><path d="M12 8v5M9.5 10.5L12 8l2.5 2.5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="8" y1="21" x2="16" y2="21" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>),
};

/** Page header reused by Calendar / Analytics / Team / Settings */
export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 16, borderBottom: '1px solid #1A1A1A', background: '#0E0E0E', flex: 'none' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
