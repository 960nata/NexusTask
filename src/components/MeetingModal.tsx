'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useBoard, type MeetScope } from '@/lib/boardStore';
import { useMeeting } from '@/lib/useMeeting';
import { Ic, UserAvatar } from './ui';

function VideoTile({ stream, label, you = false, camOff = false, fallbackId }: { stream: MediaStream | null; label: string; you?: boolean; camOff?: boolean; fallbackId?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (ref.current && stream) ref.current.srcObject = stream; }, [stream]);
  return (
    <div style={{ position: 'relative', background: '#0a0a0a', border: '1px solid #222', borderRadius: 14, overflow: 'hidden', aspectRatio: '16/10' }}>
      <video ref={ref} autoPlay playsInline muted={you} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: you ? 'scaleX(-1)' : 'none', display: camOff ? 'none' : 'block' }} />
      {camOff && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {fallbackId ? <UserAvatar id={fallbackId} size={56} ring="#0a0a0a" /> : <div style={{ color: '#444' }}>{Ic.video('#444', 40)}</div>}
        </div>
      )}
      <div style={{ position: 'absolute', left: 8, bottom: 8, fontSize: 11, fontWeight: 600, color: '#fff', background: 'rgba(0,0,0,.55)', borderRadius: 7, padding: '3px 9px' }}>{label}{you ? ' (kamu)' : ''}</div>
    </div>
  );
}

const sel: React.CSSProperties = { background: '#0E0E0E', border: '1px solid #262626', borderRadius: 8, padding: '7px 10px', color: '#ddd', fontSize: 12, outline: 'none', maxWidth: 180 };

