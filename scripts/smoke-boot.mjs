#!/usr/bin/env node
// ══════════════════════════════════════════════════
//  ANSH ASSOCIATES — boot smoke test
//
//  Imports the REAL js/main.js (and everything it pulls in) against a
//  stub DOM and fires DOMContentLoaded, to prove the entry point
//  evaluates and boots without throwing. This is the exact failure mode
//  that took the site down: main.js was a module whose import graph
//  could not resolve, so none of its handlers were ever registered.
//
//  The stub is seeded from the real index.html, so the i18n assertions
//  below run against the page's actual data-i18n nodes.
//
//  Usage: node scripts/smoke-boot.mjs
// ══════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

let failures = 0;
let checks = 0;
const ok = (m) => { checks++; console.log(`  \x1b[32m✓\x1b[0m ${m}`); };
const bad = (m) => { checks++; failures++; console.log(`  \x1b[31m✗\x1b[0m ${m}`); };

// ── Parse the real tags/attributes out of index.html ─────────────
const nodes = [];
for (const m of html.matchAll(/<([a-zA-Z][\w-]*)((?:\s+[^>]*?)?)\/?>/g)) {
  const attrs = {};
  for (const a of m[2].matchAll(/([\w:-]+)(?:="([^"]*)")?/g)) attrs[a[1]] = a[2] ?? '';
  nodes.push({ tag: m[1].toLowerCase(), attrs });
}

const has = (n, attr) => Object.prototype.hasOwnProperty.call(n.attrs, attr);
const classes = (n) => (n.attrs.class || '').split(/\s+/);

// ── Stub element ─────────────────────────────────────────────────
function makeEl(node = { tag: 'div', attrs: {} }) {
  const el = {
    tagName: node.tag.toUpperCase(),
    attributes: { ...node.attrs },
    dataset: {},
    style: {},
    innerHTML: '',
    textContent: '',
    value: '',
    placeholder: node.attrs.placeholder || '',
    alt: node.attrs.alt || '',
    hidden: false,
    options: []
  };
  for (const [k, v] of Object.entries(node.attrs)) {
    if (k.startsWith('data-')) {
      el.dataset[k.slice(5).replace(/-(\w)/g, (_, c) => c.toUpperCase())] = v;
    }
  }
  const set = new Set(classes(node));
  el.classList = {
    add: (...c) => c.forEach((x) => set.add(x)),
    remove: (...c) => c.forEach((x) => set.delete(x)),
    contains: (c) => set.has(c),
    toggle: (c, force) => { const on = force ?? !set.has(c); on ? set.add(c) : set.delete(c); return on; },
    _set: set
  };
  el.setAttribute = (k, v) => { el.attributes[k] = String(v); };
  el.getAttribute = (k) => (Object.prototype.hasOwnProperty.call(el.attributes, k) ? el.attributes[k] : null);
  el.addEventListener = () => {};
  el.removeEventListener = () => {};
  el.focus = () => {};
  el.reset = () => { el._reset = true; };
  el.appendChild = () => {};
  el.remove = () => { el._removed = true; };
  el.closest = () => null;
  el.matches = () => false;
  el.querySelectorAll = () => [];
  el.querySelector = () => null;
  el.getBoundingClientRect = () => ({ top: 0, left: 0, right: 100, bottom: 100, width: 100, height: 100 });
  return el;
}

// Elements carrying data-i18n-options get their real <option> values.
const selectNodes = nodes.filter((n) => n.tag === 'select' && has(n, 'data-i18n-options'));
const optionMap = new Map();
for (const m of html.matchAll(/<select[^>]*data-i18n-options="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)) {
  optionMap.set(m[1], [...m[2].matchAll(/<option value="([^"]*)"/g)].map((o) => o[1]));
}

const byNode = new Map();
const byId = new Map();
const stubFor = (node) => {
  if (!byNode.has(node)) {
    const el = makeEl(node);
    if (node.tag === 'select') {
      el.options = (optionMap.get(node.attrs['data-i18n-options']) || []).map((v) => ({ value: v, textContent: '' }));
      // main.js reaches the options via select.querySelectorAll('option'),
      // so the stub has to answer that rather than returning an empty list.
      el.querySelectorAll = (sel) => (sel === 'option' ? el.options : []);
    }
    byNode.set(node, el);
  }
  return byNode.get(node);
};

// getElementById must return a stable element, or the renderer would write
// into a fresh object every call and nothing would accumulate.
const byIdStub = (id) => {
  if (!byId.has(id)) byId.set(id, makeEl({ tag: 'div', attrs: { id } }));
  return byId.get(id);
};

const filter = (fn) => nodes.filter(fn).map(stubFor);

const SELECTORS = {
  '[data-i18n]': () => filter((n) => has(n, 'data-i18n')),
  '[data-i18n-aria]': () => filter((n) => has(n, 'data-i18n-aria')),
  '[data-i18n-placeholder]': () => filter((n) => has(n, 'data-i18n-placeholder')),
  '[data-i18n-alt]': () => filter((n) => has(n, 'data-i18n-alt')),
  '[data-i18n-text]': () => filter((n) => has(n, 'data-i18n-text')),
  'select[data-i18n-options]': () => filter((n) => n.tag === 'select' && has(n, 'data-i18n-options')),
  '.lang-btn': () => filter((n) => classes(n).includes('lang-btn')),
  '.nav-link': () => filter((n) => classes(n).includes('nav-link')),
  '.wish-count': () => filter((n) => classes(n).includes('wish-count')),
  '.prop-save': () => [],
  '.mm-ig': () => filter((n) => classes(n).includes('mm-ig'))
};

const generic = () => [makeEl(), makeEl(), makeEl()];

const listeners = {};
globalThis.document = {
  documentElement: makeEl({ tag: 'html', attrs: {} }),
  body: makeEl({ tag: 'body', attrs: {} }),
  _listeners: listeners,
  getElementById: (id) => byIdStub(id),
  querySelector: (sel) => (SELECTORS[sel] ? SELECTORS[sel]()[0] ?? makeEl() : makeEl()),
  querySelectorAll: (sel) => (SELECTORS[sel] ? SELECTORS[sel]() : generic()),
  createElement: (tag) => makeEl({ tag, attrs: {} }),
  addEventListener: (type, fn) => { (listeners[type] ??= []).push(fn); },
  removeEventListener: () => {},
  dispatchEvent: () => true
};

const mq = { matches: false, addEventListener: () => {} };
globalThis.window = {
  matchMedia: () => mq,
  scrollY: 0,
  innerHeight: 900,
  innerWidth: 1440,
  scrollTo: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  location: { hash: '' },
  localStorage: globalThis.localStorage
};
globalThis.localStorage = {
  _d: new Map(),
  getItem(k) { return this._d.has(k) ? this._d.get(k) : null; },
  setItem(k, v) { this._d.set(k, String(v)); },
  removeItem(k) { this._d.delete(k); }
};
window.localStorage = globalThis.localStorage;
globalThis.performance = { now: () => Date.now() };
globalThis.requestAnimationFrame = (fn) => { fn(performance.now()); return 1; };
globalThis.cancelAnimationFrame = () => {};
globalThis.history = { replaceState: () => {}, pushState: () => {} };
globalThis.fetch = async () => ({ ok: true });

// ── Boot ─────────────────────────────────────────────────────────
console.log('\n\x1b[1m6. js/main.js boot (real modules, stubbed DOM)\x1b[0m');

try {
  await import(path.join(ROOT, 'js/main.js'));
  ok('js/main.js and its whole import graph evaluated without throwing');
} catch (err) {
  bad(`js/main.js failed to evaluate: ${err.message}`);
  console.log(err.stack);
  process.exit(1);
}

const domReady = (listeners.DOMContentLoaded || []).length;
domReady === 1 ? ok(`DOMContentLoaded handler registered (${domReady})`) : bad(`expected 1 DOMContentLoaded handler, got ${domReady}`);

try {
  for (const fn of listeners.DOMContentLoaded || []) fn();
  ok('DOMContentLoaded handler ran the full boot without throwing');
} catch (err) {
  bad(`boot threw: ${err.message}`);
  console.log(err.stack);
}

// The intro dismissal is on a 400ms failsafe timer — let it fire.
await new Promise((r) => setTimeout(r, 700));

// The intro must have been marked finished, or the page stays covered.
const introDone = document.documentElement.classList.contains('intro-done');
introDone ? ok('intro overlay was dismissed (.intro-done on <html>)') : bad('intro overlay never dismissed — page would stay blank');

// Grids must be populated by the boot.
const grid = document.getElementById('propGrid');
const wall = document.getElementById('serviceWall');
const test = document.getElementById('testWall');
/property-card/.test(grid.innerHTML) ? ok(`#propGrid populated (${(grid.innerHTML.match(/property-card/g) || []).length} cards)`) : bad('#propGrid still empty after boot');
/serv-card/.test(wall.innerHTML) ? ok(`#serviceWall populated (${(wall.innerHTML.match(/serv-card/g) || []).length} cards)`) : bad('#serviceWall still empty after boot');
/test-block/.test(test.innerHTML) ? ok(`#testWall populated (${(test.innerHTML.match(/test-block/g) || []).length} blocks)`) : bad('#testWall still empty after boot');

// Translations must have been applied to the real markup's nodes.
const i18nNodes = SELECTORS['[data-i18n]']();
const translated = i18nNodes.filter((n) => n.innerHTML && n.innerHTML !== n.textContent).length;
translated > 0 ? ok(`${translated}/${i18nNodes.length} data-i18n nodes received translated markup`) : bad('no data-i18n node was translated');

const navHome = i18nNodes.find((n) => n.dataset.i18n === 'nav.home');
navHome && navHome.innerHTML === 'Home' ? ok('nav.home rendered as "Home"') : bad(`nav.home rendered as "${navHome?.innerHTML}"`);

const ariaNodes = SELECTORS['[data-i18n-aria]']();
const withLabel = ariaNodes.filter((n) => n.getAttribute('aria-label'));
withLabel.length === ariaNodes.length && ariaNodes.length > 0
  ? ok(`${withLabel.length} aria-labels applied`) : bad(`${withLabel.length}/${ariaNodes.length} aria-labels applied`);

const phNodes = SELECTORS['[data-i18n-placeholder]']();
phNodes.every((n) => n.placeholder) && phNodes.length > 0
  ? ok(`${phNodes.length} placeholders applied`) : bad(`${phNodes.filter((n) => n.placeholder).length}/${phNodes.length} placeholders applied`);

const selects = SELECTORS['select[data-i18n-options]']();
const allOpts = selects.flatMap((s) => s.options);
const optsTranslated = selects.length === 2 && allOpts.length > 0 && allOpts.every((o) => o.textContent);
optsTranslated
  ? ok(`${selects.length} selects, ${allOpts.length} options all translated`)
  : bad(`select options not translated (${allOpts.filter((o) => o.textContent).length}/${allOpts.length})`);

// The empty-value option must pick up the "Select …" label, not "ct.opt.placeholder".
const placeholderOpt = selects[0]?.options[0];
placeholderOpt && placeholderOpt.textContent === 'Select Property Type'
  ? ok('placeholder option resolved via data-i18n-options-empty')
  : bad(`placeholder option rendered as "${placeholderOpt?.textContent}"`);

// Language switch must actually change the output.
const { translate } = await import(path.join(ROOT, 'js/i18n.js'));
const before = document.getElementById('serviceWall').innerHTML;
const hiBtn = SELECTORS['.lang-btn']().find((b) => b.dataset.lang === 'hi');
if (hiBtn) {
  // Re-run the switch the way the click handler does.
  const { renderAll } = await import(path.join(ROOT, 'js/render.js'));
  renderAll((k) => translate(k, 'hi'), '');
  const after = document.getElementById('serviceWall').innerHTML;
  before !== after ? ok('switching to हिन्दी re-renders the services wall with different copy')
                   : bad('Hindi switch produced identical output — translation not wired');
} else bad('no हिन्दी button found in the markup');

console.log(`\n\x1b[1m${checks - failures}/${checks} checks passed\x1b[0m`);
if (failures) { console.log(`\x1b[31m${failures} FAILING\x1b[0m`); process.exit(1); }
console.log('\x1b[32mBoot smoke test passed.\x1b[0m');
