'use client';

import React from 'react';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import { Sparkles, Settings, Calendar, GanttChartSquare, Layers, Lock } from 'lucide-react';

export default function FeaturesPage() {
  const detailedFeatures = [
    {
      icon: Sparkles,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      title: 'Generator Checklist Berbasis AI',
      desc: 'Cukup masukkan judul kartu seperti "Setup Database PostgreSQL" atau "Desain UI Mobile App", dan asisten kecerdasan buatan terintegrasi kami akan menganalisis judul serta menyusun daftar subtask checklist yang logis untuk Anda dalam hitungan detik.',
    },
    {
      icon: Settings,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      title: 'Butler Rule Builder (Automasi Papan)',
      desc: 'Kurangi pekerjaan berulang. Atur otomatisasi Butler seperti mencentang otomatis seluruh checklist ketika kartu dipindahkan, atau menyematkan label Urgent secara otomatis saat tugas masuk ke kolom prioritas tinggi.',
    },
    {
      icon: GanttChartSquare,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      title: 'Gantt Chart Timeline View',
      desc: 'Pantau jangka waktu penyelesaian proyek dengan diagram Gantt yang intuitif. Geser tanggal mulai dan selesai secara visual untuk menyesuaikan rentang waktu tugas dengan tenggat waktu keseluruhan.',
    },
    {
      icon: Calendar,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: 'Dynamic Calendar Planner',
      desc: 'Rencanakan tugas harian dan mingguan dengan kalender drag-and-drop. Klik tanggal apa saja untuk membuat kartu baru secara instan, atau geser kartu ke tanggal baru untuk memperbarui tanggal tenggat waktu secara dinamis.',
    },
    {
      icon: Layers,
      color: 'text-lime-400 bg-lime-500/10 border-lime-500/20',
      title: 'Desain Flat Card Ultra-Density',
      desc: 'Dengan padding computed 3px dan desain flat modern tanpa notched tabs, TaskFlow menawarkan efisiensi tinggi pada layar Anda. Anda dapat melihat puluhan kartu sekaligus tanpa perlu banyak scroll.',
    },
    {
      icon: Lock,
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
      title: 'Keamanan Self-Hosted Penuh',
      desc: 'Semua workspace, board, list, kartu, checklist, dan log otomatisasi disimpan di database PostgreSQL lokal Anda sendiri menggunakan Prisma ORM. Keamanan data Anda berada sepenuhnya di tangan Anda.',
    },
  ];

  return (
    <MarketingLayout>
      {/* Title Header */}
      <section className="text-center pt-10 pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Fitur Unggulan TaskFlow
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Dirancang khusus untuk tim pengembang yang menginginkan performa maksimal, privasi mandiri, dan fleksibilitas otomatisasi cerdas.
        </p>
      </section>

      {/* Feature Details Grid */}
      <section className="my-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {detailedFeatures.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index} 
                className="bg-[#111111] border border-[#1D1D21] hover:border-zinc-800 rounded-2xl p-6 transition-all duration-300 flex gap-4 items-start"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${feat.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-[#111111] border border-[#1D1D21] rounded-2xl p-6 sm:p-8 text-center max-w-3xl mx-auto my-12 relative overflow-hidden">
        <h3 className="text-md sm:text-lg font-bold text-white mb-2">Ingin Mencoba Seluruh Fitur Ini?</h3>
        <p className="text-zinc-500 text-[11px] max-w-md mx-auto mb-6">
          TaskFlow gratis untuk digunakan dan di-host secara lokal. Hubungkan ke database PostgreSQL Anda dan mulai mengelola papan kerja hari ini.
        </p>
        <Link
          href="/app"
          className="bg-[#AAFF00] hover:bg-[#9ce60d] text-zinc-950 font-bold text-xs px-6 py-3 rounded-xl transition-all duration-300 inline-block cursor-pointer shadow-md shadow-[#AAFF00]/10"
        >
          Mulai Kerja Sekarang
        </Link>
      </section>
    </MarketingLayout>
  );
}
