'use client';

import React from 'react';
import Link from 'next/link';
import { Kanban, Video, MessageSquare, ArrowRight, Check, Zap, Users, Clock, DollarSign } from 'lucide-react';

const Logo = ({ s = 34 }: { s?: number }) => (
  <div style={{ width: s, height: s, background: '#AAFF00', borderRadius: s * 0.26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width={s * 0.47} height={s * 0.47} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#0E0E0E" /><rect x="14" y="3" width="7" height="7" rx="1.5" fill="#0E0E0E" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#0E0E0E" /><rect x="14" y="14" width="7" height="7" rx="1.5" fill="#0E0E0E" />
    </svg>
  </div>
);

/* Faithful board mockup (browser-framed) — helpers hoisted to module scope */
const shotCard = (labels: { b: string }[], lime = false, pct?: number, pctC = '#4A90FF') => (
  <div style={{ background: lime ? '#AAFF00' : '#191919', border: lime ? 'none' : '1px solid #242424', borderRadius: 10, padding: 10, marginBottom: 9 }}>
    <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>{labels.map((l, i) => <span key={i} style={{ width: 34, height: 9, borderRadius: 3, background: lime ? 'rgba(0,0,0,.15)' : l.b }} />)}</div>
    <div style={{ height: 6, width: '85%', borderRadius: 3, background: lime ? 'rgba(0,0,0,.2)' : '#2A2A2A', marginBottom: 5 }} />
    <div style={{ height: 6, width: '60%', borderRadius: 3, background: lime ? 'rgba(0,0,0,.2)' : '#2A2A2A' }} />
    {pct !== undefined && <div style={{ height: 3, borderRadius: 2, background: lime ? 'rgba(0,0,0,.15)' : '#222', marginTop: 9, overflow: 'hidden' }}><div style={{ height: '100%', width: `${pct}%`, background: lime ? '#0E0E0E' : pctC, borderRadius: 2 }} /></div>}
  </div>
);
const ShotCol = ({ dot, children }: { dot: string; children: React.ReactNode }) => (
  <div style={{ flex: 1 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: dot }} /><span style={{ height: 7, width: 44, borderRadius: 3, background: '#2A2A2A' }} /></div>
    {children}
  </div>
);
function BoardShot() {
  return (
    <div style={{ background: '#141414', borderRadius: 16, overflow: 'hidden', border: '1px solid #1f1f1f', boxShadow: '0 32px 72px rgba(170,255,0,.10)' }}>
      <div style={{ height: 40, background: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 7, padding: '0 16px' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} /><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} /><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28CA41' }} />
        <div style={{ marginLeft: 12, height: 16, width: 200, borderRadius: 8, background: '#222' }} />
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: 52, background: '#111', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Logo s={30} /><div style={{ width: 30, height: 30, borderRadius: 8, background: '#AAFF00' }} /><div style={{ width: 30, height: 30, borderRadius: 8, background: '#1C1C1C' }} /><div style={{ width: 30, height: 30, borderRadius: 8, background: '#1C1C1C' }} />
        </div>
        <div style={{ flex: 1, padding: 16, display: 'flex', gap: 12 }}>
          <ShotCol dot="#444">{shotCard([{ b: '#0a1a3a' }, { b: '#2e1a0a' }], false, 30)}{shotCard([{ b: '#1A2E00' }])}</ShotCol>
          <ShotCol dot="#AAFF00">{shotCard([{ b: '#1A2E00' }, { b: '#2e1a0a' }], true, 65)}{shotCard([{ b: '#1A2E00' }], false, 80, '#AAFF00')}</ShotCol>
          <ShotCol dot="#FFB84A">{shotCard([{ b: '#2e220a' }], false, 100, '#FFB84A')}{shotCard([{ b: '#1a0a2e' }])}</ShotCol>
        </div>
      </div>
    </div>
  );
}

const Badge = ({ children, lime = false }: { children: React.ReactNode; lime?: boolean }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: lime ? '#1A2E00' : '#1A1A1A', border: `1px solid ${lime ? '#AAFF0033' : '#242424'}`, borderRadius: 100, padding: lime ? '6px 16px' : '5px 16px', marginBottom: 20 }}>
    {lime && <span className="nx-pulse" style={{ width: 6, height: 6, background: '#AAFF00', borderRadius: '50%' }} />}
    <span style={{ fontSize: lime ? 12 : 11, color: lime ? '#AAFF00' : '#555', fontWeight: 700, letterSpacing: '.06em' }}>{children}</span>
  </div>
);

