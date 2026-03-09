'use client';

import React, { useEffect, useState } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'midi-player': any;
      'midi-visualizer': any;
    }
  }
}

export default function VisualMidiPlayer() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/combine/npm/html-midi-player@1.5.0/dist/midi-player.min.js,npm/html-midi-player@1.5.0/dist/visualizer.min.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  if (!isLoaded) return <div className="p-4 text-xs font-mono text-zinc-400">Loading Visualizer...</div>;
  
  return (
    <div className="midi-visualizer-container my-8 p-4 bg-zinc-900 rounded-lg shadow-inner">
      <div className="flex flex-col gap-4">
        <midi-visualizer 
          type="piano-roll" 
          src="/midi/ode-to-joy.mid"
          id="myVisualizer"
          style={{ width: '100%', height: '200px', display: 'block' }}
        ></midi-visualizer>
        
        <midi-player 
          src="/midi/ode-to-joy.mid" 
          sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
          visualizer="#myVisualizer"
          style={{ width: '100%', display: 'block' }}
        ></midi-player>
      </div>
      <p className="text-center text-[10px] text-zinc-500 mt-4 font-mono uppercase tracking-widest">Interactive Piano Roll</p>
    </div>
  );
}
