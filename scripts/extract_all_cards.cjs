const fs = require('fs');
const html = fs.readFileSync('scripts/page.html', 'utf-8');

const regex = /data-framer-name="Variant 1" href="\.\/destinations\/([a-z0-9\-]+)"[\s\S]*?srcset="([^"\s]+)[\s\S]*?<mark[^>]*>([^<]+)<\/mark>[\s\S]*?<p[^>]*>([^<]+)<\/p>/g;
let m;
const cards = [];
while ((m = regex.exec(html)) !== null) {
  cards.push({
    slug: m[1],
    image: m[2],
    title: m[3],
    location: m[4]
  });
}
console.log('Cards found:', cards.length);
console.log(cards);
