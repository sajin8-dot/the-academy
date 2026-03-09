'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { WebMidi, Input, NoteMessageEvent } from 'webmidi';

interface MidiControllerProps {
  content: string;
}

export default function MidiController({ content }: MidiControllerProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'disabled'>('loading');
  const [activeTask, setActiveTask] = useState<{
    target: string;
    sequence?: string[];
    onSuccess?: string;
    onFailure?: string;
  } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [bloom, setBloom] = useState<{ intensity: string; color: string } | null>(null);

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

  // Simple parser for [AWAIT MIDI] tags
  useEffect(() => {
    const awaitMatch = content.match(/\[AWAIT MIDI: ([^\]]+)\]/);
    if (awaitMatch) {
      const paramsStr = awaitMatch[1];
      const params: any = {};
      
      // Basic key-value parser for the tag
      paramsStr.split(',').forEach(param => {
        const [key, value] = param.split('=').map(s => s.trim().replace(/['"]/g, ''));
        if (key === 'sequence') {
            try {
                params[key] = JSON.parse(value.replace(/'/g, '"'));
            } catch(e) {
                params[key] = [value];
            }
        } else {
            params[key] = value;
        }
      });

      // Look for ON SUCCESS / ON FAILURE siblings
      const successMatch = content.match(/\[ON SUCCESS: ([^\]]+)\]/);
      const failureMatch = content.match(/\[ON FAILURE: ([^\]]+)\]/);

      setActiveTask({
        target: params.target,
        sequence: params.sequence,
        onSuccess: successMatch ? successMatch[1] : undefined,
        onFailure: failureMatch ? failureMatch[1] : undefined,
      });
    }
  }, [content]);

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
      input.addListener('noteon', handleMidiInput);
      return () => {
        input.removeListener('noteon');
      };
    }
  }, [status, handleMidiInput]);

  if (status === 'disabled') return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white/80 backdrop-blur border border-zinc-200 shadow-xl rounded-lg max-w-sm z-50">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${status === 'ready' ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
          MIDI Engine: {status}
        </span>
      </div>
      
      {activeTask && (
        <div className="mt-4">
          <p className="text-sm font-medium text-zinc-800">
            Waiting for: <code className="bg-zinc-100 px-1 rounded">{activeTask.target || activeTask.sequence?.join(', ')}</code>
          </p>
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
  );
}
