'use client';

import { useEffect } from 'react';
import { useBoard, THEMES } from '@/lib/boardStore';

/** Applies the selected accent theme as CSS variables on <html>. */
export default function ThemeApplier() {
  const { theme } = useBoard();
  useEffect(() => {
    const t = THEMES[theme] ?? THEMES.lime;
    const root = document.documentElement;
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-dark', t.dark);
  }, [theme]);
  return null;
}
