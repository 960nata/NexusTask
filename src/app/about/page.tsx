'use client';

import React from 'react';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import { Database, Cpu, Layout, Users } from 'lucide-react';

export default function AboutPage() {
  const stack = [
    { icon: Layout, title: 'Next.js & React', desc: 'Framework React terpopuler untuk pembuatan aplikasi web berkinerja tinggi, responsif, dan ramah SEO.' },
    { icon: Database, title: 'Prisma ORM & PostgreSQL', desc: 'Akses database relasional lokal berkinerja tinggi yang aman, terstruktur, dan mudah dikelola.' },
    { icon: Cpu, title: 'AI & Automation Engine', desc: 'Penyusunan checklist otomatis menggunakan kecerdasan buatan Groq/OpenRouter untuk efisiensi tinggi.' },
  ];

  return (
    <MarketingLayout>
      {/* Title Header */}
      <section className="text-center pt-10 pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Tentang Proyek TaskFlow
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Kami berkomitmen untuk menyediakan ruang kerja mandiri yang cepat, aman, dan memanjakan mata bagi para pengembang profesional.
        </p>
      </section>

      {/* Mission Section */}
      <section className="my-6 max-w-4xl mx-auto bg-[#111111] border border-[#1D1D21] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Users size={18} className="text-[#AAFF00]" />
            <span>Misi Kami</span>
          </h2>
          <p className="text-zinc-500 text-xs leading-relaxed mb-4">
            Banyak perangkat lunak manajemen proyek saat ini terlalu berat, lambat, dan memaksa data Anda disimpan di cloud pihak ketiga. Kami membangun TaskFlow untuk mengembalikan kendali penuh atas data dan privasi ke tangan pengembang.
          </p>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Dengan estetika minimalis bergaya flat card premium, TaskFlow tidak hanya menjadi alat fungsional untuk mencatat tugas, tetapi juga menjadi antarmuka kerja berdensitas tinggi yang menyenangkan untuk digunakan setiap hari.
          </p>
        </div>
        <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-zinc-950 border border-[#1D1D21] rounded-xl flex items-center justify-center p-6 text-center select-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#AAFF00]/5 rounded-full blur-xl" />
          <div>
            <div className="text-[#AAFF00] font-black text-3xl mb-1">100%</div>
            <div className="text-zinc-400 font-bold text-[10px] uppercase tracking-wider">Self-Hosted & Kontrol Data</div>
          </div>
        </div>
      </section>

      {/* Tech Stack List */}
      <section className="my-12 max-w-4xl mx-auto">
        <h3 className="text-sm font-bold text-white text-center mb-8 uppercase tracking-wider">Teknologi yang Kami Gunakan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stack.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-[#191919] border border-[#1D1D21] hover:border-zinc-800 rounded-2xl p-5 transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-zinc-850 border border-zinc-800 text-zinc-300 flex items-center justify-center mb-4">
                  <Icon size={16} />
                </div>
                <h4 className="text-xs font-bold text-white mb-2">{item.title}</h4>
                <p className="text-zinc-500 text-[10px] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Section */}
      <section className="text-center max-w-xl mx-auto my-8">
        <h3 className="text-sm font-bold text-white mb-2">Tertarik untuk berkontribusi?</h3>
        <p className="text-zinc-500 text-[11px] leading-relaxed mb-6">
          TaskFlow adalah proyek berskala komunitas. Jika Anda memiliki saran perbaikan visual, fitur otomatisasi, atau perbaikan bug, silakan kontribusikan melalui repository lokal Anda.
        </p>
        <Link
          href="/app"
          className="bg-[#AAFF00] hover:bg-[#9ce60d] text-zinc-950 font-bold text-xs px-6 py-3 rounded-xl transition-all duration-300 inline-block cursor-pointer shadow-md shadow-[#AAFF00]/10"
        >
          Masuk ke Workspace Aplikasi
        </Link>
      </section>
    </MarketingLayout>
  );
}