export default function MeetingModal({ onClose }: { onClose: () => void }) {
  const board = useBoard();
  const me = board.users.find((u) => u.role === 'Owner') || board.users.find((u) => u.role === 'Superadmin') || board.users[0];
  const meeting = board.meeting;
  const inRoom = !!meeting;

  const [scope, setScope] = useState<MeetScope>('board');
  const [target, setTarget] = useState<string>(board.users.find((u) => u.id !== me?.id)?.id || '');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'now' | 'schedule'>('now');
  const [schedTitle, setSchedTitle] = useState('');
  const [schedAt, setSchedAt] = useState('');
  const [now] = useState(() => Date.now());

  const scopeText = (s: MeetScope, t?: string) => s === 'all' ? 'Semua tim' : s === 'dm' ? `1-on-1 · ${board.userById(t || '')?.name ?? ''}` : `Board · ${board.activeBoard?.name ?? ''}`;
  const upcoming = [...board.scheduledMeets].sort((a, b) => a.at - b.at);

  const submitSchedule = () => {
    if (!schedTitle.trim() || !schedAt) return;
    board.scheduleMeet({ title: schedTitle.trim(), scope, target: scope === 'dm' ? target : undefined, at: new Date(schedAt).getTime(), hostId: me?.id || 'me' });
    setSchedTitle(''); setSchedAt('');
  };

  const mt = useMeeting({ roomId: meeting?.id || '', selfName: me?.name || 'Saya', active: inRoom });

  const invited = useMemo(() => {
    if (!meeting) return [];
    if (meeting.scope === 'all') return board.users;
    if (meeting.scope === 'dm') return board.users.filter((u) => u.id === meeting.hostId || u.id === meeting.target);
    return board.users;
  }, [meeting, board.users]);

  const scopeLabel = meeting
    ? meeting.scope === 'all' ? 'Semua tim'
      : meeting.scope === 'dm' ? `1-on-1 · ${board.userById(meeting.target || '')?.name ?? ''}`
      : `Board · ${board.activeBoard?.name ?? ''}`
    : '';

  const copyInvite = async () => {
    try { await navigator.clipboard.writeText(`${location.origin}/app`); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ }
  };

  const leave = () => { if (me?.id === meeting?.hostId) board.endMeeting(); onClose(); };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(3px)', zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: inRoom ? 960 : 460, maxHeight: '88vh', background: '#141414', border: '1px solid #242424', borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.6)' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid #1F1F1F', flex: 'none' }}>
          {Ic.video('var(--accent)', 18)}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{inRoom ? 'Meeting berlangsung' : 'Buat meeting'}</div>
            <div style={{ fontSize: 10, color: '#666' }}>{inRoom ? scopeLabel : 'Native WebRTC · tanpa pihak ke-3'}</div>
          </div>
          {inRoom && <button onClick={copyInvite} style={{ fontSize: 11, fontWeight: 700, color: copied ? '#0E0E0E' : '#ddd', background: copied ? 'var(--accent)' : '#1C1C1C', border: '1px solid #2A2A2A', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', flex: 'none' }}>{copied ? 'Tersalin!' : 'Salin undangan'}</button>}
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: '#1C1C1C', border: '1px solid #262626', color: '#888', cursor: 'pointer', fontSize: 16, flex: 'none' }}>×</button>
        </div>

        {!inRoom ? (
          /* ── CREATE ── */
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
            <div style={{ display: 'flex', gap: 6, background: '#0E0E0E', border: '1px solid #222', borderRadius: 10, padding: 3 }}>
              {([['now', 'Sekarang'], ['schedule', 'Terjadwal']] as const).map(([k, l]) => (
                <button key={k} onClick={() => setMode(k)} style={{ flex: 1, padding: '7px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: mode === k ? 'var(--accent)' : 'transparent', color: mode === k ? '#0E0E0E' : '#888' }}>{l}</button>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: '#888', marginBottom: 10 }}>SIAPA YANG DIUNDANG?</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {([
                  { k: 'board' as const, t: `Board ini · ${board.activeBoard?.name ?? ''}`, d: 'Semua anggota board aktif' },
                  { k: 'all' as const, t: 'Semua tim', d: `${board.users.length} anggota workspace` },
                  { k: 'dm' as const, t: '1-on-1 (man to man)', d: 'Pilih satu orang' },
                ]).map((o) => (
                  <button key={o.k} onClick={() => setScope(o.k)} style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', background: scope === o.k ? 'var(--accent-dark)' : '#0E0E0E', border: `1px solid ${scope === o.k ? 'var(--accent)' : '#262626'}`, borderRadius: 12, padding: '12px 14px', cursor: 'pointer' }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${scope === o.k ? 'var(--accent)' : '#444'}`, background: scope === o.k ? 'var(--accent)' : 'transparent', flex: 'none' }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{o.t}</div>
                      <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{o.d}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {scope === 'dm' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: '#888', marginBottom: 10 }}>PILIH ORANG</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {board.users.filter((u) => u.id !== me?.id).map((u) => (
                    <button key={u.id} onClick={() => setTarget(u.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: target === u.id ? 'var(--accent-dark)' : '#0E0E0E', border: `1px solid ${target === u.id ? 'var(--accent)' : '#262626'}`, borderRadius: 20, padding: '5px 12px 5px 5px', cursor: 'pointer' }}>
                      <UserAvatar id={u.id} size={24} ring={target === u.id ? 'var(--accent-dark)' : '#0E0E0E'} />
                      <span style={{ fontSize: 12, color: '#ddd' }}>{u.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'now' ? (
              <button onClick={() => board.startMeeting(scope, me?.id || 'me', scope === 'dm' ? target : undefined)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--accent)', color: '#0E0E0E', border: 'none', borderRadius: 12, padding: '12px', cursor: 'pointer', fontSize: 14, fontWeight: 800 }}>
                {Ic.video('#0E0E0E', 16)} Buat & mulai meeting
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input value={schedTitle} onChange={(e) => setSchedTitle(e.target.value)} placeholder="Judul meeting (mis. Sprint Review)"
                  style={{ background: '#0E0E0E', border: '1px solid #262626', borderRadius: 10, padding: '10px 12px', color: '#ddd', fontSize: 13, outline: 'none' }} />
                <input type="datetime-local" value={schedAt} onChange={(e) => setSchedAt(e.target.value)}
                  style={{ background: '#0E0E0E', border: '1px solid #262626', borderRadius: 10, padding: '10px 12px', color: '#ddd', fontSize: 13, outline: 'none', colorScheme: 'dark' }} />
                <button onClick={submitSchedule} disabled={!schedTitle.trim() || !schedAt}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: (!schedTitle.trim() || !schedAt) ? '#1C1C1C' : 'var(--accent)', color: (!schedTitle.trim() || !schedAt) ? '#555' : '#0E0E0E', border: 'none', borderRadius: 12, padding: '12px', cursor: (!schedTitle.trim() || !schedAt) ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 800 }}>
                  {Ic.calendar((!schedTitle.trim() || !schedAt) ? '#555' : '#0E0E0E')} Jadwalkan meeting
                </button>
              </div>
            )}

            {upcoming.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: '#888', marginBottom: 10 }}>MEETING TERJADWAL</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {upcoming.map((s) => {
                    const past = s.at < now;
                    return (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0E0E0E', border: '1px solid #1F1F1F', borderRadius: 12, padding: '10px 12px' }}>
                        <div style={{ flex: 'none' }}>{Ic.calendar(past ? '#FF6B6B' : 'var(--accent)')}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                          <div style={{ fontSize: 10, color: past ? '#FF6B6B' : '#888', marginTop: 2 }}>
                            {new Date(s.at).toLocaleString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {scopeText(s.scope, s.target)}
                          </div>
                        </div>
                        <button onClick={() => { board.startMeeting(s.scope, me?.id || 'me', s.target); board.deleteScheduledMeet(s.id); }} title="Mulai sekarang"
                          style={{ fontSize: 11, fontWeight: 700, color: '#0E0E0E', background: 'var(--accent)', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', flex: 'none' }}>Mulai</button>
                        <button onClick={() => board.deleteScheduledMeet(s.id)} title="Hapus jadwal"
                          style={{ width: 26, height: 26, borderRadius: 8, background: 'transparent', border: '1px solid #262626', color: '#888', cursor: 'pointer', fontSize: 14, flex: 'none' }}>×</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ fontSize: 10, color: '#555', textAlign: 'center', lineHeight: 1.5 }}>
              Video peer-to-peer langsung di browser (WebRTC). Bisa langsung dites antar-tab di perangkat ini. Beda perangkat lewat internet butuh signaling server (langkah lanjutan).
            </div>
          </div>
        ) : (
          /* ── ROOM ── */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {mt.error && <div style={{ background: '#2a1215', color: '#ff8a80', fontSize: 12, padding: '8px 16px' }}>{mt.error}</div>}

            <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'grid', gap: 12, gridTemplateColumns: `repeat(${Math.min(2, 1 + mt.peers.length) || 1}, 1fr)` }}>
              <VideoTile stream={mt.localStream} label={me?.name || 'Saya'} you camOff={!mt.camOn} fallbackId={me?.id} />
              {mt.peers.map((p) => <VideoTile key={p.key} stream={p.stream} label={p.name} />)}
              {mt.peers.length === 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #262626', borderRadius: 14, color: '#555', fontSize: 12, textAlign: 'center', padding: 16, aspectRatio: '16/10' }}>
                  Menunggu peserta lain bergabung…<br />Bagikan undangan / buka di tab lain.
                </div>
              )}
            </div>

            {/* invited row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px 10px' }}>
              <span style={{ fontSize: 10, color: '#666' }}>Diundang:</span>
              <div style={{ display: 'flex' }}>{invited.map((u, i) => <UserAvatar key={u.id} id={u.id} size={22} ring="#141414" overlap={i > 0} />)}</div>
            </div>

            {/* controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: 14, borderTop: '1px solid #1F1F1F', flex: 'none' }}>
              <button onClick={mt.toggleMic} title={mt.micOn ? 'Matikan mic' : 'Nyalakan mic'} style={ctrl(mt.micOn)}>{mt.micOn ? Ic.mic('#ddd', 16) : Ic.micOff('#FF6B6B', 16)}</button>
              <button onClick={mt.toggleCam} title={mt.camOn ? 'Matikan kamera' : 'Nyalakan kamera'} style={ctrl(mt.camOn)}>{mt.camOn ? Ic.video('#ddd', 16) : Ic.video('#FF6B6B', 16)}</button>
              <button onClick={mt.toggleShare} title={mt.sharing ? 'Stop share layar' : 'Share layar'} style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: mt.sharing ? 'var(--accent-dark)' : '#1C1C1C', border: `1px solid ${mt.sharing ? 'var(--accent)' : '#2A2A2A'}` }}>{Ic.screen(mt.sharing ? 'var(--accent)' : '#ddd', 16)}</button>
              <select value={mt.camId} onChange={(e) => mt.setCamId(e.target.value)} style={sel} title="Pilih kamera">
                <option value="">Kamera default</option>
                {mt.cams.map((c) => <option key={c.deviceId} value={c.deviceId}>{c.label}</option>)}
              </select>
              <select value={mt.micId} onChange={(e) => mt.setMicId(e.target.value)} style={sel} title="Pilih mikrofon">
                <option value="">Mic default</option>
                {mt.mics.map((m) => <option key={m.deviceId} value={m.deviceId}>{m.label}</option>)}
              </select>
              <div style={{ flex: 1 }} />
              <button onClick={leave} style={{ background: '#FF6B6B', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 800 }}>
                {me?.id === meeting?.hostId ? 'Akhiri meeting' : 'Keluar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ctrl(on: boolean): React.CSSProperties {
  return { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, background: on ? '#1C1C1C' : '#3a1a1a', border: `1px solid ${on ? '#2A2A2A' : '#5c2b2e'}` };
}
