'use client';

import React from 'react';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckSquare, Settings, Calendar, Kanban, Palette, Users, MessageSquare, FlaskConical } from 'lucide-react';

export default function LandingPage() {
  // Container animation configuration for staggered items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  } as const;

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="text-center pt-20 pb-16 flex flex-col items-center relative">
        {/* Sparkle micro-badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#AAFF00]/10 border border-[#AAFF00]/25 text-[#AAFF00] text-[10px] font-bold uppercase tracking-wider mb-6 shadow-[0_0_15px_rgba(170,255,0,0.05)]"
        >
          <Sparkles size={11} className="animate-pulse" />
          <span>Didukung Otomatisasi AI Cerdas</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.1] mb-6"
        >
          Kelola Proyek Anda Tanpa Batas Dengan <span className="text-[#AAFF00] drop-shadow-[0_0_20px_rgba(170,255,0,0.25)]">TaskFlow</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed mb-10"
        >
          Platform manajemen proyek self-hosted, responsif, dan ultra-premium. Didesain dengan gaya flat card minimalis yang modern, didukung otomatisasi cerdas, kalender terintegrasi, dan timeline visual.
        </motion.p>

        {/* Hero CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md sm:max-w-none"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
            <Link
              href="/app"
              className="w-full sm:w-auto bg-[#AAFF00] hover:bg-[#b5ff1a] text-zinc-950 font-extrabold text-xs px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(170,255,0,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(170,255,0,0.45)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Mulai Kerja Sekarang</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
            <Link
              href="/features"
              className="w-full sm:w-auto bg-[#161619] hover:bg-[#1e1e24] border border-[#242429] hover:border-zinc-700 text-zinc-300 hover:text-white font-extrabold text-xs px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              Pelajari Fitur
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Experimental notice */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-3xl mx-auto w-full mb-8"
      >
        <div className="flex items-start gap-3.5 bg-[#2a2410]/30 border border-[#FFB84A]/20 rounded-2xl p-4.5 backdrop-blur-sm">
          <FlaskConical size={18} className="text-[#FFB84A] mt-0.5 flex-none animate-bounce" />
          <div>
            <div className="text-[#FFB84A] text-xs font-bold mb-1">Proyek Eksperimental</div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              TaskFlow adalah proyek eksperimental manajemen papan kerja (Kanban) yang terintegrasi secara langsung dengan PostgreSQL lokal melalui Prisma. Fitur ini dirancang untuk kemudahan kustomisasi mandiri, real-time sync, dan fleksibilitas optimal.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Kanban Board Visual Mockup */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        className="my-12 w-full max-w-4xl mx-auto"
      >
        <div className="bg-[#111111] border border-[#1D1D21] rounded-2xl p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative group">
          {/* Mockup header */}
          <div className="flex items-center justify-between mb-4 border-b border-[#1D1D21] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-[10px] text-zinc-500 font-semibold bg-zinc-900/60 px-3 py-1 rounded-md border border-[#1D1D21]">
              workspace/ratu-jaya-tani/mobile-app
            </div>
            <div className="w-8" />
          </div>

          {/* Mockup Board Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Col 1 */}
            <div className="bg-[#131315]/80 border border-[#1D1D21] rounded-xl p-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  Ide <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded-full">2</span>
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <motion.div whileHover={{ y: -3, scale: 1.01 }} className="kanban-card p-[3px] bg-[#191919] border border-[#1D1D21] rounded-[14px] cursor-pointer">
                  <div className="p-2.5 flex flex-col">
                    <span className="self-start px-2 py-0.5 rounded-[5px] text-[8px] bg-zinc-800 text-zinc-350 font-bold mb-1.5">IDE</span>
                    <h4 className="text-[11px] font-semibold text-zinc-200">Desain Splash Screen</h4>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -3, scale: 1.01 }} className="kanban-card p-[3px] bg-[#191919] border border-[#1D1D21] rounded-[14px] cursor-pointer">
                  <div className="p-2.5 flex flex-col">
                    <span className="self-start px-2 py-0.5 rounded-[5px] text-[8px] bg-blue-900/60 text-blue-200 font-bold mb-1.5">FEATURE</span>
                    <h4 className="text-[11px] font-semibold text-zinc-200">Arsitektur DB Baru</h4>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Col 2 (lime featured card) */}
            <div className="bg-[#131315]/80 border border-[#1D1D21] rounded-xl p-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  Sedang Dikerjakan <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded-full">1</span>
                </span>
              </div>
              <motion.div whileHover={{ y: -3, scale: 1.02 }} className="kanban-card p-[3px] bg-[#AAFF00] border border-[#AAFF00] rounded-[14px] cursor-pointer shadow-[0_5px_15px_rgba(170,255,0,0.15)]">
                <div className="p-2.5 flex flex-col text-zinc-950">
                  <div className="flex gap-1 mb-1.5">
                    <span className="px-2 py-0.5 rounded-[5px] text-[8px] bg-black/12 font-bold text-zinc-950">URGENT</span>
                    <span className="px-2 py-0.5 rounded-[5px] text-[8px] bg-black/12 font-bold text-zinc-950">FEATURE</span>
                  </div>
                  <h4 className="text-[11px] font-bold text-zinc-950 leading-snug">Implementasi Log Masuk Google</h4>
                  <div className="mt-3 w-full h-[3px] rounded-full bg-black/10 overflow-hidden">
                    <div className="h-full bg-zinc-950" style={{ width: '65%' }} />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Col 3 */}
            <div className="bg-[#131315]/80 border border-[#1D1D21] rounded-xl p-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  Selesai ✅ <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded-full">1</span>
                </span>
              </div>
              <div className="kanban-card p-[3px] bg-[#141414] border border-[#1D1D21] rounded-[14px] opacity-50">
                <div className="p-2.5 flex flex-col">
                  <span className="self-start px-2 py-0.5 rounded-[5px] text-[8px] bg-[#22c55e]/10 text-green-400 font-bold mb-1.5">DONE</span>
                  <h4 className="text-[11px] font-semibold text-zinc-500 line-through">Pengaturan CI/CD Pipeline</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Value Proposition Cards Grid */}
      <section className="py-16 w-full max-w-5xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-12"
        >
          Fitur Utama Platform
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#161619] border border-[#1E1E22] rounded-2xl p-5.5 hover:border-zinc-800 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-4.5">
              <Sparkles size={18} />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Checklist Cerdas AI</h3>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Membuat rincian subtask otomatis hanya berdasarkan judul kartu dengan integrasi API kecerdasan buatan.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#161619] border border-[#1E1E22] rounded-2xl p-5.5 hover:border-zinc-800 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4.5">
              <Settings size={18} />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Automasi Butler 🤖</h3>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Atur pemicu khusus seperti pelabelan otomatis dan check-off checklist ketika memindahkan kartu.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#161619] border border-[#1E1E22] rounded-2xl p-5.5 hover:border-zinc-800 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4.5">
              <Calendar size={18} />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Gantt & Kalender</h3>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Pantau jadwal kerja bulanan dengan kalender interaktif dan pelacakan timeline visual Gantt Chart.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#161619] border border-[#1E1E22] rounded-2xl p-5.5 hover:border-[#AAFF00]/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-[#AAFF00]/10 border border-[#AAFF00]/20 text-[#AAFF00] flex items-center justify-center mb-4.5">
              <Kanban size={18} />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Flat Card Density</h3>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Kepadatan letak kartu 3px dirancang untuk efisiensi ruang kerja tingkat tinggi bagi developer profesional.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* What can be customized */}
      <section className="py-16 w-full max-w-5xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-2"
        >
          Kustomisasi Penuh
        </motion.h2>
        <p className="text-zinc-500 text-xs text-center mb-12">Hampir semua aspek alur kerja bisa disesuaikan dengan kebutuhan tim.</p>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {[
            { Icon: Palette, t: 'Tema warna', d: '6 palet warna aksen (lime, cyan, blue, dll) — ubah instan lewat Settings.' },
            { Icon: Users, t: 'User & role', d: 'Kelola tim dengan hak akses (Superadmin/Owner/Manager/Member) dan avatar kustom.' },
            { Icon: Kanban, t: 'Multi-Board', d: 'Buat banyak papan kerja terpisah, atur list, kolom, dan posisi secara dinamis.' },
            { Icon: CheckSquare, t: 'Kartu Detail', d: 'Tentukan label warna, tanggal tempo, anggota terkait, checklist, dan log aktivitas.' },
            { Icon: MessageSquare, t: 'Real-time Chat & Meeting', d: 'Obrolan grup internal dan video meeting native WebRTC langsung tanpa plugin tambahan.' },
            { Icon: Sparkles, t: 'Generasi AI', d: 'Lengkapi rincian checklist kerja secara otomatis didukung model bahasa AI.' },
          ].map(({ Icon, t, d }) => (
            <motion.div variants={itemVariants} whileHover={{ y: -4 }} key={t} className="bg-[#161619] border border-[#1E1E22] rounded-2xl p-5.5 hover:border-zinc-800 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-[#AAFF00]/10 border border-[#AAFF00]/25 text-[#AAFF00] flex items-center justify-center mb-4">
                <Icon size={18} />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{t}</h3>
              <p className="text-zinc-500 text-[11px] leading-relaxed">{d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Self-Hosted Call to Action */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-[#111111] border border-[#1D1D21] rounded-2xl p-8 sm:p-10 text-center max-w-4xl mx-auto my-10 relative overflow-hidden"
      >
        {/* Background glow overlay */}
        <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-[#AAFF00]/5 rounded-full blur-[85px] pointer-events-none" />
        <div className="absolute -left-32 -top-32 w-64 h-64 bg-teal-500/5 rounded-full blur-[85px] pointer-events-none" />
        
        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3">Amankan Data Anda, Jalankan Secara Mandiri</h3>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto mb-8 leading-relaxed">
          TaskFlow terintegrasi dengan database PostgreSQL lokal Anda melalui ORM Prisma. Anda memegang kontrol penuh atas data, performa, dan privasi papan kerja Anda.
        </p>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
          <Link
            href="/app"
            className="bg-[#AAFF00] hover:bg-[#b5ff1a] text-zinc-950 font-extrabold text-xs px-8 py-3.5 rounded-xl transition-all duration-300 inline-flex items-center gap-2 shadow-[0_8px_20px_-4px_rgba(170,255,0,0.25)] hover:shadow-[0_12px_24px_-4px_rgba(170,255,0,0.4)] cursor-pointer"
          >
            <span>Buka Papan Kerja</span>
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </motion.section>
    </MarketingLayout>
  );
}
