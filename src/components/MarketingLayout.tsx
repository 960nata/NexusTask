'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/features', label: 'Fitur' },
    { href: '/pricing', label: 'Harga' },
    { href: '/about', label: 'Tentang Kami' },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-zinc-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#AAFF00]/5 rounded-full blur-[140px] pointer-events-none z-0" />
      
      {/* Top Navbar */}
      <header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto pointer-events-none">
        <nav className="pointer-events-auto bg-[#111111]/85 backdrop-blur-md border border-[#1D1D21] rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-lg shadow-black/40">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-[#AAFF00] flex items-center justify-center shadow-md shadow-[#AAFF00]/10 transition-transform group-hover:scale-105">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0E0E0E" />
                <path d="M2 12L12 17L22 12" stroke="#0E0E0E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-[#AAFF00] transition-colors">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(link => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-semibold tracking-wide transition-colors ${
                    active ? 'text-[#AAFF00]' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/app"
              className="bg-[#AAFF00] hover:bg-[#9ce60d] text-zinc-950 font-bold text-xs px-4.5 py-2.2 rounded-xl transition-all duration-300 transform hover:scale-103 shadow-md shadow-[#AAFF00]/15 cursor-pointer"
            >
              Mulai Sekarang (Buka App)
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto md:hidden mt-2 bg-[#111111] border border-[#1D1D21] rounded-2xl p-4 flex flex-col gap-3.5 shadow-xl shadow-black/80">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold px-2 py-1 ${
                  pathname === link.href ? 'text-[#AAFF00]' : 'text-zinc-400 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-[#1D1D21] my-1" />
            <Link
              href="/app"
              className="bg-[#AAFF00] text-zinc-950 font-bold text-xs py-2.5 rounded-xl text-center w-full block"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mulai Sekarang (Buka App)
            </Link>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1D1D21] bg-[#111111]/30 py-10 z-10 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#a1a1aa" />
                <path d="M2 12L12 17L22 12" stroke="#a1a1aa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-zinc-400">TaskFlow Project</span>
          </div>
          <div className="flex gap-6">
            <Link href="/features" className="hover:text-zinc-350">Fitur</Link>
            <Link href="/pricing" className="hover:text-zinc-350">Harga</Link>
            <Link href="/about" className="hover:text-zinc-350">Tentang</Link>
            <Link href="/app" className="hover:text-zinc-350 text-[#AAFF00]/80">Aplikasi</Link>
          </div>
          <div>
            &copy; {new Date().getFullYear()} TaskFlow. Self-hosted & AI Powered.
          </div>
        </div>
      </footer>
    </div>
  );
}
