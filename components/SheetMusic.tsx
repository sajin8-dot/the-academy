'use client';

import React, { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';

interface SheetMusicProps {
  notes: string; // e.g., "C4/q, D4/q, E4/h"
}

const SheetMusic: React.FC<SheetMusicProps> = ({ notes }) => {
  const containerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous rendering by resetting width/height
    const canvas = containerRef.current;
    canvas.width = 400;
    canvas.height = 150;

    const renderer = new Renderer(canvas, Renderer.Backends.CANVAS);
    renderer.resize(400, 150);
    const context = renderer.getContext();
    context.clear();

    const stave = new Stave(10, 40, 350);
    stave.addClef('treble').addTimeSignature('4/4');
    stave.setContext(context).draw();

    const processedNotes = notes.split(',').map((n) => {
      const [key, duration] = n.trim().split('/');
      return new StaveNote({
        keys: [key.replace(/(\d)$/, '/$1')],
        duration: duration || 'q',
      });
    });

    const voice = new Voice({ numBeats: 4, beatValue: 4 });
    voice.addTickables(processedNotes);

    new Formatter().joinVoices([voice]).format([voice], 300);
    voice.draw(context, stave);
  }, [notes]);

  return (
    <div className="sheet-music-container my-8 p-4 bg-white border border-gray-200 rounded shadow-sm">
      <div className="flex justify-center">
        <canvas ref={containerRef} id="SHEET_MUSIC" />
      </div>
      <p className="text-center text-xs text-gray-400 mt-2 italic font-serif">Ear-to-Hand-to-Eye Bridge</p>
    </div>
  );
};

export default SheetMusic;
