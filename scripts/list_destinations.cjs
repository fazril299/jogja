const fs = require('fs');
const html = fs.readFileSync('scripts/page.html', 'utf-8');

const regex = /href="\.\/destinations\/([a-z0-9\-]+)"/g;
const set = new Set();
let m;
while ((m = regex.exec(html)) !== null) {
  set.add(m[1]);
}
console.log('Total destinations found:', set.size);
console.log(Array.from(set));
