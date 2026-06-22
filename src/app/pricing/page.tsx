'use client';

import React from 'react';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      title: 'Community Edition',
      price: 'Rp 0',
      period: 'Gratis Selamanya',
      desc: 'Sempurna untuk developer mandiri yang ingin melakukan self-host database secara gratis.',
      features: [
        'Hingga 3 Workspace',
        'Papan Kanban Gaya Flat Card',
        'Integrasi Database PostgreSQL Lokal',
        'Tampilan Kalender & Timeline',
        'Dukungan Anggota Proyek',
        'Ekspor Data CSV',
      ],
      cta: 'Mulai Gratis',
      accent: false,
    },
    {
      title: 'Team & AI Edition',
      price: 'Rp 129.000',
      period: 'per bulan',
      desc: 'Ideal untuk tim pengembang kolaboratif yang ingin mempercepat kerja dengan AI dan otomasi.',
      features: [
        'Workspace & Papan Kerja Tanpa Batas',
        'Checklist Cerdas Berbasis AI',
        'Automasi Butler Rule Builder',
        'Penyusunan Jadwal Gantt Timeline',
        'Lampiran Berkas & Kolaborasi Real-time',
        'Prioritas Dukungan Teknis',
      ],
      cta: 'Coba Sekarang (Buka App)',
      accent: true,
    },
    {
      title: 'Enterprise',
      price: 'Rencana Kustom',
      period: 'kontrak tahunan',
      desc: 'Bagi organisasi besar dengan kebutuhan integrasi on-premise khusus dan backup mandiri otomatis.',
      features: [
        'Seluruh Fitur Team & AI Edition',
        'Bantuan Instalasi & On-Premise Setup',
        'Otomatisasi Backup Data Database',
        'Custom SSO & Integrasi Auth internal',
        'SLA Keamanan & Respon Dukungan 24/7',
        'Kustomisasi Fitur Sesuai Kebutuhan',
      ],
      cta: 'Hubungi Kami',
      accent: false,
    },
  ];

  return (
    <MarketingLayout>
      {/* Title Header */}
      <section className="text-center pt-10 pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Rencana Harga Sederhana & Transparan
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          TaskFlow bersifat open-source dan gratis untuk penggunaan dasar. Pilih rencana berbayar untuk mengaktifkan asisten AI dan otomatisasi Butler.
        </p>
      </section>

      {/* Pricing Cards Grid */}
      <section className="my-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`border rounded-2xl p-6.5 flex flex-col justify-between transition-all duration-300 relative ${
              plan.accent 
                ? 'bg-[#111111] border-[#AAFF00] shadow-lg shadow-[#AAFF00]/5 scale-103 z-10' 
                : 'bg-[#111111] border-[#1D1D21] hover:border-zinc-800'
            }`}
          >
            {plan.accent && (
              <span className="absolute top-3.5 right-4 bg-[#AAFF00] text-zinc-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Direkomendasikan
              </span>
            )}
            <div>
              <h3 className="text-xs uppercase font-extrabold text-zinc-400 tracking-wider mb-2">{plan.title}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-black text-white">{plan.price}</span>
                <span className="text-zinc-500 text-[10px] font-medium">/ {plan.period}</span>
              </div>
              <p className="text-zinc-500 text-[11px] leading-relaxed mb-6 border-b border-[#1D1D21] pb-4">{plan.desc}</p>
              
              <ul className="flex flex-col gap-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex gap-2 items-start text-[11px] text-zinc-400">
                    <Check size={12} className={plan.accent ? 'text-[#AAFF00] shrink-0 mt-0.5' : 'text-teal-400 shrink-0 mt-0.5'} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/app"
              className={`w-full text-center py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                plan.accent 
                  ? 'bg-[#AAFF00] hover:bg-[#9ce60d] text-zinc-950 shadow-md shadow-[#AAFF00]/10' 
                  : 'bg-zinc-800 hover:bg-zinc-750 text-white'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </section>

      {/* FAQ brief section */}
      <section className="max-w-3xl mx-auto mt-16 text-center">
        <h4 className="text-sm font-bold text-white mb-2">Apakah saya bisa menggunakan database PostgreSQL saya sendiri?</h4>
        <p className="text-zinc-500 text-[11px] leading-relaxed">
          Ya! TaskFlow Community Edition sepenuhnya gratis dan berjalan di server lokal Anda sendiri. Semua data disimpan secara lokal pada database Anda tanpa perlu terhubung ke cloud kami.
        </p>
      </section>
    </MarketingLayout>
  );
}
