'use client';

import React, { useCallback, useState, useRef } from 'react';
import * as Tone from 'tone';

interface PlayMidiProps {
  sequence: string; // e.g. '"E4", "E4", "F4", "G4"'
}

export default function PlayMidi({ sequence }: PlayMidiProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<Tone.Sampler | null>(null);

  const initSynth = async () => {
    if (synthRef.current) return synthRef.current;
    
    await Tone.start();
    return new Promise<Tone.Sampler>((resolve) => {
      const sampler = new Tone.Sampler({
        urls: {
          A1: "A1.mp3",
          A2: "A2.mp3",
          A3: "A3.mp3",
          A4: "A4.mp3",
          A5: "A5.mp3",
          C1: "C1.mp3",
          C2: "C2.mp3",
          C3: "C3.mp3",
          C4: "C4.mp3",
          C5: "C5.mp3",
          "D#4": "Ds4.mp3",
          "F#4": "Fs4.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/salamander/",
        onload: () => {
          synthRef.current = sampler;
          resolve(sampler);
        }
      }).toDestination();
    });
  };

  const handlePlay = useCallback(async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    try {
      const synth = await initSynth();
      
      let notes: string[] = [];
      try {
        const jsonValue = `[${sequence}]`;
        notes = JSON.parse(jsonValue.replace(/'/g, '"'));
      } catch (e) {
        notes = sequence.replace(/[\[\]"]/g, '').split(',').map(n => n.trim());
      }
      
      const now = Tone.now();
      notes.forEach((note, i) => {
        synth.triggerAttackRelease(note, "4n", now + i * 0.5);
      });
      
      setTimeout(() => {
        setIsPlaying(false);
      }, notes.length * 500 + 500);

    } catch (e) {
      console.error("Failed to play MIDI sequence", e);
      setIsPlaying(false);
    }
  }, [sequence, isPlaying]);

  return (
    <div className="my-4 border-l-4 border-gold-400 pl-4 py-1">
      <button 
        onClick={handlePlay} 
        disabled={isPlaying}
        className={`px-4 py-2 rounded font-medium text-sm transition-colors inline-flex items-center gap-2
          ${isPlaying 
            ? 'bg-gold-50 text-gold-700 border border-gold-200' 
            : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-200'}`}
      >
        {isPlaying ? (
          <>
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            Playing Demo...
          </>
        ) : (
          <>
            <span>▶</span> Listen to Reference Melody
          </>
        )}
      </button>
    </div>
  );
}