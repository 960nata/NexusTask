'use client';

import React, { useState } from 'react';
import { useBoard, parseDue, formatDue, ALL_LABELS, type Card, type ChecklistItem, type CommentItem } from '@/lib/boardStore';
import { UserAvatar, LABEL_TONES, Ic } from './ui';

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const pad = (n: number) => String(n).padStart(2, '0');

const dueToISO = (due?: string): string => {
  const d = parseDue(due);
  return d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : '';
};
const isoToDue = (iso: string): string | undefined => {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  return formatDue(new Date(y, m - 1, d));
};

const Section = ({ icon, title, children }: { icon?: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
      {icon}
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: '#888', textTransform: 'uppercase' }}>{title}</span>
    </div>
    {children}
  </div>
);

export default function CardModal({ colId, card, onClose }: { colId: string; card: Card; onClose: () => void }) {
  const board = useBoard();
  const patch = (p: Partial<Card>) => board.editCard(colId, card.id, p);

  const [title, setTitle] = useState(card.title);
  const [comment, setComment] = useState('');
  const [newItem, setNewItem] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const me = board.users.find((u) => u.role === 'Owner') || board.users[0];

  const checklist = card.checklist || [];
  const comments = card.comments || [];
  const doneCount = checklist.filter((i) => i.done).length;
  const checkPct = checklist.length ? Math.round((doneCount / checklist.length) * 100) : 0;

  const commitTitle = () => { const v = title.trim(); if (v && v !== card.title) patch({ title: v }); else setTitle(card.title); };

  const toggleLabel = (l: string) =>
    patch({ labels: card.labels.includes(l) ? card.labels.filter((x) => x !== l) : [...card.labels, l] });
  const toggleMember = (m: string) =>
    patch({ members: card.members.includes(m) ? card.members.filter((x) => x !== m) : [...card.members, m] });

  const setChecklist = (items: ChecklistItem[]) => {
    const pct = items.length ? Math.round((items.filter((i) => i.done).length / items.length) * 100) : undefined;
    patch({ checklist: items, progress: pct });
  };
  const addItem = () => { const v = newItem.trim(); if (!v) return; setChecklist([...checklist, { id: uid(), text: v, done: false }]); setNewItem(''); };
  const toggleItem = (id: string) => setChecklist(checklist.map((i) => i.id === id ? { ...i, done: !i.done } : i));
  const delItem = (id: string) => setChecklist(checklist.filter((i) => i.id !== id));

  const addComment = () => {
    const v = comment.trim(); if (!v) return;
    const next: CommentItem[] = [...comments, { id: uid(), author: me?.id ?? 'AR', text: v, ts: Date.now() }];
    patch({ comments: next }); setComment('');
    board.pushNotif(`Komentar baru di "${card.title}"`, 'comment');
  };

  const aiChecklist = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: card.title, description: card.description || '', type: 'checklist' }),
      });
      const data = await res.json();
      if (Array.isArray(data.result)) {
        const items: ChecklistItem[] = data.result.map((t: unknown) => ({ id: uid(), text: String(t), done: false }));
        setChecklist([...checklist, ...items]);
        board.pushNotif(`AI menambah ${items.length} item checklist ke "${card.title}"`, 'ai');
      }
    } catch { /* ignore */ } finally {
      setAiLoading(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(3px)', zIndex: 60, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '6vh 20px', overflow: 'auto' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 720, background: '#141414', border: '1px solid #242424', borderRadius: 18, boxShadow: '0 20px 60px rgba(0,0,0,.6)' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '20px 22px 14px', borderBottom: '1px solid #1F1F1F' }}>
          <textarea
            value={title} onChange={(e) => setTitle(e.target.value)} onBlur={commitTitle}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitTitle(); (e.target as HTMLTextAreaElement).blur(); } }}
            rows={1}
            style={{ flex: 1, resize: 'none', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 18, fontWeight: 800, fontFamily: 'inherit', lineHeight: 1.3 }}
          />
          <button onClick={() => { if (confirm('Hapus kartu ini?')) { board.deleteCard(colId, card.id); onClose(); } }} style={{ fontSize: 11, fontWeight: 600, color: '#FF6B6B', background: 'rgba(255,107,107,.08)', border: '1px solid rgba(255,107,107,.25)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', flex: 'none' }}>Hapus</button>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: '#1C1C1C', border: '1px solid #262626', color: '#888', cursor: 'pointer', fontSize: 16, flex: 'none' }}>×</button>
        </div>

        <div style={{ padding: 22 }}>
          {/* labels */}
          <Section title="Label">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ALL_LABELS.map((l) => {
                const on = card.labels.includes(l);
                const tone = LABEL_TONES[l] || { text: '#888', bg: '#222' };
                return (
                  <button key={l} onClick={() => toggleLabel(l)} style={{ fontSize: 11, fontWeight: 600, borderRadius: 7, padding: '4px 10px', cursor: 'pointer', color: tone.text, background: tone.bg, border: on ? '1px solid var(--accent)' : '1px solid transparent', opacity: on ? 1 : 0.55 }}>{l}</button>
                );
              })}
            </div>
          </Section>

          {/* due + members row */}
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            <Section title="Due date" icon={Ic.calSmall('#888')}>
              <input type="date" value={dueToISO(card.due)} onChange={(e) => patch({ due: isoToDue(e.target.value) })}
                style={{ background: '#0E0E0E', border: '1px solid #262626', borderRadius: 8, padding: '7px 10px', color: '#ddd', fontSize: 12, fontFamily: 'inherit', colorScheme: 'dark' }} />
            </Section>
            <Section title="Anggota">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {board.users.map((u) => {
                  const on = card.members.includes(u.id);
                  return (
                    <button key={u.id} onClick={() => toggleMember(u.id)} title={`${u.name} (${u.role})`} style={{ borderRadius: '50%', border: on ? '2px solid var(--accent)' : '2px solid transparent', padding: 0, background: 'transparent', cursor: 'pointer', opacity: on ? 1 : 0.4 }}>
                      <UserAvatar id={u.id} size={28} ring="#141414" />
                    </button>
                  );
                })}
              </div>
            </Section>
          </div>

          {/* description */}
          <Section title="Deskripsi">
            <textarea
              defaultValue={card.description || ''}
              onBlur={(e) => patch({ description: e.target.value })}
              placeholder="Tambahkan deskripsi lebih detail... (auto-simpan saat klik di luar)"
              rows={3}
              style={{ width: '100%', resize: 'vertical', background: '#0E0E0E', border: '1px solid #262626', borderRadius: 10, padding: 10, color: '#ddd', fontSize: 13, fontFamily: 'inherit', outline: 'none', lineHeight: 1.5 }}
            />
          </Section>

          {/* checklist */}
          <Section title={`Checklist  ·  ${doneCount}/${checklist.length}`}>
            <button onClick={aiChecklist} disabled={aiLoading} title="Generate checklist otomatis dengan AI"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 10, background: 'var(--accent-dark)', color: 'var(--accent)', border: '1px solid #2a4a00', borderRadius: 9, padding: '6px 12px', cursor: aiLoading ? 'wait' : 'pointer', fontSize: 12, fontWeight: 700 }}>
              <span style={{ display: 'inline-flex', animation: aiLoading ? 'spin 0.8s linear infinite' : 'none' }}>{Ic.sparkles('var(--accent)', 14)}</span>
              {aiLoading ? 'Membuat...' : 'Generate dengan AI'}
            </button>
            {checklist.length > 0 && (
              <div style={{ height: 4, background: '#222', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ height: '100%', width: `${checkPct}%`, background: 'var(--accent)', borderRadius: 3, transition: 'width .2s' }} />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
              {checklist.map((i) => (
                <div key={i.id} className="group" style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#0E0E0E', border: '1px solid #1F1F1F', borderRadius: 8, padding: '7px 10px' }}>
                  <button onClick={() => toggleItem(i.id)} style={{ width: 16, height: 16, borderRadius: 5, border: `1.5px solid ${i.done ? 'var(--accent)' : '#444'}`, background: i.done ? 'var(--accent)' : 'transparent', cursor: 'pointer', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0E0E0E', fontSize: 11, fontWeight: 800, lineHeight: 1 }}>{i.done ? '✓' : ''}</button>
                  <span style={{ flex: 1, fontSize: 13, color: i.done ? '#555' : '#ddd', textDecoration: i.done ? 'line-through' : 'none' }}>{i.text}</span>
                  <button onClick={() => delItem(i.id)} className="opacity-0 group-hover:opacity-100" style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14, transition: 'opacity .15s' }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addItem(); }} placeholder="Tambah item checklist..."
                style={{ flex: 1, background: '#0E0E0E', border: '1px solid #262626', borderRadius: 8, padding: '7px 10px', color: '#ddd', fontSize: 12, outline: 'none', fontFamily: 'inherit' }} />
              <button onClick={addItem} style={{ background: '#1C1C1C', border: '1px solid #2A2A2A', color: '#ddd', borderRadius: 8, padding: '0 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Add</button>
            </div>
          </Section>

          {/* comments */}
          <Section title={`Komentar  ·  ${comments.length}`}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <UserAvatar id={me?.id ?? 'AR'} size={28} ring="#141414" />
              <input value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addComment(); }} placeholder="Tulis komentar..."
                style={{ flex: 1, background: '#0E0E0E', border: '1px solid #262626', borderRadius: 8, padding: '7px 10px', color: '#ddd', fontSize: 12, outline: 'none', fontFamily: 'inherit' }} />
              <button onClick={addComment} style={{ background: 'var(--accent)', color: '#0E0E0E', border: 'none', borderRadius: 8, padding: '0 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Kirim</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {comments.slice().reverse().map((c) => (
                <div key={c.id} style={{ display: 'flex', gap: 8 }}>
                  <UserAvatar id={c.author} size={28} ring="#141414" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#ddd' }}>{board.userById(c.author)?.name ?? c.author}</span>
                      <span style={{ fontSize: 10, color: '#555' }}>{new Date(c.ts).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#bbb', marginTop: 3, background: '#0E0E0E', border: '1px solid #1F1F1F', borderRadius: 8, padding: '7px 10px' }}>{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