export default function NexusLanding() {
  const features = [
    { Icon: Kanban, title: 'Papan Kanban', desc: 'Kelola tugas tim dengan visual drag-and-drop. Lacak progres setiap pekerjaan secara real-time tanpa ribet.' },
    { Icon: Video, title: 'Video Meeting', desc: 'Mulai meeting langsung dari board tanpa keluar aplikasi. Screen share dan rekam dalam satu klik.' },
    { Icon: MessageSquare, title: 'Chat Real-time', desc: 'Diskusi per task, per channel, atau personal. Semua percakapan terhubung langsung ke kartu tugas.' },
  ];
  const points = [
    { t: 'Drag-and-drop intuitif', d: 'Pindahkan kartu antar kolom dengan satu gerakan.' },
    { t: 'Label, due date, assignee', d: 'Semua info penting dalam satu kartu.' },
    { t: 'Update real-time', d: 'Perubahan langsung terlihat oleh seluruh tim.' },
  ];
  const steps = [
    { n: '1', title: 'Buat Board', desc: 'Daftar gratis, buat board pertama, dan tambah kolom sesuai alur kerja timmu.', primary: true },
    { n: '2', title: 'Undang Tim', desc: 'Kirim invite ke rekan kerja lewat email. Mereka langsung bisa akses board, chat, dan meeting.' },
    { n: '3', title: 'Mulai Kerja & Meeting', desc: 'Assign tugas, chat, dan video meeting — semua dari satu tempat. Produktivitas naik, aplikasi berkurang.' },
  ];
  const why = [
    { Icon: DollarSign, t: '100% Gratis — selamanya', d: 'Tidak ada trial. Tidak ada kartu kredit.' },
    { Icon: Zap, t: 'Kanban + Video + Chat dalam satu tab', d: 'Ganti 3 aplikasi dengan 1 platform.' },
    { Icon: Clock, t: 'Setup dalam 5 menit', d: 'Daftar, buat board, undang tim — langsung produktif.' },
    { Icon: Users, t: 'Real-time untuk seluruh tim', d: 'Tidak perlu refresh. Semua sinkron otomatis.' },
  ];
  const compare = ['Kanban board', 'Video meeting', 'Chat real-time', 'Satu aplikasi', 'Harga'];

  return (
    <div style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif", background: '#0E0E0E', color: '#fff', overflowX: 'hidden', minHeight: '100vh' }}>
      <style>{`
        @keyframes nxpulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes nxfloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .nx-pulse{ animation:nxpulse 2s infinite }
        .nx-float{ animation:nxfloat 6s ease-in-out infinite }
        .nx-link{ transition:color .2s } .nx-link:hover{ color:#fff !important }
        .nx-ghost{ transition:all .2s } .nx-ghost:hover{ color:#fff !important; border-color:#444 !important }
        .nx-cta{ transition:background .2s } .nx-cta:hover{ background:#C8FF40 !important }
        .nx-card{ transition:all .2s } .nx-card:hover{ border-color:#AAFF0050 !important; background:#161616 !important }
        .nx-pad{ padding:0 72px } .nx-grid2{ grid-template-columns:1fr 1fr }
        @media (max-width:900px){ .nx-pad{ padding:0 22px } .nx-grid2{ grid-template-columns:1fr !important } .nx-hide{ display:none !important } .nx-h1{ font-size:40px !important } }
      `}</style>

      {/* 1. NAVBAR */}
      <nav className="nx-pad" style={{ position: 'sticky', top: 0, zIndex: 999, display: 'flex', alignItems: 'center', height: 66, background: 'rgba(14,14,14,.94)', borderBottom: '1px solid #1A1A1A', backdropFilter: 'blur(20px)', gap: 40 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flex: 'none' }}>
          <Logo /><span style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-.02em' }}>Nexus Task</span>
        </Link>
        <div className="nx-hide" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36 }}>
          {[['Fitur', '#fitur'], ['Cara Kerja', '#cara-kerja'], ['Kenapa Nexus', '#kenapa']].map(([t, h]) => (
            <a key={h} href={h} className="nx-link" style={{ fontSize: 14, color: '#666', textDecoration: 'none', fontWeight: 500 }}>{t}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none', marginLeft: 'auto' }}>
          <Link href="/app" className="nx-ghost" style={{ fontSize: 13, fontWeight: 600, color: '#666', textDecoration: 'none', padding: '9px 20px', borderRadius: 10, border: '1px solid #2A2A2A' }}>Masuk</Link>
          <Link href="/app" className="nx-cta" style={{ fontSize: 13, fontWeight: 700, color: '#0E0E0E', textDecoration: 'none', background: '#AAFF00', padding: '9px 20px', borderRadius: 10 }}>Daftar Gratis</Link>
        </div>
      </nav>

      {/* 2. HERO */}
      <section className="nx-pad nx-grid2" style={{ paddingTop: 90, paddingBottom: 80, display: 'grid', gap: 64, alignItems: 'center', maxWidth: 1320, margin: '0 auto' }}>
        <div>
          <Badge lime>ALL-IN-ONE WORKSPACE · GRATIS</Badge>
          <h1 className="nx-h1" style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.06, letterSpacing: '-.035em', color: '#fff', marginBottom: 22 }}>Tugas, Chat, dan Meeting —<br /><span style={{ color: '#AAFF00' }}>Semua di Satu Tempat.</span></h1>
          <p style={{ fontSize: 17, color: '#666', lineHeight: 1.75, marginBottom: 34, maxWidth: 460 }}>Nexus Task menggabungkan Kanban board, video meeting, dan chat tim dalam satu platform. Tidak perlu lagi buka Trello, Zoom, dan Slack secara terpisah.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/app" className="nx-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#AAFF00', color: '#0E0E0E', fontSize: 15, fontWeight: 800, textDecoration: 'none', padding: '15px 30px', borderRadius: 14, boxShadow: '0 8px 28px rgba(170,255,0,.25)' }}>Mulai Gratis <ArrowRight size={15} /></Link>
            <span style={{ fontSize: 13, color: '#444' }}>Tidak perlu kartu kredit</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 48, paddingTop: 34, borderTop: '1px solid #1A1A1A' }}>
            {[['12K+', 'Tim aktif', '#fff'], ['3-in-1', 'Aplikasi dalam satu', '#fff'], ['Gratis', 'Selamanya', '#AAFF00']].map(([v, l, c], i) => (
              <React.Fragment key={l}>
                {i > 0 && <div style={{ width: 1, height: 38, background: '#1A1A1A' }} />}
                <div><div style={{ fontSize: 28, fontWeight: 800, color: c, letterSpacing: '-.02em' }}>{v}</div><div style={{ fontSize: 12, color: '#444', marginTop: 2 }}>{l}</div></div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="nx-float" style={{ position: 'relative' }}>
          <BoardShot />
          <div style={{ position: 'absolute', bottom: -18, right: -10, background: '#AAFF00', borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 28px rgba(170,255,0,.35)' }}>
            <Check size={13} color="#0E0E0E" strokeWidth={3} /><span style={{ fontSize: 12, fontWeight: 700, color: '#0E0E0E' }}>24 tugas selesai hari ini</span>
          </div>
        </div>
      </section>

      {/* 3. FITUR INTI */}
      <section id="fitur" className="nx-pad" style={{ padding: '96px 72px', background: '#111', borderTop: '1px solid #1A1A1A', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ maxWidth: 1176, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Badge>FITUR INTI</Badge>
            <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.1 }}>Satu platform, <span style={{ color: '#AAFF00' }}>tiga kekuatan.</span></h2>
          </div>
          <div className="nx-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {features.map(({ Icon, title, desc }) => (
              <div key={title} className="nx-card" style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: 22, padding: '34px 30px', cursor: 'pointer' }}>
                <div style={{ width: 54, height: 54, background: '#1A2E00', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}><Icon size={24} color="#AAFF00" /></div>
                <h3 style={{ fontSize: 21, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.75 }}>{desc}</p>
                <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 6, color: '#AAFF00', fontSize: 13, fontWeight: 600 }}><span>Pelajari lebih lanjut</span><ArrowRight size={14} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DEEP-DIVE: Board */}
      <section className="nx-pad nx-grid2" style={{ padding: '100px 72px', maxWidth: 1320, margin: '0 auto', display: 'grid', gap: 64, alignItems: 'center' }}>
        <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: 24, padding: 24, position: 'relative' }}>
          <BoardShot />
          <div style={{ position: 'absolute', bottom: -16, right: -16, background: '#AAFF00', borderRadius: 12, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 6px 20px rgba(170,255,0,.3)' }}>
            <Zap size={12} color="#0E0E0E" /><span style={{ fontSize: 11, fontWeight: 700, color: '#0E0E0E' }}>Live update untuk semua tim</span>
          </div>
        </div>
        <div>
          <Badge lime>PAPAN KANBAN</Badge>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.12, color: '#fff', marginBottom: 18 }}>Semua tugas terlihat jelas, setiap saat.</h2>
          <p style={{ fontSize: 15, color: '#666', lineHeight: 1.8, marginBottom: 30 }}>Buat board untuk setiap proyek, drag kartu antar kolom, dan lihat progres tim secara live. Tidak ada lagi tugas yang terlupakan.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {points.map((p) => (
              <div key={p.t} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                <div style={{ width: 26, height: 26, background: '#1A2E00', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 1 }}><Check size={14} color="#AAFF00" /></div>
                <div><div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{p.t}</div><div style={{ fontSize: 13, color: '#666' }}>{p.d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CARA KERJA */}
      <section id="cara-kerja" className="nx-pad" style={{ padding: '96px 72px', background: '#111', borderTop: '1px solid #1A1A1A', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <Badge>CARA KERJA</Badge>
          <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 56 }}>Mulai dalam <span style={{ color: '#AAFF00' }}>3 langkah.</span></h2>
          <div className="nx-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
            {steps.map((s) => (
              <div key={s.n} style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: 22, padding: '38px 30px', textAlign: 'center' }}>
                <div style={{ width: 68, height: 68, background: s.primary ? '#AAFF00' : '#1A2E00', border: s.primary ? 'none' : '2px solid #AAFF00', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: s.primary ? '0 8px 28px rgba(170,255,0,.28)' : 'none' }}><span style={{ fontSize: 30, fontWeight: 800, color: s.primary ? '#0E0E0E' : '#AAFF00' }}>{s.n}</span></div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. KENAPA NEXUS TASK */}
      <section id="kenapa" className="nx-pad nx-grid2" style={{ padding: '100px 72px', maxWidth: 1320, margin: '0 auto', display: 'grid', gap: 64, alignItems: 'center' }}>
        <div>
          <Badge lime>KENAPA NEXUS TASK</Badge>
          <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.1, color: '#fff', marginBottom: 18 }}>Bukan 3 aplikasi. <span style={{ color: '#AAFF00' }}>Satu.</span></h2>
          <p style={{ fontSize: 15, color: '#666', lineHeight: 1.8, marginBottom: 32 }}>Tim rata-rata habis 2+ jam sehari berpindah antara Trello, Zoom, dan Slack. Nexus Task menghilangkan itu semua.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {why.map(({ Icon, t, d }) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#141414', border: '1px solid #1E1E1E', borderRadius: 14 }}>
                <div style={{ width: 34, height: 34, background: '#1A2E00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon size={16} color="#AAFF00" /></div>
                <div><div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{t}</div><div style={{ fontSize: 12, color: '#666' }}>{d}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: 24, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 80px', padding: '20px 24px', background: '#111', borderBottom: '1px solid #1E1E1E' }}>
            <span style={{ fontSize: 12, color: '#444', fontWeight: 700 }}>Fitur</span>
            <span style={{ fontSize: 12, color: '#444', fontWeight: 700, textAlign: 'center' }}>3 Apps</span>
            <span style={{ fontSize: 12, color: '#AAFF00', fontWeight: 800, textAlign: 'center' }}>Nexus ✦</span>
          </div>
          {compare.map((row, i) => (
            <div key={row} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 80px', padding: '15px 24px', borderBottom: i < compare.length - 1 ? '1px solid #1A1A1A' : 'none', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#888' }}>{row}</span>
              <div style={{ textAlign: 'center', color: i === 4 ? '#666' : '#444', fontSize: 12 }}>{i === 4 ? '$$$' : '○'}</div>
              <div style={{ textAlign: 'center' }}><span style={{ display: 'inline-flex', width: 20, height: 20, borderRadius: '50%', background: '#1A2E00', alignItems: 'center', justifyContent: 'center' }}>{i === 4 ? <span style={{ fontSize: 10, color: '#AAFF00', fontWeight: 800 }}>$0</span> : <Check size={12} color="#AAFF00" />}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CTA PENUTUP */}
      <section className="nx-pad" style={{ padding: '40px 72px 90px' }}>
        <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#141414,#0E0E0E)', border: '1px solid #1E1E1E', borderRadius: 28, padding: '64px 40px', textAlign: 'center', maxWidth: 1176, margin: '0 auto' }}>
          <div style={{ position: 'absolute', right: -120, bottom: -120, width: 300, height: 300, background: 'rgba(170,255,0,.08)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <h2 style={{ position: 'relative', fontSize: 42, fontWeight: 800, letterSpacing: '-.025em', color: '#fff', marginBottom: 14 }}>Siap kerja lebih rapi?</h2>
          <p style={{ position: 'relative', fontSize: 16, color: '#666', marginBottom: 32, maxWidth: 460, margin: '0 auto 32px' }}>Mulai gratis sekarang — tugas, chat, dan meeting tim kamu dalam satu tempat.</p>
          <Link href="/app" className="nx-cta" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10, background: '#AAFF00', color: '#0E0E0E', fontSize: 15, fontWeight: 800, textDecoration: 'none', padding: '15px 32px', borderRadius: 14, boxShadow: '0 10px 30px rgba(170,255,0,.35)' }}>Daftar Gratis Sekarang <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="nx-pad" style={{ borderTop: '1px solid #1A1A1A', padding: '44px 72px' }}>
        <div style={{ maxWidth: 1176, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Logo s={26} /><span style={{ fontSize: 15, fontWeight: 800 }}>Nexus Task</span></div>
            <a href="mailto:support@nexustask.app" style={{ fontSize: 12, color: '#555', textDecoration: 'none' }}>support@nexustask.app</a>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 13, color: '#666' }}>
            <a href="#fitur" style={{ color: '#666', textDecoration: 'none' }}>Fitur</a>
            <a href="#cara-kerja" style={{ color: '#666', textDecoration: 'none' }}>Cara Kerja</a>
            <Link href="/privacy" style={{ color: '#666', textDecoration: 'none' }}>Privasi</Link>
            <Link href="/terms" style={{ color: '#666', textDecoration: 'none' }}>Syarat</Link>
            <Link href="/app" style={{ color: '#AAFF00', textDecoration: 'none' }}>Aplikasi</Link>
          </div>
          <div style={{ fontSize: 12, color: '#444' }}>© {new Date().getFullYear()} Nexus Task</div>
        </div>
      </footer>
    </div>
  );
}
