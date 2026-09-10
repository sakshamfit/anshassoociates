#!/usr/bin/env node
// ══════════════════════════════════════════════════
//  ANSH ASSOCIATES — Build verification
//
//  Re-runnable check over the things that were actually broken:
//    1. every asset the page references exists on disk
//    2. the ES module graph reachable from js/main.js resolves,
//       and uses no bare specifiers (there is no bundler here)
//    3. every data-i18n key in the markup resolves in BOTH locales
//    4. the real js/render.js produces populated grids, and every
//       key it asks for resolves in both locales
//    5. every URL the page requests returns 200 over HTTP
//
//  Usage: node scripts/verify.mjs
// ══════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (p) => path.relative(ROOT, p) || '.';

let failures = 0;
let checks = 0;
const ok = (msg) => { checks++; console.log(`  \x1b[32m✓\x1b[0m ${msg}`); };
const bad = (msg) => { checks++; failures++; console.log(`  \x1b[31m✗\x1b[0m ${msg}`); };
const head = (t) => console.log(`\n\x1b[1m${t}\x1b[0m`);

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const jsFiles = fs.readdirSync(path.join(ROOT, 'js'), { withFileTypes: true });

// ── 1. Referenced assets exist ───────────────────────────────────
head('1. Asset references');
const assetRefs = new Set();
for (const m of html.matchAll(/(?:src|href)="((?:assets|css|js)\/[^"]+)"/g)) assetRefs.add(m[1]);
// Assets named from the data module (property images) as well.
const dataSrc = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
for (const m of dataSrc.matchAll(/image:\s*'([^']+)'/g)) assetRefs.add(m[1]);

for (const ref of [...assetRefs].sort()) {
  fs.existsSync(path.join(ROOT, ref)) ? ok(ref) : bad(`MISSING ${ref}`);
}

// ── 2. Module graph resolves ─────────────────────────────────────
head('2. ES module graph from js/main.js');
const graph = new Set();
const walk = (file) => {
  if (graph.has(file)) return;
  graph.add(file);
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/(?:^|\n)\s*import\s[^'"]*['"]([^'"]+)['"]/g)) {
    const spec = m[1];
    if (!spec.startsWith('.')) { bad(`${rel(file)} imports bare specifier "${spec}" (no bundler/importmap present)`); continue; }
    const target = path.resolve(path.dirname(file), spec);
    if (!fs.existsSync(target)) bad(`${rel(file)} → ${spec} does not exist`);
    else walk(target);
  }
};
walk(path.join(ROOT, 'js/main.js'));
ok(`${graph.size} modules reachable, all resolved: ${[...graph].map(rel).join(', ')}`);

const mainSrc = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
// Match a real import statement, not prose: main.js legitimately *mentions*
// knowledge-visualization.js in the header comment explaining why it is gone.
if (/^\s*import[\s\S]*?knowledge-visualization/m.test(mainSrc)) bad('main.js still imports the three.js knowledge graph');
else ok('main.js no longer imports the unresolvable three.js module');

if (html.includes('lenis')) bad('index.html still references the absent lenis vendor file');
else ok('no reference to the absent js/vendor/lenis.min.js');

for (const m of html.matchAll(/<script[^>]*src="([^"]+)"/g)) {
  fs.existsSync(path.join(ROOT, m[1])) ? ok(`script tag ${m[1]}`) : bad(`script tag ${m[1]} does not exist`);
}

// ── 3. i18n coverage ─────────────────────────────────────────────
head('3. i18n keys in markup');
const { DICTIONARIES, missingKeys } = await import(path.join(ROOT, 'js/i18n.js'));

const markupKeys = new Set();
for (const m of html.matchAll(/data-i18n(?:-aria|-placeholder|-alt|-text)?="([^"]+)"/g)) markupKeys.add(m[1]);
for (const m of html.matchAll(/data-i18n-options="([^"]+)"[^>]*data-i18n-options-empty="([^"]+)"/g)) {
  markupKeys.add(`${m[1]}.${m[2]}`);
}
// Option values translate via `${prefix}.${value}`.
for (const m of html.matchAll(/<select[^>]*data-i18n-options="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)) {
  for (const o of m[2].matchAll(/<option value="([^"]*)"/g)) {
    if (o[1]) markupKeys.add(`${m[1]}.${o[1]}`);
  }
}

let unresolved = 0;
for (const key of [...markupKeys].sort()) {
  for (const lang of Object.keys(DICTIONARIES)) {
    if (!Object.prototype.hasOwnProperty.call(DICTIONARIES[lang], key)) { bad(`"${key}" missing in ${lang}`); unresolved++; }
  }
}
if (!unresolved) ok(`${markupKeys.size} markup keys resolve in ${Object.keys(DICTIONARIES).join('/')}`);

for (const lang of Object.keys(DICTIONARIES)) {
  const miss = missingKeys(lang);
  miss.length ? bad(`${miss.length} keys present in en but missing in ${lang}: ${miss.join(', ')}`)
              : ok(`${lang} dictionary is complete`);
}

// ── 4. Execute the real renderer ─────────────────────────────────
head('4. js/render.js output (real code, stubbed DOM)');
const sinks = {};
globalThis.document = {
  getElementById: (id) => (sinks[id] ??= { id, innerHTML: '' }),
  dispatchEvent: () => true
};

