'use client';

import React, { useState } from 'react';
import ChatPanel from './ChatPanel';
import { Ic } from './ui';

/** Floating chat button (bottom-right), global across the app. */
export default function ChatFab() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} title="Team chat"
          style={{ position: 'fixed', bottom: 22, right: 22, width: 54, height: 54, borderRadius: '50%', background: 'var(--accent)', border: 'none', cursor: 'pointer', zIndex: 55, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 28px rgba(0,0,0,.45)' }}>
          {Ic.chat('#0E0E0E', 24)}
        </button>
      )}
      {open && <ChatPanel onClose={() => setOpen(false)} />}
    </>
  );
}
