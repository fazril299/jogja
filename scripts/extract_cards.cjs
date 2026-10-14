const fs = require('fs');
const html = fs.readFileSync('scripts/page.html', 'utf-8');

const regex = /<a[^>]+href="\.\/destinations\/([a-z0-9\-]+)"[^>]*>([\s\S]*?)<\/a>/g;
let m;
while ((m = regex.exec(html)) !== null) {
  const slug = m[1];
  const inner = m[2];
  const imgMatch = inner.match(/srcset="([^",\s]+)/);
  const titleMatch = inner.match(/<h[0-9][^>]*>([^<]+)<\/h[0-9]>/) || inner.match(/<p[^>]*class="[^"]*framer-text[^"]*"[^>]*>([^<]+)<\/p>/);
  const allTexts = [...inner.matchAll(/<p[^>]*class="[^"]*framer-text[^"]*"[^>]*>([^<]+)<\/p>/g)].map(x => x[1]);
  if (imgMatch && allTexts.length > 0) {
    console.log(slug, ':', allTexts.join(' | '), ':', imgMatch[1]);
  }
}
