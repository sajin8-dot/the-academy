const { execSync } = require('child_process');
console.log(execSync('curl -s https://academy.sebastianchandy.com/article/piano/the-ear-first-foundation | grep -o "SHEET_MUSIC. notes=.[^\"]*."').toString());
