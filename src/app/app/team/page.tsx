'use client';

import React, { useRef, useState } from 'react';
import { useBoard, type Role } from '@/lib/boardStore';
import { UserAvatar, PageHeader } from '@/components/ui';

const ROLES: Role[] = ['Superadmin', 'Owner', 'Manager', 'Member'];
const roleStyle = (r: Role) =>
  r === 'Superadmin' ? { color: '#FF6BAA', bg: '#3a1a2a' }
    : r === 'Owner' ? { color: 'var(--accent)', bg: 'var(--accent-dark)' }
    : r === 'Manager' ? { color: '#4A90FF', bg: '#0a1a3a' }
    : { color: '#888', bg: '#1C1C1C' };

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function TeamPage() {
  const board = useBoard();
  const all = board.columns.flatMap((c) => c.cards);
  const fileFor = useRef<Record<string, HTMLInputElement | null>>({});

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('Member');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState('');

  const submitAdd = () => {
    const v = name.trim();
    if (v) { board.addUser(v, role); setName(''); setRole('Member'); setAdding(false); }
    else setAdding(false);
  };

  const upload = async (id: string, file?: File) => {
    if (!file) return;
    try { board.editUser(id, { avatar: await readImage(file) }); } catch { /* ignore */ }
  };

  return (
    <>
      <PageHeader
        title="Team & Akun"
        subtitle={`${board.users.length} anggota · kelola user, role & foto profil`}
        right={<button onClick={() => setAdding(true)} style={{ background: 'var(--accent)', borderRadius: 11, padding: '8px 16px', cursor: 'pointer', border: 'none', fontSize: 12, fontWeight: 700, color: '#0E0E0E' }}>+ Tambah user</button>}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, alignContent: 'start' }}>
        {adding && (
          <div style={{ background: '#141414', border: '1px solid #242424', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submitAdd(); if (e.key === 'Escape') setAdding(false); }} placeholder="Nama lengkap user..."
              style={{ background: '#0E0E0E', border: '1px solid #262626', borderRadius: 8, padding: '8px 10px', color: '#ddd', fontSize: 13, outline: 'none' }} />
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} style={{ background: '#0E0E0E', border: '1px solid #262626', borderRadius: 8, padding: '8px 10px', color: '#ddd', fontSize: 13, outline: 'none' }}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={submitAdd} style={{ background: 'var(--accent)', color: '#0E0E0E', fontWeight: 700, fontSize: 12, border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}>Tambah</button>
              <button onClick={() => { setName(''); setAdding(false); }} style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer', fontSize: 12 }}>Batal</button>
            </div>
          </div>
        )}

        {board.users.map((u) => {
          const count = all.filter((c) => c.members.includes(u.id)).length;
          const rs = roleStyle(u.role);
          return (
            <div key={u.id} style={{ background: '#141414', border: '1px solid #1F1F1F', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ position: 'relative', flex: 'none' }}>
                  <UserAvatar id={u.id} size={48} ring="#141414" />
                  <button onClick={() => fileFor.current[u.id]?.click()} title="Ganti foto" style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', border: '2px solid #141414', cursor: 'pointer', fontSize: 10, color: '#0E0E0E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✎</button>
                  <input ref={(el) => { fileFor.current[u.id] = el; }} type="file" accept="image/*" hidden onChange={(e) => upload(u.id, e.target.files?.[0])} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  {editingId === u.id ? (
                    <input autoFocus value={nameDraft} onChange={(e) => setNameDraft(e.target.value)}
                      onBlur={() => { const v = nameDraft.trim(); if (v) board.editUser(u.id, { name: v }); setEditingId(null); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { const v = nameDraft.trim(); if (v) board.editUser(u.id, { name: v }); setEditingId(null); } if (e.key === 'Escape') setEditingId(null); }}
                      style={{ width: '100%', background: '#0E0E0E', border: '1px solid #333', borderRadius: 8, padding: '5px 8px', color: '#fff', fontSize: 14, fontWeight: 700, outline: 'none' }} />
                  ) : (
                    <div onClick={() => { setEditingId(u.id); setNameDraft(u.name); }} style={{ fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'text' }}>{u.name}</div>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 4 }}>{count} kartu ditugaskan</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <select value={u.role} onChange={(e) => board.editUser(u.id, { role: e.target.value as Role })}
                  style={{ background: rs.bg, color: rs.color, border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
                  {ROLES.map((r) => <option key={r} value={r} style={{ background: '#1C1C1C', color: '#ddd' }}>{r}</option>)}
                </select>
                {u.avatar && <button onClick={() => board.editUser(u.id, { avatar: undefined })} style={{ fontSize: 11, color: '#888', background: '#1C1C1C', border: '1px solid #2A2A2A', borderRadius: 8, padding: '5px 10px', cursor: 'pointer' }}>Hapus foto</button>}
                <div style={{ flex: 1 }} />
                {board.users.length > 1 && u.role !== 'Owner' && u.role !== 'Superadmin' && (
                  <button onClick={() => { if (confirm(`Hapus user ${u.name}? Akan dilepas dari semua kartu.`)) board.deleteUser(u.id); }} style={{ fontSize: 11, color: '#FF6B6B', background: 'rgba(255,107,107,.08)', border: '1px solid rgba(255,107,107,.25)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer' }}>Hapus</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
