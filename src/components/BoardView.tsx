'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useBoard, isDoneCol, ALL_LABELS, type Card, type Column } from '@/lib/boardStore';
import { Ic, UserAvatar, LABEL_TONES } from './ui';
import CardModal from './CardModal';
import NotificationBell from './NotificationBell';
import MeetingModal from './MeetingModal';

/* ── Top header ── */
function TopHeader({ boardName, members, query, setQuery, onAddCard, onMeet, filterLabels, filterMembers, toggleLabel, toggleMember, clearFilters }: {
  boardName: string; members: string[]; query: string; setQuery: (v: string) => void; onAddCard: () => void;
  onMeet: () => void;
  filterLabels: string[]; filterMembers: string[];
  toggleLabel: (l: string) => void; toggleMember: (m: string) => void; clearFilters: () => void;
}) {
  const [open, setOpen] = useState(false);
  const activeCount = filterLabels.length + filterMembers.length;
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 14, borderBottom: '1px solid #1A1A1A', background: '#0E0E0E', flex: 'none', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
        <span style={{ color: '#444', fontSize: 13 }}>Workspace</span>
        <span style={{ color: '#2A2A2A', fontSize: 13 }}>/</span>
        <span style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>Product Design</span>
        <span style={{ color: '#2A2A2A', fontSize: 13 }}>/</span>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{boardName}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1A1A1A', borderRadius: 12, padding: '8px 14px', width: 200, border: '1px solid #222', flex: 'none' }}>
        {Ic.search}
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search cards..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#ddd', fontSize: 12, width: '100%' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
        <button onClick={onMeet} title="Mulai meeting" style={{ width: 34, height: 34, background: '#1A1A1A', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #222' }}>{Ic.video('#888')}</button>
        <NotificationBell />
        <button onClick={() => setOpen((v) => !v)} title="Filter" style={{ width: 34, height: 34, background: activeCount ? 'var(--accent-dark)' : '#1A1A1A', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `1px solid ${activeCount ? 'var(--accent)' : '#222'}`, position: 'relative' }}>
          {Ic.filter(activeCount ? 'var(--accent)' : '#555')}
          {activeCount > 0 && <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--accent)', color: '#0E0E0E', fontSize: 9, fontWeight: 800, borderRadius: 8, padding: '1px 5px' }}>{activeCount}</span>}
        </button>
        <button onClick={onAddCard} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent)', borderRadius: 11, padding: '8px 16px', cursor: 'pointer', flex: 'none', border: 'none' }}>
          {Ic.plusDark}<span style={{ fontSize: 12, fontWeight: 700, color: '#0E0E0E' }}>Add Card</span>
        </button>
      </div>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
          <div style={{ position: 'absolute', top: 56, right: 20, width: 240, background: '#161616', border: '1px solid #262626', borderRadius: 14, padding: 14, zIndex: 40, boxShadow: '0 10px 30px rgba(0,0,0,.5)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#555', marginBottom: 8 }}>LABEL</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {ALL_LABELS.map((l) => {
                const on = filterLabels.includes(l);
                const tone = LABEL_TONES[l] || { text: '#888', bg: '#222' };
                return <button key={l} onClick={() => toggleLabel(l)} style={{ fontSize: 10, fontWeight: 600, borderRadius: 6, padding: '3px 9px', cursor: 'pointer', border: on ? '1px solid var(--accent)' : '1px solid transparent', color: tone.text, background: tone.bg }}>{l}</button>;
              })}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#555', marginBottom: 8 }}>ANGGOTA</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {members.map((m) => {
                const on = filterMembers.includes(m);
                return <button key={m} onClick={() => toggleMember(m)} style={{ borderRadius: '50%', border: on ? '2px solid var(--accent)' : '2px solid transparent', padding: 0, background: 'transparent', cursor: 'pointer' }}><UserAvatar id={m} size={26} ring="#161616" /></button>;
              })}
            </div>
            {activeCount > 0 && <button onClick={clearFilters} style={{ width: '100%', fontSize: 11, fontWeight: 600, color: '#FF6B6B', background: 'rgba(255,107,107,.08)', border: '1px solid rgba(255,107,107,.25)', borderRadius: 8, padding: '6px', cursor: 'pointer' }}>Reset filter</button>}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Sub header ── */
