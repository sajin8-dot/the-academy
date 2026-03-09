'use client';

import React, { useEffect, useRef } from 'react';
import { Vex } from 'vexflow';

interface SheetMusicProps {
  notes: string; // e.g., "C4/q, D4/q, E4/h"
  width?: number;
  height?: number;
}

const SheetMusic: React.FC<SheetMusicProps> = ({ notes, width = 400, height = 150 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous rendering
    containerRef.current.innerHTML = '';

    const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();

    const stave = new Stave(10, 40, width - 20);
    stave.addClef('treble').addTimeSignature('4/4');
    stave.setContext(context).draw();

    // Parse notes string "C4/q, D4/q, E4/h"
    const noteParts = notes.split(',').map(s => s.trim());
    const vexNotes = noteParts.map(part => {
      const [keys, duration] = part.split('/');
      return new StaveNote({
        keys: [keys],
        duration: duration || 'q',
      });
    });

    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(vexNotes);

    new Formatter().joinVoices([voice]).format([voice], width - 50);
    voice.draw(context, stave);
  }, [notes, width, height]);

  return <div ref={containerRef} className="sheet-music-container" />;
};

export default SheetMusic;
