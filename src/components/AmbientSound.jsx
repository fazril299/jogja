import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useCultureBook } from '../context/CultureBookContext';

export default function AmbientSound() {
  const { isAudioEnabled, setIsAudioEnabled, activeSoundType } = useCultureBook();
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isAudioEnabled) {
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Initialize Web Audio Context on user opt-in
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
        const master = audioCtxRef.current.createGain();
        master.gain.value = 0.15; // Pleasant, gentle ambient level
        master.connect(audioCtxRef.current.destination);
        masterGainRef.current = master;
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Play procedural soothing tones based on activeSoundType
      if (intervalRef.current) clearInterval(intervalRef.current);

      if (activeSoundType === 'gamelan') {
        // Pentatonic chime strikes (Slendro / Pelog simulation)
        const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        const playChime = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
          const osc = audioCtxRef.current.createOscillator();
          const gain = audioCtxRef.current.createGain();
          const freq = notes[Math.floor(Math.random() * notes.length)];
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
          
          gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 3.5);

          osc.connect(gain);
          gain.connect(masterGainRef.current);

          osc.start();
          osc.stop(audioCtxRef.current.currentTime + 3.6);
        };

        playChime();
        intervalRef.current = setInterval(playChime, 4000);
      } else {
        // Soft nature breeze / ocean drone
        const osc = audioCtxRef.current.createOscillator();
        const filter = audioCtxRef.current.createBiquadFilter();
        const gain = audioCtxRef.current.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, audioCtxRef.current.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, audioCtxRef.current.currentTime);

        gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 5.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainRef.current);

        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 5.0);

        intervalRef.current = setInterval(() => {
          if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
          const oscNext = audioCtxRef.current.createOscillator();
          const filterNext = audioCtxRef.current.createBiquadFilter();
          const gainNext = audioCtxRef.current.createGain();

          oscNext.type = 'triangle';
          oscNext.frequency.setValueAtTime(110 + Math.random() * 20, audioCtxRef.current.currentTime);

          filterNext.type = 'lowpass';
          filterNext.frequency.setValueAtTime(250 + Math.random() * 150, audioCtxRef.current.currentTime);

          gainNext.gain.setValueAtTime(0.03, audioCtxRef.current.currentTime);
          gainNext.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 6.0);

          oscNext.connect(filterNext);
          filterNext.connect(gainNext);
          gainNext.connect(masterGainRef.current);

          oscNext.start();
          oscNext.stop(audioCtxRef.current.currentTime + 6.0);
        }, 5000);
      }
    } catch (e) {
      console.warn('Web Audio Ambient error:', e);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAudioEnabled, activeSoundType]);

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  return (
    <button
      onClick={toggleAudio}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
        isAudioEnabled
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(212,175,55,0.25)]'
          : 'bg-[#161B22]/80 text-neutral-400 border-neutral-700/60 hover:text-white hover:border-neutral-500'
      }`}
      title={isAudioEnabled ? 'Matikan audio latar' : 'Aktifkan audio latar budaya'}
    >
      {isAudioEnabled ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="hidden sm:inline">Audio Aktif</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden sm:inline">Audio Nonaktif</span>
        </>
      )}
    </button>
  );
}
