'use client';

import React, { useMemo, useState } from 'react';
import { useBoard, parseDue, isDoneCol, type Card } from '@/lib/boardStore';
import { Ic, LABEL_TONES, PageHeader } from './ui';

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DOW = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

type Dated = { card: Card; date: Date; colName: string };

export default function CalendarView() {
  const board = useBoard();
  // Sprint lives in June 2025 — start there.
  const [cursor, setCursor] = useState(new Date(2025, 5, 1));

  const dated: Dated[] = useMemo(() => {
    const out: Dated[] = [];
    for (const col of board.columns) {
      for (const card of col.cards) {
        const d = parseDue(card.due);
        if (d) out.push({ card, date: d, colName: col.name });
      }
    }
    return out;
  }, [board.columns]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  // Monday-first offset
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const cardsOn = (day: number) =>
    dated.filter((x) => x.date.getFullYear() === year && x.date.getMonth() === month && x.date.getDate() === day);

  const withDue = dated.filter((x) => x.date.getMonth() === month && x.date.getFullYear() === year).length;

  return (
    <>
      <PageHeader
        title="Calendar"
        subtitle={`${withDue} kartu dengan due date di ${MONTHS[month]} ${year}`}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setCursor(new Date(year, month - 1, 1))} style={navBtn}>‹</button>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', minWidth: 130, textAlign: 'center' }}>{MONTHS[month]} {year}</span>
            <button onClick={() => setCursor(new Date(year, month + 1, 1))} style={navBtn}>›</button>
          </div>
        }
      />

      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8, marginBottom: 8 }}>
          {DOW.map((d) => (<div key={d} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#555', textAlign: 'center' }}>{d.toUpperCase()}</div>))}
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gridAutoRows: '1fr', gap: 8 }}>
          {cells.map((day, i) => (
            <div key={i} style={{ background: day ? '#141414' : 'transparent', border: day ? '1px solid #1F1F1F' : '1px solid transparent', borderRadius: 12, padding: 8, minHeight: 96, display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden' }}>
              {day && <span style={{ fontSize: 11, fontWeight: 700, color: '#666' }}>{day}</span>}
              {day && cardsOn(day).map(({ card, colName }) => {
                const tone = LABEL_TONES[card.labels[0]] || { text: '#888', bg: '#222' };
                const done = isDoneCol(colName);
                return (
                  <div key={card.id} title={card.title} style={{ display: 'flex', alignItems: 'center', gap: 5, background: done ? '#181818' : tone.bg, borderRadius: 6, padding: '3px 6px', opacity: done ? 0.6 : 1 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: done ? '#555' : tone.text, flex: 'none' }} />
                    <span style={{ fontSize: 9.5, color: done ? '#777' : '#ddd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.title}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {withDue === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#444', fontSize: 13, padding: 30 }}>
            {Ic.calendar('#444')} Belum ada kartu dengan due date di bulan ini.
          </div>
        )}
      </div>
    </>
  );
}

const navBtn: React.CSSProperties = { width: 30, height: 30, borderRadius: 8, background: '#1A1A1A', border: '1px solid #222', color: '#888', cursor: 'pointer', fontSize: 16, lineHeight: '1' };
