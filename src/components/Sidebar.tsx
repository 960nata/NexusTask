'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBoard } from '@/lib/boardStore';
import { Ic, UserAvatar } from './ui';

const NAV = [
  { href: '/app', icon: Ic.home, key: 'home' },
  { href: '/app/boards', icon: Ic.boards, key: 'boards' },
  { href: '/app/calendar', icon: Ic.calendar, key: 'calendar' },
  { href: '/app/team', icon: Ic.team, key: 'team' },
  { href: '/app/analytics', icon: Ic.analytics, key: 'analytics' },
  { href: '/app/admin', icon: Ic.shield, key: 'admin' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { users } = useBoard();
  const me = users.find((u) => u.role === 'Owner') || users[0];
  const isActive = (href: string) => (href === '/app' ? pathname === '/app' : pathname.startsWith(href));

  return (
    <div style={{ width: 64, background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '18px 0', gap: 6, borderRight: '1px solid #1E1E1E', flex: 'none' }}>
      <Link href="/app" style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, flex: 'none' }}>
        {Ic.logo}
      </Link>

      {NAV.map((n) => {
        const active = isActive(n.href);
        return (
          <Link
            key={n.key}
            href={n.href}
            style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', background: active ? 'var(--accent)' : '#1C1C1C', position: 'relative' }}
          >
            {n.icon(active ? '#0E0E0E' : '#555')}
          </Link>
        );
      })}

      {/* notifications (decorative dot) */}
      <div style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', background: '#1C1C1C', position: 'relative', cursor: 'pointer' }}>
        {Ic.bell('#555')}
        <div style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, background: 'var(--accent)', borderRadius: '50%', border: '2px solid #111' }} />
      </div>

      <div style={{ flex: 1 }} />

      <Link
        href="/app/settings"
        style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', background: isActive('/app/settings') ? 'var(--accent)' : '#1C1C1C' }}
      >
        {Ic.settings(isActive('/app/settings') ? '#0E0E0E' : '#555')}
      </Link>

      <Link href="/app/team" title={me ? `${me.name} (${me.role})` : 'Team'} style={{ marginTop: 10, flex: 'none', display: 'flex' }}>
        {me ? <UserAvatar id={me.id} size={34} ring="var(--accent-dark)" /> : null}
      </Link>
    </div>
  );
}
