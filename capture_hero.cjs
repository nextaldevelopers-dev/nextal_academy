const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const sizes = [
  { w: 1920, h: 1080, name: 'hero_1920x1080' },
  { w: 1680, h: 1050, name: 'hero_1680x1050' },
  { w: 1536, h: 864, name: 'hero_1536x864' },
  { w: 1440, h: 900, name: 'hero_1440x900' },
  { w: 1366, h: 768, name: 'hero_1366x768' },
  { w: 1280, h: 720, name: 'hero_1280x720' },
  { w: 1024, h: 768, name: 'hero_1024x768' },
  { w: 768, h: 1024, name: 'hero_768x1024' },
  { w: 375, h: 812, name: 'hero_375x812' }
];

(async () => {
  const outDir = 'C:/Users/mohamed imran/.gemini/antigravity-ide/brain/47c762e6-a71a-49ae-9631-f8e49f36ae74';
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Disable animations for stable screenshot
  await page.evaluateOnNewDocument(() => {
    const style = document.createElement('style');
    style.textContent = '*, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; animation-delay: 0s !important; }';
    document.head.appendChild(style);
  });

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000)); // wait for 3d

  for (const s of sizes) {
    await page.setViewport({ width: s.w, height: s.h });
    await new Promise(r => setTimeout(r, 1000)); // wait for resize
    const p = path.join(outDir, s.name + '.png');
    await page.screenshot({ path: p, clip: { x: 0, y: 0, width: s.w, height: s.h } });
    console.log("Saved: " + p);
  }

  await browser.close();
})();
