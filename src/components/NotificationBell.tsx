'use client';

import React, { useMemo, useState } from 'react';
import { useBoard, parseDue, type NotifKind } from '@/lib/boardStore';
import { Ic } from './ui';

// Reference "today" matches the board's sprint context (21 Jun 2025).
const TODAY = new Date(2025, 5, 21);
const DAY = 86400000;

const kindIcon = (k: NotifKind) => {
  switch (k) {
    case 'card': return Ic.cardNew('#888');
    case 'move': return Ic.arrowRight('#4A90FF');
    case 'user': return Ic.team('#56cc6a');
    case 'comment': return Ic.chat('#B44AFF', 14);
    case 'ai': return Ic.sparkles('var(--accent)');
  }
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'baru saja';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} mnt lalu`;
  if (diff < DAY) return `${Math.floor(diff / 3600000)} jam lalu`;
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export default function NotificationBell() {
  const board = useBoard();
  const [open, setOpen] = useState(false);

  // Derived due-date alerts from the active board's cards
  const due = useMemo(() => {
    const out: { id: string; title: string; col: string; date: Date; overdue: boolean }[] = [];
    for (const col of board.columns) {
      if (col.name.toLowerCase().includes('done') || col.name.includes('✅')) continue;
      for (const card of col.cards) {
        const d = parseDue(card.due);
        if (!d) continue;
        const days = Math.floor((d.getTime() - TODAY.getTime()) / DAY);
        if (days <= 3) out.push({ id: card.id, title: card.title, col: col.name, date: d, overdue: days < 0 });
      }
    }
    return out.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [board.columns]);

  const unread = board.notifications.filter((n) => !n.read).length;
  const badge = unread + due.length;

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unread) board.markNotifsRead();
  };

  return (
    <div style={{ position: 'relative', flex: 'none' }}>
      <button onClick={toggle} title="Notifikasi"
        style={{ width: 34, height: 34, background: open ? 'var(--accent-dark)' : '#1A1A1A', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `1px solid ${open ? 'var(--accent)' : '#222'}`, position: 'relative' }}>
        {Ic.bell(open ? 'var(--accent)' : '#888')}
        {badge > 0 && (
          <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 16, height: 16, background: '#FF6B6B', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: 8, padding: '0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0E0E0E' }}>{badge > 9 ? '9+' : badge}</span>
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
          <div style={{ position: 'absolute', top: 44, right: 0, width: 320, maxHeight: 440, overflow: 'auto', background: '#161616', border: '1px solid #262626', borderRadius: 14, zIndex: 60, boxShadow: '0 14px 40px rgba(0,0,0,.55)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid #1F1F1F', position: 'sticky', top: 0, background: '#161616' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Notifikasi</span>
              {board.notifications.length > 0 && (
                <button onClick={() => board.clearNotifs()} style={{ fontSize: 10, color: '#888', background: 'transparent', border: 'none', cursor: 'pointer' }}>Bersihkan</button>
              )}
            </div>

            {/* Due alerts */}
            {due.length > 0 && (
              <div style={{ padding: '10px 14px 4px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#FFB84A', marginBottom: 8 }}>JATUH TEMPO</div>
                {due.map((d) => (
                  <div key={d.id} style={{ display: 'flex', gap: 9, padding: '7px 0', alignItems: 'flex-start' }}>
                    <span style={{ marginTop: 1, flex: 'none' }}>{d.overdue ? Ic.alert('#FF6B6B') : Ic.clock('#FFB84A')}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 12, color: '#ddd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</div>
                      <div style={{ fontSize: 10, color: d.overdue ? '#FF6B6B' : '#888', marginTop: 2 }}>
                        {d.overdue ? 'Lewat tenggat' : 'Segera'} · {d.date.getDate()} {['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][d.date.getMonth()]} · {d.col}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Activity log */}
            <div style={{ padding: '10px 14px 12px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#555', marginBottom: 8 }}>AKTIVITAS</div>
              {board.notifications.length === 0 ? (
                <div style={{ fontSize: 12, color: '#555', padding: '8px 0' }}>Belum ada aktivitas.</div>
              ) : (
                board.notifications.map((n) => (
                  <div key={n.id} style={{ display: 'flex', gap: 9, padding: '7px 0', alignItems: 'flex-start' }}>
                    <span style={{ marginTop: 1, flex: 'none' }}>{kindIcon(n.kind)}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 12, color: '#ddd' }}>{n.text}</div>
                      <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{timeAgo(n.ts)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
