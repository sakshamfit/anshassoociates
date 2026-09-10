// ══════════════════════════════════════════════════
//  ANSH ASSOCIATES — Runtime Rendering
//
//  The Properties section shipped an empty <ul id="propGrid"> and the
//  Services section an empty <ul id="serviceWall">. The only file that
//  knew how to fill them, js/property-data.js, was never referenced by
//  a <script> tag — so both grids rendered as blank gaps. Nothing at
//  all populated the services wall.
//
//  This module fills all three dynamic grids. It takes the translation
//  function as an argument, so a language switch is a simple re-render
//  rather than a pile of per-node patching.
// ══════════════════════════════════════════════════

import { PROPERTIES, SERVICES, TESTIMONIALS } from './data.js';
import { DICTIONARIES } from './i18n.js';

const esc = (value) => String(value).replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Search is deliberately locale-independent: a visitor browsing in हिन्दी
// should still find a listing when they type "jaipur", and vice versa.
// So the haystack indexes every locale's copy, not just the active one.
function searchIndex(property) {
  const parts = [property.id, property.price, ...property.features];
  for (const dict of Object.values(DICTIONARIES)) {
    for (const suffix of ['title', 'location', 'desc']) {
      const value = dict[`${property.key}.${suffix}`];
      if (value) parts.push(value);
    }
  }
  return parts.join(' ').toLowerCase();
}

const PIN_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const HOME_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const STAR_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.6l2.7 5.5 6 .9-4.35 4.24 1.03 6-5.38-2.83L6.62 19.24l1.03-6L3.3 9l6-.9L12 2.6Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>';

function propertyCard(property, t) {
  const title = t(`${property.key}.title`);
  const features = property.features
    .map((f) => `<span class="property-feature">${esc(f)}</span>`)
    .join('');

  return `
    <li class="property-card" data-reveal data-property-id="${property.id}">
      <div class="property-image">
        <img src="${property.image}" alt="${esc(title)} — ${esc(t(`${property.key}.location`))}"
             width="${property.width}" height="${property.height}" loading="lazy" decoding="async">
        <button class="prop-save" type="button" data-save="${property.id}" aria-pressed="false"
                aria-label="${esc(t('prop.save'))} ${esc(title)}">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 20s-7-4.6-9-9c-1.2-2.8.4-6 3.4-6.4C8.4 4.3 10.6 5 12 7c1.4-2 3.6-2.7 5.6-2.4 3 .4 4.6 3.6 3.4 6.4-2 4.4-9 9-9 9Z"
                  stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="property-overlay">
          <div class="property-overlay-content">
            <span class="property-overlay-icon">${HOME_ICON}</span>
            <span class="property-overlay-text">${esc(t('prop.view'))}</span>
          </div>
        </div>
      </div>
      <div class="property-content">
        <h3 class="property-title">${esc(title)}</h3>
        <p class="property-location">${PIN_ICON}<span>${esc(t(`${property.key}.location`))}</span></p>
        <p class="property-price">${esc(property.price)}</p>
        <div class="property-features">${features}</div>
        <p class="property-description">${esc(t(`${property.key}.desc`))}</p>
      </div>
    </li>`;
}

function serviceCard(service, t) {
  return `
    <li class="serv-card" data-reveal>
      <span class="serv-icon" aria-hidden="true">${service.icon}</span>
      <h3 class="serv-title">${esc(t(`${service.key}.title`))}</h3>
      <p class="serv-text">${t(`${service.key}.text`)}</p>
    </li>`;
}

function testimonialBlock(entry, t, index) {
  const stars = '★'.repeat(entry.rating) + '☆'.repeat(5 - entry.rating);
  return `
    <article class="test-block" data-reveal style="--stagger:${index}">
      <span class="test-icon" aria-hidden="true">${STAR_ICON}</span>
      <div>
        <h3 class="test-title">${esc(t(`${entry.key}.name`))}</h3>
        <p class="test-rating">
          <span aria-hidden="true">${stars}</span>
          <span>${esc(t('tst.rating').replace('{n}', entry.rating))}</span>
        </p>
        <p class="test-text">${t(`${entry.key}.text`)}</p>
        <p class="test-meta">${esc(entry.meta)}</p>
      </div>
    </article>`;
}

export function renderProperties(t, filter = '') {
  const grid = document.getElementById('propGrid');
  if (!grid) return 0;

  const needle = filter.trim().toLowerCase();
  const matches = PROPERTIES.filter((p) => !needle || searchIndex(p).includes(needle));

  grid.innerHTML = matches.map((p) => propertyCard(p, t)).join('');

  const empty = document.getElementById('propEmpty');
  if (empty) empty.hidden = matches.length > 0;

  const counter = document.getElementById('propCount');
  if (counter) counter.textContent = String(matches.length).padStart(2, '0');

  return matches.length;
}

export function renderServices(t) {
  const wall = document.getElementById('serviceWall');
  if (!wall) return;
  wall.innerHTML = SERVICES.map((s) => serviceCard(s, t)).join('');
}

export function renderTestimonials(t) {
  const wall = document.getElementById('testWall');
  if (!wall) return;
  wall.innerHTML = TESTIMONIALS.map((entry, i) => testimonialBlock(entry, t, i)).join('');
}

// Re-rendered nodes are brand-new DOM, so the reveal observer and the
// GSAP hover bindings need to re-attach. This event is the signal.
function announceRendered() {
  document.dispatchEvent(new CustomEvent('ansh:rendered'));
}

export function renderAll(t, filter = '') {
  const count = renderProperties(t, filter);
  renderServices(t);
  renderTestimonials(t);
  announceRendered();
  return count;
}
