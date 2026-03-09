'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { WebMidi, Input, NoteMessageEvent } from 'webmidi';
import * as Tone from 'tone';
import SheetMusic from './SheetMusic';

interface MidiControllerProps {
  content: string;
}

export default function MidiController({ content }: MidiControllerProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'disabled'>('loading');
  const [activeTask, setActiveTask] = useState<{
    target?: string;
    sequence?: string[];
    onSuccess?: string;
    onFailure?: string;
  } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [bloom, setBloom] = useState<{ intensity: string; color: string } | null>(null);
  const [sheetNotes, setSheetNotes] = useState<string | null>(null);

  const synthRef = useRef<Tone.Synth | null>(null);
  const dronePlaying = useRef(false);

  useEffect(() => {
    WebMidi.enable()
      .then(() => {
        setStatus('ready');
        console.log('WebMidi enabled');
      })
      .catch((err) => {
        console.error('WebMidi could not be enabled', err);
        setStatus('error');
      });

    return () => {
      WebMidi.disable();
    };
  }, []);

  useEffect(() => {
    // 1. AWAIT MIDI parser
    const awaitMatch = content.match(/\[AWAIT MIDI: ([^\]]+)\]/);
    if (awaitMatch) {
      const paramsStr = awaitMatch[1];
      const params: { [key: string]: any } = {};
      
      paramsStr.split(',').forEach(param => {
        const parts = param.split('=');
        if (parts.length === 2) {
          const key = parts[0].trim();
          let value = parts[1].trim().replace(/^['"]|['"]$/g, '');
          
          if (key === 'sequence') {
            try {
              const jsonValue = value.replace(/'/g, '"');
              params[key] = JSON.parse(jsonValue);
            } catch(e) {
              params[key] = value.replace(/[\[\]]/g, '').split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
            }
          } else {
            params[key] = value;
          }
        }
      });

      const successMatch = content.match(/\[ON SUCCESS: ([^\]]+)\]/);
      const failureMatch = content.match(/\[ON FAILURE: ([^\]]+)\]/);

      setActiveTask({
        target: params.target,
        sequence: params.sequence,
        onSuccess: successMatch ? successMatch[1] : undefined,
        onFailure: failureMatch ? failureMatch[1] : undefined,
      });
    } else {
      setActiveTask(null);
    }

    // 2. SHEET_MUSIC parser
    const sheetMatch = content.match(/\[SHEET_MUSIC: notes="([^"]+)"\]/);
    if (sheetMatch) {
      setSheetNotes(sheetMatch[1]);
    }

  }, [content]);

  // Expose a function to initialize the drone
  const handleStartDrone = useCallback(async () => {
    try {
      await Tone.start();
      if (!synthRef.current) {
        synthRef.current = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 2, decay: 0, sustain: 1, release: 5 }
        }).toDestination();
      }

      if (!dronePlaying.current) {
        // Find frequency
        const droneMatch = content.match(/\[START DRONE: frequency=([^,]+)/);
        const freq = droneMatch ? parseFloat(droneMatch[1]) : 261.63;
        if (!isNaN(freq)) {
          synthRef.current.triggerAttack(freq);
          dronePlaying.current = true;
        }
      }
    } catch (e) {
      console.error("Drone failed to start", e);
    }
  }, [content]);

  const handleStopDrone = useCallback(() => {
    if (synthRef.current && dronePlaying.current) {
      synthRef.current.triggerRelease();
      dronePlaying.current = false;
    }
  }, []);

  useEffect(() => {
    // Attach to window so user can click to start (Tone.js requires user gesture)
    (window as any).startToneDrone = handleStartDrone;
    (window as any).stopToneDrone = handleStopDrone;
    
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
    };
  }, [handleStartDrone, handleStopDrone]);

  const handleMidiInput = useCallback((e: NoteMessageEvent) => {
    if (!activeTask) return;

    const playedNote = e.note.name + e.note.octave;
    console.log('Played note:', playedNote);

    const isMatch = activeTask.target === playedNote || 
                   (activeTask.sequence && activeTask.sequence.includes(playedNote));

    if (isMatch) {
      setFeedback('Success!');
      if (activeTask.onSuccess) {
        const bloomMatch = activeTask.onSuccess.match(/BLOOM intensity=([^,]+), color="([^"]+)"/);
        if (bloomMatch) {
          setBloom({ intensity: bloomMatch[1], color: bloomMatch[2] });
        }
      }
    } else {
      if (activeTask.onFailure) {
        const feedbackMatch = activeTask.onFailure.match(/feedback="([^"]+)"/);
        if (feedbackMatch) {
          setFeedback(feedbackMatch[1]);
        }
      }
    }
  }, [activeTask]);

  useEffect(() => {
    if (status === 'ready' && WebMidi.inputs.length > 0) {
      const input = WebMidi.inputs[0];
      if (input && input.addListener) { input.addListener('noteon', handleMidiInput); }
      return () => {
        input.removeListener('noteon');
      };
    }
  }, [status, handleMidiInput]);

  if (status === 'disabled') return null;

  const handlePlayNotes = useCallback(async (notesToPlay: string[]) => {
    try {
      await Tone.start();
      const piano = new Tone.Sampler({
        urls: {
          A1: "A1.mp3",
          A2: "A2.mp3",
          A3: "A3.mp3",
          A4: "A4.mp3",
          A5: "A5.mp3",
          A6: "A6.mp3",
          A7: "A7.mp3",
          C1: "C1.mp3",
          C2: "C2.mp3",
          C3: "C3.mp3",
          C4: "C4.mp3",
          C5: "C5.mp3",
          C6: "C6.mp3",
          C7: "C7.mp3",
          C8: "C8.mp3",
          "D#1": "Ds1.mp3",
          "D#2": "Ds2.mp3",
          "D#3": "Ds3.mp3",
          "D#4": "Ds4.mp3",
          "D#5": "Ds5.mp3",
          "D#6": "Ds6.mp3",
          "D#7": "Ds7.mp3",
          "F#1": "Fs1.mp3",
          "F#2": "Fs2.mp3",
          "F#3": "Fs3.mp3",
          "F#4": "Fs4.mp3",
          "F#5": "Fs5.mp3",
          "F#6": "Fs6.mp3",
          "F#7": "Fs7.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/salamander/",
        onload: () => {
          const now = Tone.now();
          notesToPlay.forEach((note, i) => {
            piano.triggerAttackRelease(note, "4n", now + i * 0.5);
          });
        }
      }).toDestination();
    } catch (e) {
      console.error("Playback failed", e);
    }
  }, []);

  return (
    <>
      {/* Visual rendering of sheet music if detected */}
      {sheetNotes && <SheetMusic notes={sheetNotes} />}

      <div className="fixed bottom-4 right-4 p-4 bg-white/80 backdrop-blur border border-zinc-200 shadow-xl rounded-lg max-w-sm z-50">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${status === 'ready' ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            MIDI Engine: {status}
          </span>
        </div>
        
        <div className="mb-2">
          <button 
            onClick={() => (window as any).startToneDrone?.()} 
            className="text-xs bg-zinc-200 hover:bg-zinc-300 text-zinc-800 px-2 py-1 rounded mr-2"
          >
            Start Drone
          </button>
          <button 
            onClick={() => (window as any).stopToneDrone?.()} 
            className="text-xs bg-zinc-200 hover:bg-zinc-300 text-zinc-800 px-2 py-1 rounded"
          >
            Stop Drone
          </button>
        </div>

        {activeTask && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-zinc-800">
                Waiting for: <code className="bg-zinc-100 px-1 rounded">{activeTask.target || activeTask.sequence?.join(', ')}</code>
              </p>
              {activeTask.sequence && (
                <button 
                  onClick={() => handlePlayNotes(activeTask.sequence!)}
                  className="text-[10px] bg-gold-100 text-gold-700 px-2 py-0.5 rounded border border-gold-200"
                >
                  Play Hint
                </button>
              )}
            </div>
            {feedback && (
              <p className={`mt-2 text-xs font-serif italic ${feedback === 'Success!' ? 'text-gold-600' : 'text-zinc-500'}`}>
                {feedback}
              </p>
            )}
          </div>
        )}

        {bloom && (
          <div 
            className="absolute -top-2 -left-2 w-4 h-4 rounded-full animate-ping"
            style={{ backgroundColor: bloom.color }}
          />
        )}

        {status === 'ready' && WebMidi.inputs.length === 0 && (
          <p className="mt-2 text-[10px] text-zinc-400">Connect a MIDI device to interact.</p>
        )}
      </div>
    </>
  );
}
