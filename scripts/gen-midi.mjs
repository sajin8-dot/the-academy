import pkg from '@tonejs/midi';
const { Midi } = pkg;
import fs from 'fs';

const midi = new Midi();
const track = midi.addTrack();

// Ode to Joy sequence from Lesson 2
const notes = [
  "E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4", "C4", "C4", "D4", "E4", "E4", "D4", "D4"
];

notes.forEach((note, i) => {
  track.addNote({
    name: note,
    time: i * 0.5,
    duration: 0.4
  });
});

fs.writeFileSync('public/midi/ode-to-joy.mid', Buffer.from(midi.toArray()));
