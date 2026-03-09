'use client';

import React, { useEffect, useRef, useState } from 'react';

// We use a dynamic import or script tag because html-midi-player 
// is a web component that isn't easily SSR-friendly.
export default function VisualMidiPlayer({ notes }: { notes: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load the script for html-midi-player
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/combine/npm/html-midi-player@1.5.0/dist/midi-player.min.js,npm/html-midi-player@1.5.0/dist/visualizer.min.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!isLoaded) return <div className="p-4 text-xs font-mono text-zinc-400">Loading Visualizer...</div>;

  // For simplicity in Lesson 2, we can just point to a generated data URI or a static MIDI file
  // But since we want to play the *actual* notes from the lesson, we'd ideally generate a MIDI blob.
  // For now, let's provide a placeholder for the "Ode to Joy" MIDI file we can host.
  
  return (
    <div className="midi-visualizer-container my-8 p-4 bg-zinc-900 rounded-lg shadow-inner">
      <div className="flex flex-col gap-4">
        {/* @ts-ignore - custom element */}
        <midi-visualizer 
          type="piano-roll" 
          src="/midi/ode-to-joy.mid"
          style={{ width: '100%', height: '200px' }}
        ></midi-visualizer>
        
        {/* @ts-ignore - custom element */}
        <midi-player 
          src="/midi/ode-to-joy.mid" 
          sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
          visualizer="midi-visualizer"
        ></midi-player>
      </div>
      <p className="text-center text-[10px] text-zinc-500 mt-4 font-mono uppercase tracking-widest">Interactive Piano Roll</p>
    </div>
  );
}
