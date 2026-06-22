'use client';

// This hook manages external systems (media devices, WebRTC peers, BroadcastChannel)
// inside effects and must sync that state back to React — the intended use of
// effects — so the set-state-in-effect rule is disabled for the whole file.
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useRef, useState } from 'react';

export type DeviceInfo = { deviceId: string; label: string };
export type RemotePeer = { key: string; name: string; stream: MediaStream | null };

type Signal =
  | { kind: 'hello'; from: string; name: string }
  | { kind: 'bye'; from: string }
  | { kind: 'offer'; from: string; to: string; name: string; sdp: RTCSessionDescriptionInit }
  | { kind: 'answer'; from: string; to: string; sdp: RTCSessionDescriptionInit }
  | { kind: 'ice'; from: string; to: string; candidate: RTCIceCandidateInit };

const rand = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/**
 * Native peer-to-peer meeting (no third party). Signaling runs over
 * BroadcastChannel, so it connects tabs on the SAME device/origin. Cross-device
 * over the internet additionally needs a signaling server + STUN/TURN.
 * iceServers is empty on purpose → host/LAN candidates only (fully self-hosted).
 */
export function useMeeting({ roomId, selfName, active }: { roomId: string; selfName: string; active: boolean }) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<RemotePeer[]>([]);
  const [cams, setCams] = useState<DeviceInfo[]>([]);
  const [mics, setMics] = useState<DeviceInfo[]>([]);
  const [camId, setCamId] = useState<string>('');
  const [micId, setMicId] = useState<string>('');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const screen = useRef<MediaStream | null>(null);

  const selfKey = useRef<string>(rand());
  const bc = useRef<BroadcastChannel | null>(null);
  const pcs = useRef<Map<string, RTCPeerConnection>>(new Map());
  const names = useRef<Map<string, string>>(new Map());
  const local = useRef<MediaStream | null>(null);

  const refreshPeers = useCallback(() => {
    setPeers(Array.from(pcs.current.keys()).map((k) => ({
      key: k,
      name: names.current.get(k) || 'Peer',
      stream: (pcs.current.get(k) as RTCPeerConnection & { _remote?: MediaStream })._remote || null,
    })));
  }, []);

  const send = (s: Signal) => { try { bc.current?.postMessage(s); } catch { /* ignore */ } };

  const makePc = useCallback((peerKey: string, peerName: string) => {
    if (pcs.current.has(peerKey)) return pcs.current.get(peerKey)!;
    const pc = new RTCPeerConnection({ iceServers: [] }) as RTCPeerConnection & { _remote?: MediaStream };
    names.current.set(peerKey, peerName);
    pc._remote = new MediaStream();
    local.current?.getTracks().forEach((t) => pc.addTrack(t, local.current!));
    pc.onicecandidate = (e) => { if (e.candidate) send({ kind: 'ice', from: selfKey.current, to: peerKey, candidate: e.candidate.toJSON() }); };
    pc.ontrack = (e) => { e.streams[0]?.getTracks().forEach((t) => pc._remote!.addTrack(t)); refreshPeers(); };
    pc.onconnectionstatechange = () => {
      if (['failed', 'closed', 'disconnected'].includes(pc.connectionState)) { pc.close(); pcs.current.delete(peerKey); names.current.delete(peerKey); refreshPeers(); }
    };
    pcs.current.set(peerKey, pc);
    refreshPeers();
    return pc;
  }, [refreshPeers]);

  // acquire / re-acquire local media when device selection changes
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: camId ? { deviceId: { exact: camId } } : true,
          audio: micId ? { deviceId: { exact: micId } } : true,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        // stop previous
        local.current?.getTracks().forEach((t) => t.stop());
        local.current = stream;
        stream.getAudioTracks().forEach((t) => (t.enabled = micOn));
        stream.getVideoTracks().forEach((t) => (t.enabled = camOn));
        setLocalStream(stream);
        // replace tracks on existing peer connections
        pcs.current.forEach((pc) => {
          stream.getTracks().forEach((track) => {
            const sender = pc.getSenders().find((s) => s.track?.kind === track.kind);
            if (sender) sender.replaceTrack(track); else pc.addTrack(track, stream);
          });
        });
        // populate device lists (labels available after permission granted)
        const devs = await navigator.mediaDevices.enumerateDevices();
        if (cancelled) return;
        setCams(devs.filter((d) => d.kind === 'videoinput').map((d, i) => ({ deviceId: d.deviceId, label: d.label || `Kamera ${i + 1}` })));
        setMics(devs.filter((d) => d.kind === 'audioinput').map((d, i) => ({ deviceId: d.deviceId, label: d.label || `Mikrofon ${i + 1}` })));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Tidak bisa akses kamera/mikrofon');
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, camId, micId]);

  // signaling
  useEffect(() => {
    if (!active || !localStream) return;
    const chan = new BroadcastChannel(`meet:${roomId}`);
    bc.current = chan;
    const me = selfKey.current;

    chan.onmessage = async (ev: MessageEvent<Signal>) => {
      const msg = ev.data;
      if ('to' in msg && msg.to !== me) return;
      if (msg.from === me) return;
      try {
        if (msg.kind === 'hello') {
          const pc = makePc(msg.from, msg.name);
          // deterministic initiator: smaller key creates the offer (avoids glare)
          if (me < msg.from) {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            send({ kind: 'offer', from: me, to: msg.from, name: selfName, sdp: offer });
          }
        } else if (msg.kind === 'offer') {
          const pc = makePc(msg.from, msg.name);
          await pc.setRemoteDescription(msg.sdp);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          send({ kind: 'answer', from: me, to: msg.from, sdp: answer });
        } else if (msg.kind === 'answer') {
          const pc = pcs.current.get(msg.from);
          if (pc && pc.signalingState !== 'stable') await pc.setRemoteDescription(msg.sdp);
        } else if (msg.kind === 'ice') {
          const pc = pcs.current.get(msg.from);
          if (pc) await pc.addIceCandidate(msg.candidate).catch(() => {});
        } else if (msg.kind === 'bye') {
          const pc = pcs.current.get(msg.from);
          if (pc) { pc.close(); pcs.current.delete(msg.from); names.current.delete(msg.from); refreshPeers(); }
        }
      } catch { /* ignore signaling errors */ }
    };

    // announce presence
    send({ kind: 'hello', from: me, name: selfName });

    return () => {
      send({ kind: 'bye', from: me });
      chan.close();
      bc.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, localStream, roomId]);

  // teardown on leave
  useEffect(() => {
    if (active) return;
    pcs.current.forEach((pc) => pc.close());
    pcs.current.clear(); names.current.clear();
    local.current?.getTracks().forEach((t) => t.stop());
    screen.current?.getTracks().forEach((t) => t.stop());
    local.current = null; screen.current = null;
    setLocalStream(null); setPeers([]); setSharing(false);
  }, [active]);

  useEffect(() => () => {
    pcs.current.forEach((pc) => pc.close());
    local.current?.getTracks().forEach((t) => t.stop());
    screen.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const toggleMic = () => { const v = !micOn; setMicOn(v); local.current?.getAudioTracks().forEach((t) => (t.enabled = v)); };
  const toggleCam = () => { const v = !camOn; setCamOn(v); local.current?.getVideoTracks().forEach((t) => (t.enabled = v)); };

  const stopShare = useCallback(() => {
    screen.current?.getTracks().forEach((t) => t.stop());
    screen.current = null;
    const cam = local.current?.getVideoTracks()[0];
    if (cam) pcs.current.forEach((pc) => { const s = pc.getSenders().find((x) => x.track?.kind === 'video'); if (s) s.replaceTrack(cam); });
    setLocalStream(local.current);
    setSharing(false);
  }, []);

  const toggleShare = useCallback(async () => {
    if (sharing) { stopShare(); return; }
    try {
      const ds = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      screen.current = ds;
      const track = ds.getVideoTracks()[0];
      track.onended = () => stopShare();
      pcs.current.forEach((pc) => { const s = pc.getSenders().find((x) => x.track?.kind === 'video'); if (s) s.replaceTrack(track); });
      const audio = local.current?.getAudioTracks() || [];
      setLocalStream(new MediaStream([track, ...audio]));
      setSharing(true);
    } catch { /* user cancelled picker */ }
  }, [sharing, stopShare]);

  return { localStream, peers, cams, mics, camId, setCamId, micId, setMicId, micOn, camOn, sharing, toggleMic, toggleCam, toggleShare, error };
}
