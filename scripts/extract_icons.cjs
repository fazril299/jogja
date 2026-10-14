const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'page.html'), 'utf-8');
const dir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const list = [
  { name: 'all_destinations', cls: 'framer-frSQ3' },
  { name: 'culture_icons', cls: 'framer-39TId' },
  { name: 'nature_escapes', cls: 'framer-0Jrc4' },
  { name: 'food_journeys', cls: 'framer-7U6Ld' },
  { name: 'soul_reset', cls: 'framer-3kAhe' }
];

list.forEach(item => {
  const cIdx = html.indexOf('.' + item.cls);
  if (cIdx !== -1) {
    const chunk = html.substring(cIdx, cIdx + 30000);
    const marker = 'data:image/svg+xml,';
    const mIdx = chunk.indexOf(marker);
    if (mIdx !== -1) {
      const start = mIdx + marker.length;
      const svgEnd = chunk.indexOf('</svg>', start);
      if (svgEnd !== -1) {
        let svg = chunk.substring(start, svgEnd + 6);
        svg = svg.replace(/\\"/g, '"').replace(/var\(--1eb46ul,[^)]+\)/g, 'currentColor');
        fs.writeFileSync(path.join(dir, item.name + '.svg'), svg, 'utf-8');
        console.log('Saved:', item.name, svg.length, 'bytes');
      }
    }
  }
});