const { renderAll } = await import(path.join(ROOT, 'js/render.js'));
const { translate } = await import(path.join(ROOT, 'js/i18n.js'));

for (const lang of Object.keys(DICTIONARIES)) {
  const asked = new Set();
  const t = (key) => { asked.add(key); return translate(key, lang); };
  for (const k of Object.keys(sinks)) sinks[k].innerHTML = '';

  const count = renderAll(t, '');

  const propHtml = sinks.propGrid.innerHTML;
  const servHtml = sinks.serviceWall.innerHTML;
  const testHtml = sinks.testWall.innerHTML;

  const n = (s, re) => (s.match(re) || []).length;
  count === 4 ? ok(`${lang}: rendered ${count} property cards`) : bad(`${lang}: expected 4 property cards, got ${count}`);
  n(propHtml, /class="property-card"/g) === 4 ? ok(`${lang}: 4 .property-card nodes in #propGrid`) : bad(`${lang}: #propGrid card count wrong`);
  n(servHtml, /class="serv-card"/g) === 6 ? ok(`${lang}: 6 .serv-card nodes in #serviceWall`) : bad(`${lang}: #serviceWall card count wrong`);
  n(testHtml, /class="test-block"/g) === 3 ? ok(`${lang}: 3 .test-block nodes in #testWall`) : bad(`${lang}: #testWall block count wrong`);
  n(propHtml, /class="prop-save"/g) === 4 ? ok(`${lang}: 4 wishlist controls rendered`) : bad(`${lang}: wishlist controls missing`);

  const unresolvedKeys = [...asked].filter((k) => translate(k, lang) === k && !DICTIONARIES[lang][k]);
  unresolvedKeys.length ? bad(`${lang}: renderer asked for unresolved keys: ${unresolvedKeys.join(', ')}`)
                        : ok(`${lang}: all ${asked.size} keys requested by the renderer resolve`);

  if (lang === 'en') {
    if (!/Prestige Heights/.test(propHtml)) bad('en: expected property title missing from output');
    else ok('en: property titles present');
    if (!/Investment Advisory/.test(servHtml)) bad('en: expected service title missing from output');
    else ok('en: service titles present');
    if (!/Rajesh Kumar/.test(testHtml)) bad('en: expected testimonial missing from output');
    else ok('en: testimonial names present');
    if (/undefined|\[object Object\]/.test(propHtml + servHtml + testHtml)) bad('en: output contains undefined/[object Object]');
    else ok('en: no undefined leakage in rendered output');
  }
  if (lang === 'hi') {
    if (!/प्रेस्टीज हाइट्स/.test(propHtml)) bad('hi: Hindi property title missing — translation not applied');
    else ok('hi: Hindi property titles applied');
    if (!/राजेश कुमार/.test(testHtml)) bad('hi: Hindi testimonial missing — translation not applied');
    else ok('hi: Hindi testimonial names applied');
    if (/Prestige Heights|Rajesh Kumar/.test(propHtml + testHtml)) bad('hi: English leaked into Hindi render');
    else ok('hi: no English leakage in Hindi render');
  }

  // Search filter must actually filter — in both directions.
  const filtered = renderAll((k) => translate(k, lang), 'jaipur');
  filtered === 1 ? ok(`${lang}: search "jaipur" narrows to 1 listing`) : bad(`${lang}: search returned ${filtered}, expected 1`);
  const none = renderAll((k) => translate(k, lang), 'zzzz');
  none === 0 ? ok(`${lang}: search with no match returns 0`) : bad(`${lang}: expected 0 results, got ${none}`);
  if (lang === 'hi') {
    const hiFiltered = renderAll((k) => translate(k, 'hi'), 'जयपुर');
    hiFiltered === 1 ? ok('hi: Hindi-language search term matches') : bad(`hi: Hindi search returned ${hiFiltered}, expected 1`);
  }
  if (lang === 'en') {
    const hiInEn = renderAll((k) => translate(k, 'en'), 'मुंबई');
    hiInEn === 1 ? ok('en: Hindi search term matches while browsing in English') : bad(`en: Hindi search returned ${hiInEn}, expected 1`);
  }
}

// ── 5. HTTP smoke test ───────────────────────────────────────────
head('5. HTTP responses');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end('not found'); return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const urls = ['/', ...[...assetRefs]].map((u) => (u === '/' ? u : `/${u}`));
let httpFails = 0;
for (const u of urls) {
  const res = await fetch(base + u);
  if (res.status !== 200) { bad(`${res.status} ${u}`); httpFails++; }
  await res.arrayBuffer();
}
if (!httpFails) ok(`${urls.length} URLs all returned 200`);

// Dead internal links: the old markup pointed at four pages that never existed.
const servedHtml = await (await fetch(base + '/')).text();
const internalLinks = [...new Set([...servedHtml.matchAll(/href="([^"#][^"]*\.html)"/g)].map((m) => m[1]))];
for (const link of internalLinks) {
  const res = await fetch(base + '/' + link);
  res.status === 200 ? ok(`internal link ${link}`) : bad(`internal link ${link} → ${res.status}`);
}
if (!internalLinks.length) ok('no dead .html links remain in the markup');

server.close();

console.log(`\n\x1b[1m${checks - failures}/${checks} checks passed\x1b[0m`);
if (failures) { console.log(`\x1b[31m${failures} FAILING\x1b[0m`); process.exit(1); }
console.log('\x1b[32mAll checks passed.\x1b[0m');
