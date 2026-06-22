'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/features', label: 'Fitur' },
    { href: '/pricing', label: 'Harga' },
    { href: '/about', label: 'Tentang Kami' },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#AAFF00]/5 rounded-full blur-[150px] pointer-events-none z-0" />
      
      {/* Top Navbar */}
      <header className="sticky top-5 z-40 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto pointer-events-none">
        <nav className="pointer-events-auto bg-[#121214]/80 backdrop-blur-lg border border-[#232329] rounded-2xl px-6 py-3 flex items-center justify-between shadow-xl shadow-black/50">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-xl bg-[#AAFF00] flex items-center justify-center shadow-lg shadow-[#AAFF00]/20 transition-all duration-300"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#09090B" />
                <path d="M2 12L12 17L22 12" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span className="font-extrabold text-base tracking-tight text-white group-hover:text-[#AAFF00] transition-colors duration-300">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-xs font-bold tracking-wide transition-colors py-1.5"
                >
                  <span className={active ? 'text-[#AAFF00]' : 'text-zinc-400 hover:text-white transition-colors duration-200'}>
                    {link.label}
                  </span>
                  {active && (
                    <motion.div 
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#AAFF00]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions CTA */}
          <div className="hidden md:flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/app"
                className="bg-[#AAFF00] hover:bg-[#b5ff1a] text-zinc-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 shadow-[0_4px_15px_-3px_rgba(170,255,0,0.3)] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Buka Aplikasi</span>
                <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu trigger */}
          <button
            className="md:hidden text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800/40 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile dropdown menu with Animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto md:hidden mt-2 bg-[#121214] border border-[#232329] rounded-2xl p-4.5 flex flex-col gap-3 shadow-2xl shadow-black/90"
            >
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                    pathname === link.href ? 'text-[#AAFF00] bg-[#AAFF00]/5' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-[#232329] my-1" />
              <Link
                href="/app"
                className="bg-[#AAFF00] text-zinc-950 font-extrabold text-xs py-3 rounded-xl text-center w-full block shadow-lg shadow-[#AAFF00]/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mulai Sekarang (Buka App)
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10 relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1C1C21] bg-[#0E0E10] py-14 z-10 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-zinc-500 text-xs">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#AAFF00]/10 border border-[#AAFF00]/20 flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#AAFF00" />
                  <path d="M2 12L12 17L22 12" stroke="#AAFF00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-extrabold text-zinc-300 tracking-tight">TaskFlow Project</span>
            </div>
            <p className="text-[10px] text-zinc-650 max-w-xs text-center md:text-left leading-relaxed">
              Platform kolaborasi flat-card modern dengan integrasi WebRTC peer meeting dan AI.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 font-bold">
            <Link href="/features" className="hover:text-white transition-colors duration-250">Fitur</Link>
            <Link href="/pricing" className="hover:text-white transition-colors duration-250">Harga</Link>
            <Link href="/about" className="hover:text-white transition-colors duration-250">Tentang</Link>
            <Link href="/app" className="hover:text-[#AAFF00] text-[#AAFF00]/90 transition-colors duration-250">Buka Aplikasi</Link>
          </div>
          
          <div className="text-[10px] text-zinc-500 text-center md:text-right">
            &copy; {new Date().getFullYear()} TaskFlow. Self-hosted & AI Powered.<br />
            Semua hak cipta dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}
