const str = 'sequence="E4", "E4", "F4", "G4", instrument="piano"';
const match = str.match(/sequence=(.+?)(?:,\s*[a-z]+=|$)/);
console.log(match ? match[1] : 'null');
