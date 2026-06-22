'use client';

import React, { useState } from 'react';
import { useBoard } from '@/lib/boardStore';

export default function AuthOverlay() {
  const { me, loadingAuth, loginWithGoogle, loginWithEmail, registerWithEmail } = useBoard();

  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (loadingAuth || me) return null;

  const isReg = mode === 'register';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!isReg) await loginWithEmail(email, password);
      else {
        if (!name.trim()) throw new Error('Nama lengkap wajib diisi');
        await registerWithEmail(email, password, name);
      }
    } catch (err) {
      console.error(err);
      const e2 = err as { code?: string; message?: string };
      let msg = 'Terjadi kesalahan. Silakan coba lagi.';
      if (e2.code === 'auth/user-not-found' || e2.code === 'auth/wrong-password' || e2.code === 'auth/invalid-credential') msg = 'Email atau password salah.';
      else if (e2.code === 'auth/email-already-in-use') msg = 'Email sudah digunakan.';
      else if (e2.code === 'auth/weak-password') msg = 'Password minimal 6 karakter.';
      else if (e2.code === 'auth/invalid-email') msg = 'Format email tidak valid.';
      else if (e2.message) msg = e2.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Google sign-in error:', err);
      const c = (err as { code?: string }).code || '';
      if (c === 'auth/popup-closed-by-user' || c === 'auth/cancelled-popup-request') {
        // user closed the popup — not an error
      } else if (c === 'auth/unauthorized-domain') {
        setError('Domain ini belum diizinkan. Firebase Console → Authentication → Settings → Authorized domains → tambahkan domain kamu (mis. localhost).');
      } else if (c === 'auth/operation-not-allowed') {
        setError('Login Google belum diaktifkan. Firebase Console → Authentication → Sign-in method → aktifkan Google.');
      } else if (c === 'auth/configuration-not-found') {
        setError('Konfigurasi Auth belum lengkap. Aktifkan Google sign-in di Firebase Console dulu.');
      } else {
        setError(`Gagal masuk dengan Google${c ? ` (${c})` : ''}. Cek console untuk detail.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const input: React.CSSProperties = { width: '100%', background: '#0E0E0E', border: '1px solid #242424', borderRadius: 12, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,5,.8)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16, fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}>
      <style>{`
        .au-in:focus{ border-color: #AAFF00 !important; box-shadow:0 0 0 3px rgba(170,255,0,.12) }
        .au-cta{ transition:all .2s } .au-cta:hover{ background:#C8FF40 !important; box-shadow:0 12px 30px rgba(170,255,0,.3) }
        .au-soc{ transition:all .2s } .au-soc:hover{ border-color:#3a3a3a !important; background:#161616 !important }
        .au-link{ cursor:pointer; color:#AAFF00; font-weight:700 } .au-link:hover{ text-decoration:underline }
        @media (max-width:820px){ .au-left{ display:none !important } .au-card{ grid-template-columns:1fr !important; max-width:440px !important } }
      `}</style>

      <div className="au-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', maxWidth: 920, background: '#141414', border: '1px solid #232329', borderRadius: 26, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.6)' }}>

        {/* ── LEFT: brand gradient ── */}
        <div className="au-left" style={{ position: 'relative', padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 480, background: 'radial-gradient(130% 130% at 25% 15%, #C8FF40 0%, #AAFF00 32%, #5a8a00 72%, #14250a 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: '#0E0E0E', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="#AAFF00" /><rect x="14" y="3" width="7" height="7" rx="1.5" fill="#AAFF00" /><rect x="3" y="14" width="7" height="7" rx="1.5" fill="#AAFF00" /><rect x="14" y="14" width="7" height="7" rx="1.5" fill="#AAFF00" /></svg>
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#0E0E0E', letterSpacing: '-.02em' }}>Nexus Task</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(14,14,14,.6)', marginBottom: 10 }}>Kamu bisa dengan mudah</div>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: '#0E0E0E', lineHeight: 1.18, letterSpacing: '-.02em' }}>Akses workspace pribadimu — tugas, chat & meeting dalam satu tempat.</h2>
            <div style={{ display: 'flex', gap: 7, marginTop: 22 }}>
              {[0, 1, 2].map((i) => <span key={i} style={{ width: i === 0 ? 22 : 7, height: 7, borderRadius: 4, background: i === 0 ? '#0E0E0E' : 'rgba(14,14,14,.35)' }} />)}
            </div>
          </div>
        </div>

        {/* ── RIGHT: form ── */}
        <div style={{ padding: '40px 38px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: 18 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 16 }}><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" stroke="#AAFF00" strokeWidth="2.4" strokeLinecap="round" /></svg>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-.02em', marginBottom: 6 }}>{isReg ? 'Buat akun' : 'Selamat datang kembali'}</h1>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{isReg ? 'Akses tugas, chat, dan meeting kapan saja — dan jaga semua tetap rapi di satu tempat.' : 'Masuk untuk lanjut ke workspace kamu.'}</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(255,107,107,.1)', border: '1px solid rgba(255,107,107,.25)', borderRadius: 10, padding: '9px 12px', color: '#FF6B6B', fontSize: 12, fontWeight: 600, marginBottom: 14 }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {isReg && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#bbb', display: 'block', marginBottom: 7 }}>Nama lengkap</label>
                <input className="au-in" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" required style={input} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#bbb', display: 'block', marginBottom: 7 }}>Email kamu</label>
              <input className="au-in" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" required style={input} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#bbb', display: 'block', marginBottom: 7 }}>{isReg ? 'Buat password' : 'Password'}</label>
              <div style={{ position: 'relative' }}>
                <input className="au-in" type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} style={{ ...input, paddingRight: 42 }} />
                <button type="button" onClick={() => setShowPass((v) => !v)} title={showPass ? 'Sembunyikan' : 'Lihat'} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
                  {showPass
                    ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.4 5.2A9.5 9.5 0 0112 5c5 0 9 4.5 9 7-.4 1-1.2 2.2-2.3 3.2M6.1 6.1C3.8 7.5 2.3 9.8 2 12c.6 1.5 3.5 7 10 7a9.7 9.7 0 003-.5" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    : <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" stroke="#777" strokeWidth="2" /></svg>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="au-cta" style={{ background: '#AAFF00', color: '#0E0E0E', fontWeight: 800, fontSize: 14, padding: '13px 0', border: 'none', borderRadius: 12, cursor: loading ? 'wait' : 'pointer', marginTop: 4, opacity: loading ? 0.7 : 1, boxShadow: '0 8px 22px rgba(170,255,0,.18)' }}>
              {loading ? 'Memproses…' : isReg ? 'Buat akun' : 'Masuk'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#242424' }} />
            <span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>atau lanjut dengan</span>
            <div style={{ flex: 1, height: 1, background: '#242424' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            <button type="button" onClick={handleGoogle} disabled={loading} className="au-soc" title="Masuk dengan Google" style={{ background: '#0E0E0E', border: '1px solid #242424', borderRadius: 12, padding: '11px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" /></svg>
            </button>
            <button type="button" disabled title="Segera tersedia" className="au-soc" style={{ background: '#0E0E0E', border: '1px solid #242424', borderRadius: 12, padding: '11px 0', cursor: 'not-allowed', opacity: 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.48A10 10 0 0022 12c0-5.52-4.48-10-10-10z" /></svg>
            </button>
            <button type="button" disabled title="Segera tersedia" className="au-soc" style={{ background: '#0E0E0E', border: '1px solid #242424', borderRadius: 12, padding: '11px 0', cursor: 'not-allowed', opacity: 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.2 2.6 2.1 1-.04 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.66 1.1-.02 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4 0-.02-2.1-.8-2.1-3.2zM14.3 6.3c.6-.7 1-1.7.9-2.7-.9.04-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .08 1.9-.5 2.5-1.2z" /></svg>
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 12.5, color: '#666' }}>
            {isReg ? 'Sudah punya akun? ' : 'Belum punya akun? '}
            <span className="au-link" onClick={() => { setMode(isReg ? 'login' : 'register'); setError(null); }}>{isReg ? 'Masuk' : 'Daftar'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
