'use client';

import React from 'react';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import { ArrowRight, Sparkles, CheckSquare, Settings, Calendar, Kanban, Palette, Users, MessageSquare, FlaskConical } from 'lucide-react';

export default function LandingPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="text-center pt-16 pb-12 flex flex-col items-center">
        {/* Sparkle micro-badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AAFF00]/10 border border-[#AAFF00]/20 text-[#AAFF00] text-[10px] font-bold uppercase tracking-wider mb-6">
          <Sparkles size={10} />
          <span>Didukung Kecerdasan Buatan (AI)</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.1] mb-6">
          Kelola Proyek Anda Tanpa Batas Dengan <span className="text-[#AAFF00] drop-shadow-[0_0_15px_rgba(170,255,0,0.15)]">TaskFlow</span>
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed mb-8">
          Platform manajemen proyek self-hosted, responsif, dan ultra-premium. Didesain dengan gaya flat card minimalis yang modern, didukung otomatisasi cerdas, kalender terintegrasi, dan timeline visual.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/app"
            className="w-full sm:w-auto bg-[#AAFF00] hover:bg-[#9ce60d] text-zinc-950 font-bold text-xs px-7 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-103 shadow-lg shadow-[#AAFF00]/15 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Mulai Kerja Sekarang</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/features"
            className="w-full sm:w-auto bg-[#191919] hover:bg-[#222] border border-[#1D1D21] hover:border-zinc-800 text-white font-bold text-xs px-7 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            Pelajari Fitur
          </Link>
        </div>
      </section>

      {/* Experimental notice */}
      <section className="max-w-3xl mx-auto w-full mb-4">
        <div className="flex items-start gap-3 bg-[#2a2410]/40 border border-[#FFB84A]/25 rounded-2xl p-4">
          <FlaskConical size={18} className="text-[#FFB84A] mt-0.5 flex-none" />
          <div>
            <div className="text-[#FFB84A] text-xs font-bold mb-1">Proyek Eksperimental</div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              TaskFlow ini proyek eksperimental / belajar — dibangun bertahap buat eksplorasi fitur. Saat ini data board disimpan di browser (localStorage), fitur bisa berubah sewaktu-waktu, dan belum ditujukan untuk produksi.
            </p>
          </div>
        </div>
      </section>

      {/* Kanban Board Visual Mockup (HTML/CSS mockup) */}
      <section className="my-10 w-full max-w-4xl mx-auto">
        <div className="bg-[#111111] border border-[#1D1D21] rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/80 relative">
          {/* Mockup header */}
          <div className="flex items-center justify-between mb-4 border-b border-[#1D1D21] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-[10px] text-zinc-500 font-semibold bg-zinc-900 px-3 py-1 rounded-md border border-[#1D1D21]">
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
                <div className="kanban-card p-[3px] bg-[#191919] border border-[#1D1D21] rounded-[14px]">
                  <div className="p-2.5 flex flex-col">
                    <span className="self-start px-2 py-0.5 rounded-[5px] text-[8px] bg-zinc-800 text-zinc-350 font-bold mb-1.5">IDE</span>
                    <h4 className="text-[11px] font-semibold text-zinc-200">Desain Splash Screen</h4>
                  </div>
                </div>
                <div className="kanban-card p-[3px] bg-[#191919] border border-[#1D1D21] rounded-[14px]">
                  <div className="p-2.5 flex flex-col">
                    <span className="self-start px-2 py-0.5 rounded-[5px] text-[8px] bg-blue-900/60 text-blue-200 font-bold mb-1.5">FEATURE</span>
                    <h4 className="text-[11px] font-semibold text-zinc-200">Arsitektur DB Baru</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2 (lime featured card) */}
            <div className="bg-[#131315]/80 border border-[#1D1D21] rounded-xl p-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  Sedang Dikerjakan <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded-full">1</span>
                </span>
              </div>
              <div className="kanban-card p-[3px] bg-[#AAFF00] border border-[#AAFF00] rounded-[14px]">
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
              </div>
            </div>

            {/* Col 3 */}
            <div className="bg-[#131315]/80 border border-[#1D1D21] rounded-xl p-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  Selesai ✅ <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded-full">1</span>
                </span>
              </div>
              <div className="kanban-card p-[3px] bg-[#141414] border border-[#1D1D21] rounded-[14px] opacity-60">
                <div className="p-2.5 flex flex-col">
                  <span className="self-start px-2 py-0.5 rounded-[5px] text-[8px] bg-[#22c55e]/10 text-green-400 font-bold mb-1.5">DONE</span>
                  <h4 className="text-[11px] font-semibold text-zinc-500 line-through">Pengaturan CI/CD Pipeline</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Cards Grid */}
      <section className="py-12 w-full max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-10">Fitur Utama Platform</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="bg-[#191919] border border-[#1D1D21] rounded-2xl p-5 hover:border-zinc-800 transition-all duration-300">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
              <Sparkles size={16} />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Checklist Cerdas AI</h3>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Membuat rincian subtask otomatis hanya berdasarkan judul kartu dengan integrasi API kecerdasan buatan.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#191919] border border-[#1D1D21] rounded-2xl p-5 hover:border-zinc-800 transition-all duration-300">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Settings size={16} />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Automasi Butler 🤖</h3>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Atur pemicu khusus seperti pelabelan otomatis dan check-off checklist ketika memindahkan kartu.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#191919] border border-[#1D1D21] rounded-2xl p-5 hover:border-zinc-800 transition-all duration-300">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Calendar size={16} />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Gantt & Kalender</h3>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Pantau jadwal kerja bulanan dengan kalender interaktif dan pelacakan timeline visual Gantt Chart.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#191919] border border-[#1D1D21] rounded-2xl p-5 hover:border-zinc-800 transition-all duration-300">
            <div className="w-9 h-9 rounded-xl bg-[#AAFF00]/10 border border-[#AAFF00]/20 text-[#AAFF00] flex items-center justify-center mb-4">
              <Kanban size={16} />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Flat Card Density</h3>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Kepadatan letak kartu 3px dirancang untuk efisiensi ruang kerja tingkat tinggi bagi developer profesional.
            </p>
          </div>

        </div>
      </section>

      {/* What can be customized */}
      <section className="py-12 w-full max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">Yang Bisa Dikustomisasi</h2>
        <p className="text-zinc-500 text-xs text-center mb-10">Hampir semua bisa kamu atur sendiri langsung di dalam aplikasi.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { Icon: Palette, t: 'Tema warna', d: '6 palet aksen (lime, cyan, blue, dll) — ganti di Settings, tersimpan otomatis.' },
            { Icon: Users, t: 'User & role', d: 'Tambah user, atur role (Superadmin/Owner/Manager/Member), upload foto profil.' },
            { Icon: Kanban, t: 'Board & list', d: 'Banyak board, tambah/rename/hapus list, drag urutan kolom & reorder kartu.' },
            { Icon: CheckSquare, t: 'Detail kartu', d: 'Label, due date, assignee, deskripsi, checklist (progress otomatis), komentar.' },
            { Icon: MessageSquare, t: 'Chat & meeting', d: 'Chat tim + meeting video native (share screen, pilih kamera), bisa dijadwalkan.' },
            { Icon: Sparkles, t: 'AI', d: 'Generate checklist otomatis dari judul & deskripsi kartu.' },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="bg-[#191919] border border-[#1D1D21] rounded-2xl p-5 hover:border-zinc-800 transition-all duration-300">
              <div className="w-9 h-9 rounded-xl bg-[#AAFF00]/10 border border-[#AAFF00]/20 text-[#AAFF00] flex items-center justify-center mb-4">
                <Icon size={16} />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{t}</h3>
              <p className="text-zinc-500 text-[11px] leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Self-Hosted Call to Action */}
      <section className="bg-[#111111] border border-[#1D1D21] rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto my-6 relative overflow-hidden">
        <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-[#AAFF00]/5 rounded-full blur-[80px]" />
        <h3 className="text-lg sm:text-xl font-extrabold text-white mb-2">Amankan Data Anda, Jalankan Secara Mandiri</h3>
        <p className="text-zinc-400 text-xs max-w-xl mx-auto mb-6 leading-relaxed">
          TaskFlow terintegrasi dengan database PostgreSQL lokal Anda melalui ORM Prisma. Anda memegang kontrol penuh atas data, performa, dan privasi papan kerja Anda.
        </p>
        <Link
          href="/app"
          className="bg-[#AAFF00] hover:bg-[#9ce60d] text-zinc-950 font-bold text-xs px-6 py-3 rounded-xl transition-all duration-300 inline-block shadow-md shadow-[#AAFF00]/10 cursor-pointer"
        >
          Buka Papan Kerja
        </Link>
      </section>
    </MarketingLayout>
  );
}
