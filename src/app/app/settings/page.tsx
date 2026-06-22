'use client';

import React from 'react';
import { useBoard, THEMES, type ThemeKey } from '@/lib/boardStore';
import { PageHeader } from '@/components/ui';

const THEME_LABELS: Record<ThemeKey, string> = { lime: 'Lime', cyan: 'Cyan', blue: 'Blue', purple: 'Purple', orange: 'Orange', pink: 'Pink' };

function Row({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: '#141414', border: '1px solid #1F1F1F', borderRadius: 14, padding: 16 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{title}</div>
        <div style={{ fontSize: 11, color: '#666', marginTop: 3 }}>{desc}</div>
      </div>
      <div style={{ flex: 'none' }}>{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const board = useBoard();

  return (
    <>
      <PageHeader title="Settings" subtitle="Pengaturan board & data" />
      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 640 }}>
        {/* Theme / color palette */}
        <div style={{ background: '#141414', border: '1px solid #1F1F1F', borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Tema warna</div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 3, marginBottom: 14 }}>Pilih warna aksen aplikasi. Tersimpan otomatis.</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {(Object.keys(THEMES) as ThemeKey[]).map((k) => {
              const active = board.theme === k;
              return (
                <button key={k} onClick={() => board.setTheme(k)} title={THEME_LABELS[k]}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: active ? THEMES[k].dark : '#0E0E0E', border: `1px solid ${active ? THEMES[k].accent : '#262626'}`, borderRadius: 10, padding: '8px 12px', cursor: 'pointer' }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: THEMES[k].accent, flex: 'none' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: active ? THEMES[k].accent : '#aaa' }}>{THEME_LABELS[k]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Row title="Workspace" desc="Product Design · Sprint Board">
          <span style={{ fontSize: 11, color: 'var(--accent)', background: 'var(--accent-dark)', borderRadius: 20, padding: '4px 12px', fontWeight: 600 }}>Aktif</span>
        </Row>
        <Row title="Penyimpanan" desc="Data board disimpan otomatis di browser ini (localStorage).">
          <span style={{ fontSize: 11, color: '#666' }}>Local</span>
        </Row>
        <Row title="Reset board" desc="Kembalikan board ke data contoh awal. Semua perubahan kamu akan hilang.">
          <button
            onClick={() => { if (confirm('Reset board ke data awal? Perubahan kamu akan hilang.')) board.reset(); }}
            style={{ fontSize: 12, fontWeight: 700, color: '#FF6B6B', background: 'rgba(255,107,107,.08)', border: '1px solid rgba(255,107,107,.25)', borderRadius: 10, padding: '8px 16px', cursor: 'pointer' }}
          >
            Reset
          </button>
        </Row>
      </div>
    </>
  );
}
