'use client';

import React, { useEffect, useState } from 'react';
import { WebMidi } from 'webmidi';
import * as Tone from 'tone';

const PianoMidiEngine = () => {
  const [midiStatus, setMidiStatus] = useState('Initializing MIDI...');
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());

  useEffect(() => {
    const initMidi = async () => {
      try {
        await WebMidi.enable();
        setMidiStatus('MIDI Ready');

        WebMidi.inputs.forEach(input => {
          input.addListener('noteon', e => {
            const noteNumber = e.note.number;
            setActiveNotes(prev => new Set(prev).add(noteNumber));
            // Basic sound trigger
            const synth = new Tone.Synth().toDestination();
            synth.triggerAttackRelease(e.note.identifier, "8n");
          });

          input.addListener('noteoff', e => {
            setActiveNotes(prev => {
              const next = new Set(prev);
              next.delete(e.note.number);
              return next;
            });
          });
        });
      } catch (err) {
        setMidiStatus('MIDI Access Denied');
        console.error(err);
      }
    };

    initMidi();

    return () => {
      WebMidi.disable();
    };
  }, []);

  return (
    <div className="p-4 border rounded bg-gray-900 text-white my-4">
      <h3 className="text-xl font-bold mb-2">Piano MIDI Engine</h3>
      <p className="text-sm mb-4">Status: {midiStatus}</p>
      <div className="flex gap-2">
        {Array.from(activeNotes).map(note => (
          <span key={note} className="px-2 py-1 bg-blue-600 rounded text-xs">
            Note: {note}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PianoMidiEngine;
