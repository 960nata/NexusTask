'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const BrandMark = ({ size = 28 }: { size?: number }) => (
  <div className="rounded-lg bg-[#AAFF00] flex items-center justify-center shadow-md shadow-[#AAFF00]/10" style={{ width: size, height: size }}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0E0E0E" />
      <path d="M2 12L12 17L22 12" stroke="#0E0E0E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/features', label: 'Fitur' },
    { href: '/#cara-kerja', label: 'Cara Kerja' },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-zinc-100 flex flex-col font-sans relative overflow-hidden">
      <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#AAFF00]/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Navbar */}
      <header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto pointer-events-none">
        <nav className="pointer-events-auto bg-[#111111]/85 backdrop-blur-md border border-[#1D1D21] rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-lg shadow-black/40">
          <Link href="/" className="flex items-center gap-2.5 group">
            <BrandMark size={28} />
            <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-[#AAFF00] transition-colors">Nexus Task</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-xs font-semibold tracking-wide text-zinc-400 hover:text-white transition-colors">{l.label}</Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/app" className="text-xs font-bold text-zinc-300 hover:text-white px-3 py-2 transition-colors">Masuk</Link>
            <Link href="/app" className="bg-[#AAFF00] hover:bg-[#9ce60d] text-zinc-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.03] shadow-md shadow-[#AAFF00]/15">Daftar Gratis</Link>
          </div>

          <button className="md:hidden text-zinc-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="pointer-events-auto md:hidden mt-2 bg-[#111111] border border-[#1D1D21] rounded-2xl p-4 flex flex-col gap-3.5 shadow-xl shadow-black/80">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-xs font-semibold px-2 py-1 text-zinc-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>{l.label}</Link>
            ))}
            <hr className="border-[#1D1D21] my-1" />
            <Link href="/app" className="text-xs font-bold text-zinc-300 px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Masuk</Link>
            <Link href="/app" className="bg-[#AAFF00] text-zinc-950 font-bold text-xs py-2.5 rounded-xl text-center w-full block" onClick={() => setMobileMenuOpen(false)}>Daftar Gratis</Link>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 relative">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[#1D1D21] bg-[#111111]/30 py-12 z-10 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 text-xs">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2.5">
              <BrandMark size={22} />
              <span className="font-bold text-zinc-300">Nexus Task</span>
            </div>
            <a href="mailto:support@nexustask.app" className="hover:text-zinc-300">support@nexustask.app</a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-semibold">
            <Link href="/features" className="hover:text-zinc-300">Fitur</Link>
            <Link href="/#cara-kerja" className="hover:text-zinc-300">Cara Kerja</Link>
            <Link href="/privacy" className="hover:text-zinc-300">Privasi</Link>
            <Link href="/terms" className="hover:text-zinc-300">Syarat</Link>
            <Link href="/app" className="text-[#AAFF00]/80 hover:text-[#AAFF00]">Aplikasi</Link>
          </div>
          <div className="text-center md:text-right">&copy; {new Date().getFullYear()} Nexus Task. Dibuat untuk tim yang gerak cepat.</div>
        </div>
      </footer>
    </div>
  );
}
