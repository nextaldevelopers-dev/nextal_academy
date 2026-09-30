const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'home', url: 'https://nextalacademy.com/' },
  { name: 'blogs', url: 'https://nextalacademy.com/blogs' },
  { name: 'blog-ai-agents', url: 'https://nextalacademy.com/blogs/how-ai-agents-are-automating-digital-marketing-tasks' },
  { name: 'course-video-editing', url: 'https://nextalacademy.com/course/video-editing' },
  { name: 'placement', url: 'https://nextalacademy.com/placement' }
];

const runs = 3;
const outDir = './lh-live';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function runLighthouse(url, name, mode, runIdx) {
  const outputPath = path.join(outDir, `${name}-${mode}-${runIdx}`);
  let cmd = `npx lighthouse@latest "${url}" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="${outputPath}.json" --chrome-flags="--headless=new --no-sandbox" --quiet`;
  if (mode === 'desktop') {
    cmd += ` --preset=desktop`;
  }
  console.log(`Running: ${name} ${mode} run ${runIdx}...`);
  try {
    execSync(cmd, { stdio: 'ignore' });
  } catch (e) {
    console.error(`Failed run: ${name} ${mode} run ${runIdx}`);
  }
  return `${outputPath}.json`;
}

function getMedian(arr) {
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

const results = [];
const allFailures = {}; // auditId -> { title, score, pages: [], details: [] }
const lcpElements = {}; // page_mode -> element

for (const page of pages) {
  for (const mode of ['mobile', 'desktop']) {
    const scores = { perf: [], a11y: [], bp: [], seo: [], lcpMs: [], cls: [], tbtMs: [], siMs: [] };
    let lastJson = null;

    for (let r = 1; r <= runs; r++) {
      const jsonFile = runLighthouse(page.url, page.name, mode, r);
      if (fs.existsSync(jsonFile)) {
        try {
          const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
          lastJson = data;
          scores.perf.push(data.categories.performance?.score || 0);
          scores.a11y.push(data.categories.accessibility?.score || 0);
          scores.bp.push(data.categories['best-practices']?.score || 0);
          scores.seo.push(data.categories.seo?.score || 0);
          scores.lcpMs.push(data.audits['largest-contentful-paint']?.numericValue || 0);
          scores.cls.push(data.audits['cumulative-layout-shift']?.numericValue || 0);
          scores.tbtMs.push(data.audits['total-blocking-time']?.numericValue || 0);
          scores.siMs.push(data.audits['speed-index']?.numericValue || 0);
        } catch (e) {
          console.error("Error reading " + jsonFile);
        }
      }
    }

    if (scores.perf.length > 0) {
      const resultObj = {
        page: page.name, mode,
        perf: getMedian(scores.perf),
        a11y: getMedian(scores.a11y),
        bp: getMedian(scores.bp),
        seo: getMedian(scores.seo),
        lcp: (getMedian(scores.lcpMs) / 1000).toFixed(1) + 's',
        cls: getMedian(scores.cls).toFixed(3),
        tbt: getMedian(scores.tbtMs).toFixed(0) + 'ms',
        si: (getMedian(scores.siMs) / 1000).toFixed(1) + 's'
      };
      results.push(resultObj);

      if (lastJson) {
        // Find LCP element
        const lcpDetails = lastJson.audits['largest-contentful-paint-element']?.details?.items || [];
        lcpElements[`${page.name}-${mode}`] = lcpDetails.length > 0 ? lcpDetails[0].node?.snippet : 'Unknown';

        // Check failing audits < 0.9
        const audits = lastJson.audits || {};
        for (const [id, audit] of Object.entries(audits)) {
          if (audit.score !== null && audit.score < 0.9 && audit.score !== 1) {
            // Ignore notApplicable / informative
            if (audit.scoreDisplayMode === 'informative' || audit.scoreDisplayMode === 'notApplicable' || audit.scoreDisplayMode === 'manual') continue;
            
            if (!allFailures[id]) {
              allFailures[id] = { title: audit.title, score: audit.score, pages: new Set(), details: [] };
            }
            allFailures[id].pages.add(`${page.name} (${mode})`);
            
            // Extract top 3 elements
            if (audit.details && audit.details.items) {
               const items = audit.details.items.slice(0,3);
               for(const item of items) {
                  let info = item.url || (item.node && item.node.snippet) || item.label || JSON.stringify(item);
                  if (info) allFailures[id].details.push(info);
               }
            }
          }
        }
      }
    }
  }
}

// Generate Report Markdown
let md = `# Nextal Academy Live Lighthouse Audit\n\n`;

md += `## Score Table (Median of 3 runs)\n`;
md += `| Page | Mode | Perf | A11y | Best Practices | SEO | LCP | CLS | TBT | Speed Index |\n`;
md += `|---|---|---|---|---|---|---|---|---|---|\n`;
for (const r of results) {
  md += `| ${r.page} | ${r.mode} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ${r.lcp} | ${r.cls} | ${r.tbt} | ${r.si} |\n`;
}

md += `\n## Failing Audits (< 0.9)\n`;
for (const id in allFailures) {
  const f = allFailures[id];
  md += `### ${f.title} (Score: ${f.score.toFixed(2)})\n`;
  md += `- **Pages failing:** ${Array.from(f.pages).join(', ')}\n`;
  if (f.details.length > 0) {
    const uniqueDetails = [...new Set(f.details)].slice(0, 3);
    md += `- **Top elements/URLs:**\n`;
    for (const d of uniqueDetails) {
       // clean up long strings
       md += `  - \`${String(d).substring(0, 150)}\`\n`;
    }
  }
  md += `\n`;
}

md += `\n## Largest Contentful Paint Elements\n`;
for (const [key, element] of Object.entries(lcpElements)) {
  md += `- **${key}:** \`${element.substring(0, 150)}\`\n`;
}

fs.writeFileSync(path.join(outDir, 'report.md'), md);
console.log('Audit completed and report.md generated.');