function SubHeader({ boardName, members, total, inProgress, done, donePct, view, setView }: { boardName: string; members: string[]; total: number; inProgress: number; done: number; donePct: number; view: 'board' | 'list'; setView: (v: 'board' | 'list') => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', gap: 16, borderBottom: '1px solid #1A1A1A', background: '#0E0E0E', flex: 'none' }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{boardName}</h1>
        <p style={{ fontSize: 11, color: '#444', marginTop: 1 }}>Q2 2025 · 21 Jun 2025</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--accent-dark)', borderRadius: 20, padding: '5px 12px' }}>
          <div style={{ width: 5, height: 5, background: 'var(--accent)', borderRadius: '50%' }} /><span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>{total} Cards</span>
        </div>
        <div style={{ background: '#1C1C1C', borderRadius: 20, padding: '5px 12px' }}><span style={{ fontSize: 11, color: '#666' }}>{inProgress} In Progress</span></div>
        <div style={{ background: '#1C1C1C', borderRadius: 20, padding: '5px 12px' }}><span style={{ fontSize: 11, color: '#666' }}>{done} Done</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1C1C1C', borderRadius: 20, padding: '5px 12px' }}>
          <div style={{ width: 54, height: 5, background: '#0E0E0E', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${donePct}%`, background: 'var(--accent)', borderRadius: 3, transition: 'width .3s' }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>{donePct}%</span>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {members.slice(0, 5).map((m, i) => (<UserAvatar key={m} id={m} overlap={i > 0} />))}
        {members.length > 5 && (
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1C1C1C', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0E0E0E', marginLeft: -6, cursor: 'pointer', flex: 'none' }}><span style={{ fontSize: 9, fontWeight: 600, color: '#666' }}>+{members.length - 5}</span></div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', background: '#1A1A1A', borderRadius: 10, padding: 3, gap: 2, border: '1px solid #222', flex: 'none' }}>
        <button onClick={() => setView('board')} style={{ padding: '5px 10px', background: view === 'board' ? 'var(--accent)' : 'transparent', borderRadius: 7, cursor: 'pointer', border: 'none' }}>{Ic.viewBoard(view === 'board' ? '#0E0E0E' : '#555')}</button>
        <button onClick={() => setView('list')} style={{ padding: '5px 10px', background: view === 'list' ? 'var(--accent)' : 'transparent', borderRadius: 7, cursor: 'pointer', border: 'none' }}>{Ic.viewList(view === 'list' ? '#0E0E0E' : '#555')}</button>
      </div>
    </div>
  );
}

/* ── Card ── */
function CardView({ card, dim, onOpen, onDelete, onDragStart, onDragOverCard }: {
  card: Card; dim: boolean; onOpen: () => void; onDelete: () => void; onDragStart: () => void; onDragOverCard: (e: React.DragEvent) => void;
}) {
  const lime = !!card.featured && !dim;
  const bg = lime ? 'var(--accent)' : dim ? '#141414' : '#191919';
  const border = lime ? 'none' : `1px solid ${dim ? '#1D1D21' : '#242424'}`;
  const titleColor = lime ? '#0E0E0E' : dim ? '#777' : '#fff';
  const metaColor = lime ? 'var(--accent-dark)' : dim ? '#555' : '#444';
  const checks = card.checklist || [];
  const checkDone = checks.filter((c) => c.done).length;

  return (
    <div className="group" draggable onDragStart={onDragStart} onDragOver={onDragOverCard} onClick={onOpen}
      style={{ background: bg, borderRadius: 16, padding: 14, cursor: 'pointer', border, opacity: dim ? 0.6 : 1, position: 'relative' }}>
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="opacity-0 group-hover:opacity-100" title="Delete card"
        style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 6, border: 'none', cursor: 'pointer', background: lime ? 'rgba(0,0,0,.15)' : '#0E0E0E', color: lime ? '#0E0E0E' : '#888', fontSize: 12, lineHeight: '16px', transition: 'opacity .15s' }}>×</button>

      {card.labels.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
          {card.labels.map((l) => {
            const tone = LABEL_TONES[l] || { text: '#777', bg: '#222' };
            const style = lime ? { color: 'var(--accent-dark)', background: 'rgba(0,0,0,.12)' } : dim ? { color: '#555', background: '#181818' } : { color: tone.text, background: tone.bg };
            return <span key={l} style={{ fontSize: 10, fontWeight: 600, borderRadius: 6, padding: '2px 8px', ...style }}>{l}</span>;
          })}
        </div>
      )}

      <p style={{ fontSize: 12.5, fontWeight: lime ? 700 : 600, color: titleColor, margin: '0 0 10px', lineHeight: 1.45 }}>{card.title}</p>

      {typeof card.progress === 'number' && (
        <div style={{ height: 2, background: lime ? 'rgba(0,0,0,.18)' : '#222', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${card.progress}%`, background: lime ? '#0E0E0E' : 'linear-gradient(90deg,#4A90FF,#7AB8FF)', borderRadius: 2 }} />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {card.due && Ic.calSmall(metaColor)}
        {card.due && <span style={{ fontSize: 10, color: metaColor, fontWeight: lime ? 600 : 400 }}>{card.due}</span>}
        {checks.length > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: metaColor, fontWeight: 600 }}>{Ic.check(metaColor)}{checkDone}/{checks.length}</span>}
        {card.comments && card.comments.length > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: metaColor, fontWeight: 600 }}>{Ic.chat(metaColor, 11)}{card.comments.length}</span>}
        <span style={{ flex: 1 }} />
        {typeof card.progress === 'number' && <span style={{ fontSize: 10, color: metaColor, fontWeight: 700 }}>{card.progress}%</span>}
        {card.members.map((m) => (<UserAvatar key={m} id={m} size={22} ring={lime ? 'var(--accent)' : dim ? '#141414' : '#191919'} />))}
      </div>
    </div>
  );
}

