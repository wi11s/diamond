const { v2: cloudinary } = require('cloudinary');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function fetchFliers() {
  const collected = [];
  for (const sub of ['FLIERS', 'FLYERS']) {
    try {
      const result = await cloudinary.search
        .expression(`folder:"DJ/${sub}"`)
        .sort_by('created_at', 'desc')
        .max_results(60)
        .execute();
      for (const r of (result?.resources || [])) {
        collected.push(cloudinary.url(r.public_id, {
          quality: 'auto', fetch_format: 'auto', width: 400, height: 400, crop: 'fill', gravity: 'center',
        }));
      }
    } catch {}
  }
  return collected;
}

async function main() {
  const { default: puppeteer } = await import('puppeteer');
  console.log('Fetching flier URLs...');
  const urls = await fetchFliers();
  if (!urls.length) { console.error('No fliers found'); process.exit(1); }
  console.log(`Got ${urls.length} fliers`);

  const COLS = 8;
  const CELL = 240;
  const total = COLS * Math.ceil(96 / COLS);
  const pool = Array.from({ length: total }, (_, i) => urls[i % urls.length]);
  const WIDTH = COLS * CELL;
  const HEIGHT = Math.ceil(total / COLS) * CELL;

  const cells = pool.map(src =>
    `<div style="width:${CELL}px;height:${CELL}px;overflow:hidden;flex-shrink:0">
       <img src="${src}" style="width:100%;height:100%;object-fit:cover;display:block"/>
     </div>`
  ).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#111}
.grid{display:flex;flex-wrap:wrap;width:${WIDTH}px}</style></head>
<body><div class="grid">${cells}</div></body></html>`;

  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

  const outPath = path.resolve(__dirname, '../public/dates-bg.jpg');
  await page.screenshot({ path: outPath, type: 'jpeg', quality: 90, fullPage: true });
  await browser.close();

  console.log(`Saved → public/dates-bg.jpg`);
}

main().catch(e => { console.error(e); process.exit(1); });
