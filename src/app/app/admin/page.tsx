'use client';

import React from 'react';
import { useBoard, type Role } from '@/lib/boardStore';
import { UserAvatar, PageHeader, Ic } from '@/components/ui';

const roleStyle = (r: Role) =>
  r === 'Superadmin' ? { color: '#FF6BAA', bg: '#3a1a2a' }
    : r === 'Owner' ? { color: 'var(--accent)', bg: 'var(--accent-dark)' }
    : r === 'Manager' ? { color: '#4A90FF', bg: '#0a1a3a' }
    : { color: '#888', bg: '#1C1C1C' };

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={{ background: '#141414', border: '1px solid #1F1F1F', borderRadius: 16, padding: 18, flex: 1, minWidth: 150 }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>{label}</div>
    </div>
  );
}

export default function AdminPage() {
  const board = useBoard();
  const { me } = board;

  const totalCards = board.boards.reduce((n, b) => n + b.columns.reduce((m, c) => m + c.cards.length, 0), 0);
  const totalLists = board.boards.reduce((n, b) => n + b.columns.length, 0);
  const sa = board.users.find((u) => u.role === 'Superadmin');

  // Access Control check for Superadmin / Owner
  if (!me || (me.role !== 'Superadmin' && me.role !== 'Owner')) {
    return (
      <>
        <PageHeader title="Admin Panel" subtitle="Akses Ditolak" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255, 107, 107, 0.08)', border: '1px solid rgba(255, 107, 107, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
            🔒
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Akses Terbatas</h3>
            <p style={{ fontSize: 12, color: '#666', marginTop: 6, maxWidth: 300, lineHeight: 1.5 }}>
              Anda login sebagai <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{me ? me.name : 'Tamu'}</span> dengan peran <span style={{ color: '#fff', fontWeight: 700 }}>{me ? me.role : 'None'}</span>. Halaman ini hanya dapat diakses oleh peran <strong>Owner</strong> atau <strong>Superadmin</strong>.
            </p>
          </div>
          <a href="/app" style={{
            background: 'var(--accent)',
            color: '#0E0E0E',
            fontWeight: 800,
            fontSize: 12,
            padding: '8px 20px',
            borderRadius: 10,
            textDecoration: 'none',
            marginTop: 10,
            boxShadow: '0 4px 15px rgba(170,255,0,0.15)'
          }}>
            Kembali ke Papan Kerja
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Admin Panel"
        subtitle="Superadmin · kontrol platform (pemilik software)"
        right={sa ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#3a1a2a', borderRadius: 20, padding: '5px 12px' }}>
            <UserAvatar id={sa.id} size={22} ring="#3a1a2a" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#FF6BAA' }}>{sa.name}</span>
          </div>
        ) : undefined}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Stat label="Total board" value={board.boards.length} />
          <Stat label="Total list" value={totalLists} />
          <Stat label="Total kartu" value={totalCards} />
          <Stat label="Total user" value={board.users.length} />
        </div>

        {/* Users */}
        <div style={{ background: '#141414', border: '1px solid #1F1F1F', borderRadius: 16, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#ddd', marginBottom: 14 }}>Semua user</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {board.users.map((u) => {
              const rs = roleStyle(u.role);
              return (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#0E0E0E', border: '1px solid #1F1F1F', borderRadius: 10, padding: '8px 12px' }}>
                  <UserAvatar id={u.id} size={30} ring="#0E0E0E" />
                  <span style={{ fontSize: 13, color: '#fff', fontWeight: 600, flex: 1 }}>{u.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: rs.color, background: rs.bg, borderRadius: 8, padding: '3px 10px' }}>{u.role}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Boards */}
        <div style={{ background: '#141414', border: '1px solid #1F1F1F', borderRadius: 16, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#ddd', marginBottom: 14 }}>Semua board</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {board.boards.map((b) => {
              const cards = b.columns.reduce((n, c) => n + c.cards.length, 0);
              return (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#0E0E0E', border: '1px solid #1F1F1F', borderRadius: 10, padding: '8px 12px' }}>
                  <span style={{ width: 28, height: 18, borderRadius: 5, background: b.color, flex: 'none' }} />
                  <span style={{ fontSize: 13, color: '#fff', fontWeight: 600, flex: 1 }}>{b.name}</span>
                  <span style={{ fontSize: 11, color: '#666' }}>{b.columns.length} list · {cards} kartu</span>
                  {b.id === board.activeId && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-dark)', borderRadius: 8, padding: '2px 8px' }}>AKTIF</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ fontSize: 11, color: '#555', textAlign: 'center', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          {Ic.alert('#555', 13)}
          <span>Panel ini masih UI/kosmetik. Kontrol superadmin beneran (lihat semua akun lintas-organisasi, suspend user, dll) aktif setelah ada backend + login.</span>
        </div>
      </div>
    </>
  );
}
