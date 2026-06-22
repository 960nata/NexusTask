'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useBoard } from '@/lib/boardStore';
import { UserAvatar, Ic } from './ui';

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const board = useBoard();
  const me = board.users.find((u) => u.role === 'Owner') || board.users.find((u) => u.role === 'Superadmin') || board.users[0];
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [board.chat.length]);

  const send = () => {
    const v = text.trim(); if (!v || !me) return;
    board.pushChat(me.id, v); setText('');
  };

  const fmt = (ts: number) => new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 65, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.4)' }} />
      <div style={{ position: 'relative', width: 360, maxWidth: '90vw', height: '100%', background: '#141414', borderLeft: '1px solid #242424', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 40px rgba(0,0,0,.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid #1F1F1F', flex: 'none' }}>
          {Ic.chat('var(--accent)', 17)}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Team Chat</div>
            <div style={{ fontSize: 10, color: '#666' }}>{board.users.length} anggota</div>
          </div>
          {board.chat.length > 0 && <button onClick={() => board.clearChat()} style={{ fontSize: 10, color: '#888', background: 'transparent', border: 'none', cursor: 'pointer' }}>Bersihkan</button>}
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, background: '#1C1C1C', border: '1px solid #262626', color: '#888', cursor: 'pointer', fontSize: 15, flex: 'none' }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {board.chat.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: '#555', fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>{Ic.chat('#3a3a3a', 28)}<span>Belum ada pesan.<br />Mulai obrolan tim di sini.</span></div>
          ) : (
            board.chat.map((m) => {
              const mine = m.author === me?.id;
              const u = board.userById(m.author);
              return (
                <div key={m.id} style={{ display: 'flex', gap: 8, flexDirection: mine ? 'row-reverse' : 'row' }}>
                  <UserAvatar id={m.author} size={26} ring="#141414" />
                  <div style={{ maxWidth: '75%' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#bbb' }}>{u?.name ?? m.author}</span>
                      <span style={{ fontSize: 9, color: '#555' }}>{fmt(m.ts)}</span>
                    </div>
                    <div style={{ fontSize: 13, color: mine ? '#0E0E0E' : '#ddd', background: mine ? 'var(--accent)' : '#1C1C1C', border: mine ? 'none' : '1px solid #262626', borderRadius: 12, padding: '8px 11px', lineHeight: 1.4 }}>{m.text}</div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>

        <div style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #1F1F1F', flex: 'none' }}>
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Tulis pesan..."
            style={{ flex: 1, background: '#0E0E0E', border: '1px solid #262626', borderRadius: 10, padding: '9px 12px', color: '#ddd', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
          <button onClick={send} style={{ background: 'var(--accent)', color: '#0E0E0E', border: 'none', borderRadius: 10, padding: '0 16px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Kirim</button>
        </div>
      </div>
    </div>
  );
}
