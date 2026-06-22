'use client';

import React, { useState } from 'react';
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
  const { me, logout } = useBoard();
  const [profileOpen, setProfileOpen] = useState(false);
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

      {/* User profile with logout popup */}
      <div style={{ position: 'relative', marginTop: 10, flex: 'none' }}>
        <button 
          onClick={() => setProfileOpen(!profileOpen)}
          style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
          title={me ? `${me.name} (${me.role})` : 'Akun'}
        >
          {me ? <UserAvatar id={me.id} size={34} ring="var(--accent-dark)" /> : (
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #222', fontSize: 14 }}>
              👤
            </div>
          )}
        </button>

        {profileOpen && (
          <>
            <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 80 }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 48,
              width: 220,
              background: '#161616',
              border: '1px solid #262626',
              borderRadius: 14,
              padding: 14,
              zIndex: 90,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}>
              {me ? (
                <>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{me.name}</div>
                    <div style={{ fontSize: 10, color: '#666', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{me.email || 'Akun Tamu'}</div>
                    <div style={{
                      display: 'inline-block',
                      fontSize: 9,
                      fontWeight: 800,
                      color: me.role === 'Superadmin' ? '#FF6BAA' : me.role === 'Owner' ? 'var(--accent)' : me.role === 'Manager' ? '#4A90FF' : '#888',
                      background: me.role === 'Superadmin' ? '#3a1a2a' : me.role === 'Owner' ? 'var(--accent-dark)' : me.role === 'Manager' ? '#0a1a3a' : '#1C1C1C',
                      padding: '2px 8px',
                      borderRadius: 6,
                      marginTop: 6
                    }}>
                      {me.role}
                    </div>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid #222', margin: '4px 0' }} />
                  <Link 
                    href="/app/team"
                    onClick={() => setProfileOpen(false)}
                    style={{ fontSize: 12, color: '#ddd', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span>👥</span> Kelola Tim
                  </Link>
                  <button 
                    onClick={() => { logout(); setProfileOpen(false); }}
                    style={{
                      background: 'rgba(255,107,107,0.08)',
                      border: '1px solid rgba(255,107,107,0.2)',
                      borderRadius: 8,
                      color: '#FF6B6B',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '6px 0',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'all 0.2s'
                    }}
                  >
                    Keluar (Sign Out)
                  </button>
                </>
              ) : (
                <div style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
                  Belum masuk
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
