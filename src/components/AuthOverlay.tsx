'use client';

import React, { useState } from 'react';
import { useBoard } from '@/lib/boardStore';
import { Ic } from './ui';

export default function AuthOverlay() {
  const { 
    me, 
    loadingAuth, 
    loginWithGoogle, 
    loginWithEmail, 
    registerWithEmail, 
    continueAsGuest 
  } = useBoard();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (loadingAuth || me) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        if (!name.trim()) {
          throw new Error('Nama lengkap wajib diisi');
        }
        await registerWithEmail(email, password, name);
      }
    } catch (err: any) {
      console.error(err);
      let msg = 'Terjadi kesalahan. Silakan coba lagi.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Email atau password salah.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Email sudah digunakan.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password minimal terdiri dari 6 karakter.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Format email tidak valid.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Gagal masuk dengan Google. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 5, 5, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 16
    }}>
      <div style={{
        background: '#121214',
        border: '1px solid #232329',
        borderRadius: 24,
        padding: '32px 24px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, background: 'var(--accent)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(170,255,0,0.2)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#09090B" />
              <path d="M2 12L12 17L22 12" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginTop: 8 }}>Masuk ke TaskFlow</h2>
          <p style={{ fontSize: 12, color: '#777', maxWidth: 280 }}>Mulai kelola proyek dan tim Anda secara real-time dan terorganisasi.</p>
        </div>

        <div style={{ display: 'flex', background: '#09090B', padding: 4, borderRadius: 12, border: '1px solid #1c1c21' }}>
          <button 
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            style={{
              flex: 1,
              padding: '8px 0',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              background: mode === 'login' ? '#1c1c21' : 'transparent',
              color: mode === 'login' ? '#fff' : '#666',
              transition: 'all 0.2s'
            }}
          >
            Masuk
          </button>
          <button 
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            style={{
              flex: 1,
              padding: '8px 0',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              background: mode === 'register' ? '#1c1c21' : 'transparent',
              color: mode === 'register' ? '#fff' : '#666',
              transition: 'all 0.2s'
            }}
          >
            Daftar
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.25)',
            borderRadius: 12,
            padding: '10px 12px',
            color: '#FF6B6B',
            fontSize: 11,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ flexShrink: 0 }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#aaa' }}>Nama Lengkap</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Nama Anda"
                required
                style={{
                  background: '#09090B',
                  border: '1px solid #1c1c21',
                  borderRadius: 10,
                  padding: '10px 12px',
                  color: '#fff',
                  fontSize: 13,
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#aaa' }}>Alamat Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="nama@email.com"
              required
              style={{
                background: '#09090B',
                border: '1px solid #1c1c21',
                borderRadius: 10,
                padding: '10px 12px',
                color: '#fff',
                fontSize: 13,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#aaa' }}>Kata Sandi</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                background: '#09090B',
                border: '1px solid #1c1c21',
                borderRadius: 10,
                padding: '10px 12px',
                color: '#fff',
                fontSize: 13,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: 'var(--accent)',
              color: '#0E0E0E',
              fontWeight: 800,
              fontSize: 13,
              padding: '12px 0',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(170,255,0,0.15)',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? 'Memproses...' : mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '5px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#1c1c21' }} />
          <span style={{ fontSize: 10, color: '#444', fontWeight: 700 }}>ATAU</span>
          <div style={{ flex: 1, height: 1, background: '#1c1c21' }} />
        </div>

        <button 
          type="button" 
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            background: '#09090B',
            border: '1px solid #1c1c21',
            borderRadius: 12,
            padding: '10px 0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyItems: 'center',
            justifyContent: 'center',
            gap: 10,
            color: '#ddd',
            fontSize: 12,
            fontWeight: 700,
            transition: 'background 0.2s'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Masuk dengan Google</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
          <button 
            type="button" 
            onClick={continueAsGuest}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 700,
              textDecoration: 'underline',
              transition: 'color 0.2s'
            }}
          >
            Lanjutkan sebagai Tamu
          </button>
        </div>
      </div>
    </div>
  );
}
