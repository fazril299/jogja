const fs = require('fs');
const html = fs.readFileSync('scripts/page.html', 'utf-8');

// Match <img ... alt="... destination image" ... src="..." ... <mark ...>City</mark> ... <mark ...>Country</mark>
const regex = /<img[^>]+src="([^"]+)"[^>]+alt="([^"]+) destination image"[\s\S]*?<div class="framer-k3z6t3"[\s\S]*?<mark[^>]*>([^<]+)<\/mark>[\s\S]*?<div class="framer-1kkl39w"[\s\S]*?<mark[^>]*>([^<]+)<\/mark>/g;

let m;
const list = [];
const seen = new Set();
while ((m = regex.exec(html)) !== null) {
  const city = m[3].trim();
  const country = m[4].trim();
  const image = m[1];
  const key = `${city}-${country}`;
  if (!seen.has(key)) {
    seen.add(key);
    list.push({ city, country, image });
  }
}

console.log('Found destinations:', list.length);
console.log(JSON.stringify(list, null, 2));
fs.writeFileSync('scripts/destinations.json', JSON.stringify(list, null, 2), 'utf-8');
