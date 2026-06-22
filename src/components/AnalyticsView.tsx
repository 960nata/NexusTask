'use client';

import React, { useMemo } from 'react';
import { useBoard, isDoneCol } from '@/lib/boardStore';
import { UserAvatar, PageHeader } from './ui';

function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div style={{ background: '#141414', border: '1px solid #1F1F1F', borderRadius: 16, padding: 18, flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>{label}</div>
    </div>
  );
}

export default function AnalyticsView() {
  const board = useBoard();

  const data = useMemo(() => {
    const allCards = board.columns.flatMap((c) => c.cards);
    const total = allCards.length;
    const done = board.columns.filter((c) => isDoneCol(c.name)).reduce((n, c) => n + c.cards.length, 0);
    const withProgress = allCards.filter((c) => typeof c.progress === 'number');
    const avgProgress = withProgress.length ? Math.round(withProgress.reduce((n, c) => n + (c.progress || 0), 0) / withProgress.length) : 0;
    const completionRate = total ? Math.round((done / total) * 100) : 0;

    const perColumn = board.columns.map((c) => ({ name: c.name, count: c.cards.length, dot: c.dot }));
    const maxCol = Math.max(1, ...perColumn.map((c) => c.count));

    const perMember = board.users.map((u) => ({ m: u.id, count: allCards.filter((c) => c.members.includes(u.id)).length }));
    const maxMember = Math.max(1, ...perMember.map((x) => x.count));

    return { total, done, avgProgress, completionRate, perColumn, maxCol, perMember, maxMember };
  }, [board.columns, board.users]);

  return (
    <>
      <PageHeader title="Analytics" subtitle="Ringkasan performa Sprint Board (otomatis dari data board)" />

      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* KPI row */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <StatCard label="Total kartu" value={data.total} accent="#fff" />
          <StatCard label="Selesai (Done)" value={data.done} accent="var(--accent)" />
          <StatCard label="Completion rate" value={`${data.completionRate}%`} accent="#4A90FF" />
          <StatCard label="Rata-rata progress" value={`${data.avgProgress}%`} accent="#FFB84A" />
        </div>

        {/* Per column */}
        <div style={{ background: '#141414', border: '1px solid #1F1F1F', borderRadius: 16, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#ddd', marginBottom: 16 }}>Kartu per kolom</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.perColumn.map((c) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 90, display: 'flex', alignItems: 'center', gap: 6, flex: 'none' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.dot.bg, border: `2px solid ${c.dot.border}` }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#777', letterSpacing: '.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                </div>
                <div style={{ flex: 1, height: 10, background: '#0E0E0E', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(c.count / data.maxCol) * 100}%`, background: 'linear-gradient(90deg,#4A90FF,#7AB8FF)', borderRadius: 6, transition: 'width .3s' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', width: 24, textAlign: 'right', flex: 'none' }}>{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Per member */}
        <div style={{ background: '#141414', border: '1px solid #1F1F1F', borderRadius: 16, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#ddd', marginBottom: 16 }}>Beban per anggota</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.perMember.map(({ m, count }) => (
              <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <UserAvatar id={m} size={26} ring="#141414" />
                <div style={{ flex: 1, height: 10, background: '#0E0E0E', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(count / data.maxMember) * 100}%`, background: 'var(--accent)', borderRadius: 6, transition: 'width .3s' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', width: 24, textAlign: 'right', flex: 'none' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
