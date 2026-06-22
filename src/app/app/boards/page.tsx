'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBoard } from '@/lib/boardStore';
import { PageHeader } from '@/components/ui';

export default function BoardsPage() {
  const board = useBoard();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');

  const open = (id: string) => { board.setActive(id); router.push('/app'); };

  const submitAdd = () => {
    const v = name.trim();
    if (v) { board.addBoard(v); setName(''); setAdding(false); router.push('/app'); }
    else setAdding(false);
  };

  return (
    <>
      <PageHeader
        title="Boards"
        subtitle={`${board.boards.length} board di workspace Product Design`}
        right={
          <button onClick={() => setAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent)', borderRadius: 11, padding: '8px 16px', cursor: 'pointer', border: 'none', fontSize: 12, fontWeight: 700, color: '#0E0E0E' }}>+ Board baru</button>
        }
      />
      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, alignContent: 'start' }}>
        {board.boards.map((b) => {
          const cards = b.columns.reduce((n, c) => n + c.cards.length, 0);
          const active = b.id === board.activeId;
          return (
            <div key={b.id} style={{ background: '#141414', border: `1px solid ${active ? 'var(--accent)' : '#1F1F1F'}`, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
              <div onClick={() => open(b.id)} style={{ height: 90, background: b.color, cursor: 'pointer' }} />
              <div style={{ padding: 14 }}>
                {renamingId === b.id ? (
                  <input autoFocus value={renameDraft} onChange={(e) => setRenameDraft(e.target.value)}
                    onBlur={() => { const v = renameDraft.trim(); if (v) board.renameBoard(b.id, v); setRenamingId(null); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { const v = renameDraft.trim(); if (v) board.renameBoard(b.id, v); setRenamingId(null); } if (e.key === 'Escape') setRenamingId(null); }}
                    style={{ width: '100%', background: '#0E0E0E', border: '1px solid #333', borderRadius: 8, padding: '6px 8px', color: '#fff', fontSize: 14, fontWeight: 700, outline: 'none' }} />
                ) : (
                  <div onClick={() => open(b.id)} style={{ fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {b.name}
                    {active && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-dark)', borderRadius: 10, padding: '2px 7px' }}>AKTIF</span>}
                  </div>
                )}
                <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{b.columns.length} list · {cards} kartu</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => { setRenamingId(b.id); setRenameDraft(b.name); }} style={{ fontSize: 11, color: '#888', background: '#1C1C1C', border: '1px solid #2A2A2A', borderRadius: 8, padding: '5px 10px', cursor: 'pointer' }}>Rename</button>
                  {board.boards.length > 1 && (
                    <button onClick={() => { if (confirm(`Hapus board "${b.name}"?`)) board.deleteBoard(b.id); }} style={{ fontSize: 11, color: '#FF6B6B', background: 'rgba(255,107,107,.08)', border: '1px solid rgba(255,107,107,.25)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer' }}>Hapus</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {adding ? (
          <div style={{ background: '#141414', border: '1px solid #242424', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 150, justifyContent: 'center' }}>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submitAdd(); if (e.key === 'Escape') { setName(''); setAdding(false); } }}
              placeholder="Nama board baru..." style={{ background: '#0E0E0E', border: '1px solid #262626', borderRadius: 8, padding: '8px 10px', color: '#ddd', fontSize: 13, outline: 'none' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={submitAdd} style={{ background: 'var(--accent)', color: '#0E0E0E', fontWeight: 700, fontSize: 12, border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}>Buat</button>
              <button onClick={() => { setName(''); setAdding(false); }} style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer', fontSize: 12 }}>Batal</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} style={{ background: 'transparent', border: '1px dashed #222', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 150, color: '#444', fontSize: 13, cursor: 'pointer' }}>+ Board baru</button>
        )}
      </div>
    </>
  );
}