/* ── Column ── */
function ColumnView({ col, filterCard, dragOver, handlers }: {
  col: Column; filterCard: (c: Card) => boolean; dragOver: boolean;
  handlers: {
    addCard: (t: string) => void; openCard: (id: string) => void; deleteCard: (id: string) => void;
    rename: (n: string) => void; deleteCol: () => void;
    cardDragStart: (id: string) => void; cardDragOver: (id: string) => void; colDragOver: (e: React.DragEvent) => void; colDrop: () => void;
    colDragStart: () => void;
  };
}) {
  const dim = isDoneCol(col.name);
  const colPct = dim
    ? (col.cards.length ? 100 : 0)
    : (col.cards.length ? Math.round(col.cards.reduce((n, c) => n + (c.progress ?? 0), 0) / col.cards.length) : 0);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(col.name);
  const addRef = useRef<HTMLTextAreaElement>(null);

  const visible = col.cards.filter(filterCard);
  const submitAdd = () => { const v = draft.trim(); if (v) { handlers.addCard(v); setDraft(''); addRef.current?.focus(); } else setAdding(false); };

  return (
    <div onDragOver={handlers.colDragOver} onDrop={handlers.colDrop}
      style={{ width: 272, flex: 'none', display: 'flex', flexDirection: 'column', gap: 10, borderRadius: 16, padding: dragOver ? 4 : 0, outline: dragOver ? '1px dashed rgba(170,255,0,.4)' : 'none', background: dragOver ? 'rgba(170,255,0,.03)' : 'transparent', transition: 'background .15s' }}>
      <div draggable={!renaming} onDragStart={(e) => { e.stopPropagation(); handlers.colDragStart(); }} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 2px', marginBottom: 2, cursor: 'grab' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot.bg, border: `2px solid ${col.dot.border}` }} />
        {renaming ? (
          <input autoFocus value={nameDraft} onChange={(e) => setNameDraft(e.target.value)}
            onBlur={() => { const v = nameDraft.trim(); if (v) handlers.rename(v); setRenaming(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { const v = nameDraft.trim(); if (v) handlers.rename(v); setRenaming(false); } if (e.key === 'Escape') { setNameDraft(col.name); setRenaming(false); } }}
            style={{ flex: 1, background: '#1A1A1A', border: '1px solid #333', borderRadius: 6, padding: '2px 6px', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: '#ddd', outline: 'none' }} />
        ) : (
          <span onClick={() => { setNameDraft(col.name); setRenaming(true); }} style={{ fontSize: 11, fontWeight: 700, color: '#666', flex: 1, letterSpacing: '.06em', cursor: 'pointer' }}>{col.name}</span>
        )}
        <span style={{ fontSize: 10, color: '#444', background: '#1A1A1A', borderRadius: 6, padding: '2px 7px', fontWeight: 600 }}>{col.cards.length}</span>
        {col.cards.length > 0 && <span style={{ fontSize: 9, color: 'var(--accent)', fontWeight: 700 }}>{colPct}%</span>}
        <button onClick={() => setAdding(true)} title="Add card" style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 6, background: 'transparent', border: 'none' }}>{Ic.plusMuted}</button>
        <button onClick={handlers.deleteCol} title="Delete list" style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 6, background: 'transparent', border: 'none', color: '#444', fontSize: 14 }}>×</button>
      </div>

      {visible.map((c) => (
        <CardView key={c.id} card={c} dim={dim} onOpen={() => handlers.openCard(c.id)} onDelete={() => handlers.deleteCard(c.id)}
          onDragStart={() => handlers.cardDragStart(c.id)} onDragOverCard={(e) => { e.preventDefault(); handlers.cardDragOver(c.id); }} />
      ))}

      {adding ? (
        <div style={{ background: '#191919', border: '1px solid #242424', borderRadius: 16, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea ref={addRef} autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAdd(); } if (e.key === 'Escape') { setDraft(''); setAdding(false); } }}
            placeholder="Tulis judul kartu, Enter untuk simpan..." rows={2}
            style={{ width: '100%', resize: 'none', background: '#0E0E0E', border: '1px solid #262626', borderRadius: 8, padding: 8, fontSize: 12, color: '#ddd', outline: 'none', fontFamily: 'inherit' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={submitAdd} style={{ background: 'var(--accent)', color: '#0E0E0E', fontWeight: 700, fontSize: 12, border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>Add</button>
            <button onClick={() => { setDraft(''); setAdding(false); }} style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer', fontSize: 12 }}>Batal</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', borderRadius: 16, border: '1px dashed #222', cursor: 'pointer', background: 'transparent', width: '100%' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="#333" strokeWidth="2.5" strokeLinecap="round" /><line x1="5" y1="12" x2="19" y2="12" stroke="#333" strokeWidth="2.5" strokeLinecap="round" /></svg>
          <span style={{ fontSize: 12, color: '#333' }}>Add a card</span>
        </button>
      )}
    </div>
  );
}

/* ── List view ── */
function ListView({ columns, filterCard, onOpen }: { columns: Column[]; filterCard: (c: Card) => boolean; onOpen: (colId: string, cardId: string) => void }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {columns.map((col) => {
        const rows = col.cards.filter(filterCard);
        if (rows.length === 0) return null;
        return (
          <div key={col.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot.bg, border: `2px solid ${col.dot.border}` }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#666', letterSpacing: '.06em' }}>{col.name}</span>
              <span style={{ fontSize: 10, color: '#444', background: '#1A1A1A', borderRadius: 6, padding: '2px 7px', fontWeight: 600 }}>{rows.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {rows.map((c) => (
                <div key={c.id} onClick={() => onOpen(col.id, c.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#141414', border: '1px solid #1F1F1F', borderRadius: 12, padding: '10px 14px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: 5, flex: 'none' }}>
                    {c.labels.map((l) => { const t = LABEL_TONES[l] || { text: '#777', bg: '#222' }; return <span key={l} style={{ fontSize: 9, fontWeight: 600, borderRadius: 5, padding: '2px 6px', color: t.text, background: t.bg }}>{l}</span>; })}
                  </div>
                  <span style={{ fontSize: 13, color: '#ddd', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</span>
                  {c.due && <span style={{ fontSize: 11, color: '#555', flex: 'none' }}>{c.due}</span>}
                  {typeof c.progress === 'number' && <span style={{ fontSize: 11, color: '#666', fontWeight: 700, flex: 'none', width: 34, textAlign: 'right' }}>{c.progress}%</span>}
                  <div style={{ display: 'flex', flex: 'none' }}>{c.members.map((m, i) => <UserAvatar key={m} id={m} size={22} ring="#141414" overlap={i > 0} />)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Root ── */
export default function BoardView() {
  const board = useBoard();
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'board' | 'list'>('board');
  const [filterLabels, setFilterLabels] = useState<string[]>([]);
  const [filterMembers, setFilterMembers] = useState<string[]>([]);
  const [overCol, setOverCol] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ colId: string; cardId: string } | null>(null);
  const [showMeeting, setShowMeeting] = useState(false);

  const drag = useRef<{ cardId: string; fromCol: string } | null>(null);
  const colDrag = useRef<string | null>(null);
  const dropIndex = useRef<{ col: string; index: number } | null>(null);

  const stats = useMemo(() => {
    const total = board.columns.reduce((n, c) => n + c.cards.length, 0);
    const inProgress = board.columns.find((c) => c.name.toLowerCase().includes('progress'))?.cards.length ?? 0;
    const done = board.columns.filter((c) => isDoneCol(c.name)).reduce((n, c) => n + c.cards.length, 0);
    const donePct = total ? Math.round((done / total) * 100) : 0;
    return { total, inProgress, done, donePct };
  }, [board.columns]);

  const q = query.trim().toLowerCase();
  const filterCard = (c: Card) => {
    if (q && !c.title.toLowerCase().includes(q)) return false;
    if (filterLabels.length && !c.labels.some((l) => filterLabels.includes(l))) return false;
    if (filterMembers.length && !c.members.some((m) => filterMembers.includes(m))) return false;
    return true;
  };
  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const memberIds = board.users.map((u) => u.id);

  const onColumnDrop = (toCol: string) => {
    if (colDrag.current) {
      const me = board.me;
      if (!me || (me.role !== 'Superadmin' && me.role !== 'Owner' && me.role !== 'Manager')) {
        board.pushNotif('Hanya Superadmin, Owner, atau Manager yang dapat memindahkan posisi list', 'card');
        colDrag.current = null;
        setOverCol(null);
        return;
      }
      board.moveColumn(colDrag.current, toCol);
      colDrag.current = null;
      setOverCol(null);
      return;
    }
    const d = drag.current;
    if (!d) return;
    const idx = dropIndex.current && dropIndex.current.col === toCol ? dropIndex.current.index : undefined;
    board.moveCard(d.cardId, d.fromCol, toCol, idx);
    drag.current = null; dropIndex.current = null; setOverCol(null);
  };

  // live selected card (re-derived so modal reflects edits)
  const selectedCol = selected ? board.columns.find((c) => c.id === selected.colId) : undefined;
  const selectedCard = selectedCol?.cards.find((c) => c.id === selected!.cardId);

  return (
    <>
      <TopHeader boardName={board.activeBoard?.name ?? 'Board'} members={memberIds} query={query} setQuery={setQuery}
        onAddCard={() => { const f = board.columns[0]; if (f) board.addCard(f.id, 'Kartu baru'); }}
        onMeet={() => setShowMeeting(true)}
        filterLabels={filterLabels} filterMembers={filterMembers}
        toggleLabel={(l) => toggle(filterLabels, setFilterLabels, l)} toggleMember={(m) => toggle(filterMembers, setFilterMembers, m)}
        clearFilters={() => { setFilterLabels([]); setFilterMembers([]); }} />
      <SubHeader boardName={board.activeBoard?.name ?? 'Board'} members={memberIds} total={stats.total} inProgress={stats.inProgress} done={stats.done} donePct={stats.donePct} view={view} setView={setView} />

      {view === 'list' ? (
        <ListView columns={board.columns} filterCard={filterCard} onOpen={(colId, cardId) => setSelected({ colId, cardId })} />
      ) : (
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          {board.columns.map((col) => (
            <ColumnView key={col.id} col={col} filterCard={filterCard} dragOver={overCol === col.id}
              handlers={{
                addCard: (t) => board.addCard(col.id, t),
                openCard: (id) => setSelected({ colId: col.id, cardId: id }),
                deleteCard: (id) => board.deleteCard(col.id, id),
                rename: (n) => {
                  const me = board.me;
                  if (!me || (me.role !== 'Superadmin' && me.role !== 'Owner' && me.role !== 'Manager')) {
                    board.pushNotif('Hanya Superadmin, Owner, atau Manager yang dapat mengubah nama list', 'card');
                    return;
                  }
                  board.renameCol(col.id, n);
                },
                deleteCol: () => {
                  const me = board.me;
                  if (!me || (me.role !== 'Superadmin' && me.role !== 'Owner' && me.role !== 'Manager')) {
                    board.pushNotif('Hanya Superadmin, Owner, atau Manager yang dapat menghapus list', 'card');
                    return;
                  }
                  if (confirm('Hapus list? Semua kartu di dalamnya akan hilang.')) {
                    board.deleteCol(col.id);
                  }
                },
                cardDragStart: (id) => { drag.current = { cardId: id, fromCol: col.id }; colDrag.current = null; },
                cardDragOver: (id) => { const i = col.cards.findIndex((k) => k.id === id); if (i !== -1) dropIndex.current = { col: col.id, index: i }; setOverCol(col.id); },
                colDragStart: () => { colDrag.current = col.id; drag.current = null; },
                colDragOver: (e) => { e.preventDefault(); setOverCol(col.id); if (!colDrag.current && (!dropIndex.current || dropIndex.current.col !== col.id)) dropIndex.current = { col: col.id, index: col.cards.length }; },
                colDrop: () => onColumnDrop(col.id),
              }} />
          ))}
          <button 
            onClick={() => {
              const me = board.me;
              if (!me || (me.role !== 'Superadmin' && me.role !== 'Owner' && me.role !== 'Manager')) {
                board.pushNotif('Hanya Superadmin, Owner, atau Manager yang dapat menambah list', 'card');
                return;
              }
              board.addColumn();
            }}
            style={{ width: 272, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', borderRadius: 16, border: '1px dashed #222', cursor: 'pointer', background: 'transparent', color: '#444' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="#444" strokeWidth="2.5" strokeLinecap="round" /><line x1="5" y1="12" x2="19" y2="12" stroke="#444" strokeWidth="2.5" strokeLinecap="round" /></svg>
            <span style={{ fontSize: 12 }}>Tambah List</span>
          </button>
        </div>
      )}

      {selected && selectedCard && <CardModal colId={selected.colId} card={selectedCard} onClose={() => setSelected(null)} />}
      {showMeeting && <MeetingModal onClose={() => setShowMeeting(false)} />}
    </>
  );
}
