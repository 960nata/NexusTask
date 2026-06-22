'use client';

import React from 'react';
import { useBoard, type NotifKind } from '@/lib/boardStore';
import { Ic } from './ui';

const kindColor = (k: NotifKind) => {
  switch (k) {
    case 'card': return { border: '#333', bg: '#1c1c1e', accent: '#888' };
    case 'move': return { border: 'rgba(74,144,255,0.25)', bg: '#0A1A3A', accent: '#4A90FF' };
    case 'user': return { border: 'rgba(86,204,106,0.25)', bg: '#1A3A2A', accent: '#56cc6a' };
    case 'comment': return { border: 'rgba(180,74,255,0.25)', bg: '#1A0A2E', accent: '#B44AFF' };
    case 'ai': return { border: 'rgba(170,255,0,0.25)', bg: '#1A2E00', accent: 'var(--accent)' };
  }
};

const kindIcon = (k: NotifKind) => {
  switch (k) {
    case 'card': return Ic.cardNew('#888');
    case 'move': return Ic.arrowRight('#4A90FF');
    case 'user': return Ic.team('#56cc6a');
    case 'comment': return Ic.chat('#B44AFF', 14);
    case 'ai': return Ic.sparkles('var(--accent)');
  }
};

export default function ToastContainer() {
  const { toasts } = useBoard();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxWidth: 320,
      pointerEvents: 'none'
    }}>
      {toasts.map((t) => {
        const style = kindColor(t.kind);
        return (
          <div key={t.id} style={{
            background: style.bg,
            border: `1px solid ${style.border}`,
            borderRadius: 14,
            padding: '12px 16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            pointerEvents: 'auto',
            animation: 'toast-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            borderLeft: `4px solid ${style.accent}`
          }}>
            <style>{`
              @keyframes toast-slide-in {
                from {
                  opacity: 0;
                  transform: translateY(20px) scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
            `}</style>
            <span style={{ marginTop: 2, flexShrink: 0 }}>
              {kindIcon(t.kind)}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>
                {t.text}
              </div>
              <div style={{ fontSize: 9, color: '#666', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                {t.kind === 'ai' ? 'Asisten AI' : t.kind === 'move' ? 'Aliran Kerja' : t.kind === 'user' ? 'Tim' : 'Board'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
