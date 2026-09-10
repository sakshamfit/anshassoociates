// ══════════════════════════════════════════════════
//  ANSH ASSOCIATES — Entry Point
//
//  Previously this file was a type="module" script whose import graph
//  could not resolve (scroll-animations.js imported './vendor/gsap.min.js'
//  from the wrong directory, and knowledge-visualization.js imported the
//  bare specifier 'three', which is neither vendored nor mapped). The
//  module never evaluated, so none of the handlers below were ever
//  registered. It also called `new Lenis(...)` against a vendor file
//  that does not exist in the repository.
//
//  Both problems are resolved: GSAP is consumed from the global scope
//  (it is already loaded by a classic <script> tag), the unused
//  three.js knowledge graph is no longer imported, and smooth scrolling
//  is provided by js/smooth-scroll.js.
// ══════════════════════════════════════════════════

import { createSmoothScroll } from './smooth-scroll.js';
import { initGSAPAnimations } from './animations/scroll-animations.js';
import { renderAll, renderProperties } from './render.js';
import { translate, storedLanguage, persistLanguage, DEFAULT_LANG, LANGUAGES } from './i18n.js';
import { SITE, PROPERTY_TYPES, BUDGETS } from './data.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const WISHLIST_KEY = 'ansh:wishlist';

const state = {
  lang: DEFAULT_LANG,
  wishlist: new Set(),
  search: ''
};

const t = (key) => translate(key, state.lang);

// ── Toast ────────────────────────────────────────────
let toastTimer;
function toast(message) {
  let el = $('#toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 4200);
}

// ── Wishlist ─────────────────────────────────────────
function loadWishlist() {
  try {
    const raw = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    state.wishlist = new Set(Array.isArray(raw) ? raw : []);
  } catch { state.wishlist = new Set(); }
}

function saveWishlist() {
  try { localStorage.setItem(WISHLIST_KEY, JSON.stringify([...state.wishlist])); } catch { /* ignore */ }
}

function syncWishlistUI() {
  $$('.wish-count').forEach((el) => {
    el.textContent = String(state.wishlist.size);
    el.classList.toggle('is-populated', state.wishlist.size > 0);
  });
  $$('.prop-save').forEach((btn) => {
    const id = btn.dataset.save;
    const saved = state.wishlist.has(id);
    btn.classList.toggle('is-saved', saved);
    btn.setAttribute('aria-pressed', String(saved));
  });
}

function toggleWishlist(id) {
  if (state.wishlist.has(id)) state.wishlist.delete(id);
  else state.wishlist.add(id);
  saveWishlist();
  syncWishlistUI();
}

// ── Language ─────────────────────────────────────────
function applyStaticTranslations() {
  $$('[data-i18n]').forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
  $$('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  $$('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  $$('[data-i18n-alt]').forEach((el) => { el.alt = t(el.dataset.i18nAlt); });
  $$('[data-i18n-text]').forEach((el) => { el.textContent = t(el.dataset.i18nText); });
  $$('select[data-i18n-options]').forEach((select) => {
    const prefix = select.dataset.i18nOptions;
    $$('option', select).forEach((opt) => {
      const suffix = opt.value || select.dataset.i18nOptionsEmpty || 'placeholder';
      opt.textContent = t(`${prefix}.${suffix}`);
    });
  });
  document.documentElement.lang = state.lang;
  $$('.lang-btn').forEach((btn) => {
    const active = btn.dataset.lang === state.lang;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

function setLanguage(lang, { announce = false } = {}) {
  if (!LANGUAGES.includes(lang) || lang === state.lang) return;
  state.lang = lang;
  persistLanguage(lang);
  applyStaticTranslations();
  renderAll(t, state.search);
  syncWishlistUI();
  // Translated copy changes element heights — let ScrollTrigger re-measure.
  if (window.ScrollTrigger) requestAnimationFrame(() => window.ScrollTrigger.refresh());
  if (announce) toast(t('toast.lang'));
}

// ── Intro overlay ────────────────────────────────────
// `#intro` is a fixed, opaque, z-index:999 panel. Nothing ever hid it,
// so the page rendered as a blank cream rectangle. It is now dismissed
// deterministically, with a failsafe that cannot be outrun.
function dismissIntro() {
  document.documentElement.classList.add('intro-done');
  const intro = $('#intro');
  if (intro) intro.addEventListener('transitionend', () => intro.remove(), { once: true });
  setTimeout(() => intro && intro.remove(), 1600);
}

function runIntro() {
  const logo = $('#logo');
  if (logo) logo.classList.add('is-shown');
  // Fail-safe: never let the overlay trap the page, whatever the animation does.
  setTimeout(dismissIntro, window.gsap ? 2400 : 400);
}

// ── Header scroll state ──────────────────────────────
function initHeaderState() {
  const onScroll = () => {
    document.body.classList.toggle('past-hero', window.scrollY > window.innerHeight * 0.6);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── Nav active-link tracking ─────────────────────────
function initNavTracking() {
  const links = $$('.nav-link');
  const sections = links
    .map((l) => document.getElementById(l.getAttribute('href').slice(1)))
    .filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((s) => observer.observe(s));
}

// ── Smooth anchor navigation ─────────────────────────
function goTo(selector, smooth) {
  const target = document.querySelector(selector);
  if (!target) return;
  const headerOffset = window.innerHeight * 0.14;
  const y = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  if (smooth && smooth.scrollTo) smooth.scrollTo(y);
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

function initNavigation(smooth) {
  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (href === '#' || href.length < 2) { event.preventDefault(); return; }

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    closeMenu();
    goTo(href, smooth);
    // history.replaceState, not pushState: the previous code did
    // `pushState(null, '', '#' + '#properties')`, producing "##properties".
    history.replaceState(null, '', href);
  });
}

// ── Mobile menu ──────────────────────────────────────
function closeMenu() {
  const menu = $('#mobileMenu');
  if (!menu) return;
  menu.classList.remove('is-open');
  menu.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}

function initMenu() {
  const menuBtn = $('.menu-btn');
  const menu = $('#mobileMenu');
  const closeBtn = $('.mm-close');
  if (!menuBtn || !menu) return;

  const toggle = (open) => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };

  menuBtn.addEventListener('click', () => toggle(!menu.classList.contains('is-open')));
  closeBtn?.addEventListener('click', () => toggle(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
}

// ── Search ───────────────────────────────────────────
function initSearch(smooth) {
  const btn = $('.search-btn');
  const panel = $('#siteSearch');
  const input = $('#siteSearchInput');
  if (!btn || !panel || !input) return;

  const close = () => { panel.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };

  btn.addEventListener('click', () => {
    const open = panel.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    if (open) { input.focus(); goTo('#properties', smooth); }
    else close();
  });

  input.addEventListener('input', () => {
    state.search = input.value;
    renderProperties(t, state.search);
    syncWishlistUI();
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// ── Contact form ─────────────────────────────────────
function initForm() {
  const form = $('#propertyInquiryForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    // No backend is wired up in this repository; surface a real confirmation
    // instead of the previous blocking alert(), and keep the payload visible
    // so a future endpoint can be attached without touching the markup.
    console.info('[ANSH] property inquiry', data);
    form.reset();
    toast(t('toast.sent'));
  });
}

// ── Contact links built from SITE so they cannot drift ──
function initContactLinks() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${SITE.mapsQuery}`;
  const waUrl = `https://wa.me/${SITE.whatsapp}`;

  $('#ctDirections')?.setAttribute('href', mapsUrl);
  $('#ctOpenMaps')?.setAttribute('href', mapsUrl);
  $('#ctWaBtn')?.setAttribute('href', `${waUrl}?text=${encodeURIComponent('Hello ANSH ASSOCIATES, I would like to enquire about a property.')}`);
  $('#ctWhatsApp')?.setAttribute('href', waUrl);
  $('#ctEmail')?.setAttribute('href', `mailto:${SITE.email}`);
  $$('.mm-ig').forEach((el) => el.setAttribute('href', mapsUrl));
}

// ── Boot ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  runIntro();

  state.lang = storedLanguage() || DEFAULT_LANG;
  loadWishlist();

  // Populate the three empty grids before anything measures them.
  renderAll(t, state.search);
  applyStaticTranslations();
  initContactLinks();
  syncWishlistUI();

  const smooth = createSmoothScroll({ duration: 1.2 });

  initMenu();
  initNavigation(smooth);
  initSearch(smooth);
  initForm();
  initHeaderState();
  initNavTracking();
  initGSAPAnimations();

  // Property save buttons are created by the renderer, so delegate.
  document.addEventListener('click', (event) => {
    const btn = event.target.closest('.prop-save');
    if (!btn) return;
    event.preventDefault();
    toggleWishlist(btn.dataset.save);
  });

  // Wishlist icon: jump to the first saved property, or invite the visitor.
  $('.wish-btn')?.addEventListener('click', (event) => {
    event.preventDefault();
    closeMenu();
    const first = state.wishlist.size ? $(`[data-property-id="${[...state.wishlist][0]}"]`) : null;
    if (first) goTo(`[data-property-id="${first.dataset.propertyId}"]`, smooth);
    else goTo('#properties', smooth);
  });

  $$('.cart-btn, .account-btn').forEach((el) =>
    el.addEventListener('click', (event) => {
      event.preventDefault();
      closeMenu();
      goTo('#contact', smooth);
      setTimeout(() => $('#name')?.focus(), 600);
    })
  );

  $$('.lang-btn').forEach((btn) =>
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang, { announce: true }))
  );

  window.addEventListener('hashchange', () => {
    if (window.location.hash) goTo(window.location.hash, smooth);
  });

// Store language preference
            const lang = btn.getAttribute('data-lang');
            localStorage.setItem('preferredLanguage', lang);

            // Optional: Trigger language change event
            document.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
        });
    });

    // Initialize language from storage on load
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang) {
        const storedLangBtn = document.querySelector(`.lang-btn[data-lang="${storedLang}"]`);
        if (storedLangBtn) {
            langBtns.forEach(btn => btn.classList.remove('is-active'));
            storedLangBtn.classList.add('is-active');
        }
    }

    // Handle property inquiry form submission
    const inquiryForm = document.getElementById('propertyInquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const formData = new FormData(inquiryForm);
            const data = Object.fromEntries(formData);

            // Here you would typically send this data to a backend service
            // For now, we'll show a success message
            alert('Thank you for your inquiry! Our team will contact you shortly.');

            // Reset form
            inquiryForm.reset();
        });
    }

    // Handle hero search form submission
    const heroSearchForm = document.querySelector('.hero-search');
    if (heroSearchForm) {
        heroSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const searchInput = heroSearchForm.querySelector('input[type="text"]');
            const searchTerm = searchInput.value.trim().toLowerCase();

            if (searchTerm) {
                filterPropertiesBySearch(searchTerm);
            } else {
                // If search is empty, show all properties
                populatePropertyGrid();
            }
        });
    }

    // Filter properties based on search term
    function filterPropertiesBySearch(searchTerm) {
        const propGrid = document.getElementById('propGrid');
        if (!propGrid) return;

        // Clear existing content
        propGrid.innerHTML = '';

        // Filter properties
        const filteredProperties = window.propertyData.filter(property =>
            property.title.toLowerCase().includes(searchTerm) ||
            property.location.toLowerCase().includes(searchTerm) ||
            property.description.toLowerCase().includes(searchTerm) ||
            property.features.some(feature => feature.toLowerCase().includes(searchTerm))
        );

        // Add filtered property cars
        filteredProperties.forEach((property, index) => {
            const propertyCard = document.createElement('li');
            propertyCard.className = 'property-card';

            // Property image container
            const propertyImageDiv = document.createElement('div');
            propertyImageDiv.className = 'property-image';

            const img = document.createElement('img');
            img.src = property.image;
            img.alt = property.title;

            const propertyOverlayDiv = document.createElement('div');
            propertyOverlayDiv.className = 'property-overlay';

            const propertyOverlayContentDiv = document.createElement('div');
            propertyOverlayContentDiv.className = 'property-overlay-content';

            const propertyOverlayIconDiv = document.createElement('div');
            propertyOverlayIconDiv.className = 'property-overlay-icon';

            const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgIcon.setAttribute('viewBox', '0 0 24 24');
            svgIcon.setAttribute('fill', 'none');
            svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

            const pathIcon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathIcon.setAttribute('d', 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z');
            pathIcon.setAttribute('stroke', 'currentColor');
            pathIcon.setAttribute('stroke-width', '1.5');
            pathIcon.setAttribute('stroke-linecap', 'round');
            pathIcon.setAttribute('stroke-linejoin', 'round');

            propertyOverlayIconDiv.appendChild(svgIcon);
            svgIcon.appendChild(pathIcon);

            const propertyOverlayTextDiv = document.createElement('div');
            propertyOverlayTextDiv.className = 'property-overlay-text';
            propertyOverlayTextDiv.textContent = 'View Details';

            propertyOverlayContentDiv.appendChild(propertyOverlayIconDiv);
            propertyOverlayContentDiv.appendChild(propertyOverlayTextDiv);
            propertyOverlayDiv.appendChild(propertyOverlayContentDiv);
            propertyImageDiv.appendChild(img);
            propertyImageDiv.appendChild(propertyOverlayDiv);

            // Property content container
            const propertyContentDiv = document.createElement('div');
            propertyContentDiv.className = 'property-content';

            const propertyTitleH3 = document.createElement('h3');
            propertyTitleH3.className = 'property-title';
            propertyTitleH3.textContent = property.title;

            const propertyLocationDiv = document.createElement('div');
            propertyLocationDiv.className = 'property-location';

            const locationSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            locationSvg.setAttribute('viewBox', '0 0 24 24');
            locationSvg.setAttribute('fill', 'none');
            locationSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

            const locationPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            locationPath.setAttribute('d', 'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z');
            locationPath.setAttribute('stroke', 'currentColor');
            locationPath.setAttribute('stroke-width', '1.2');
            locationPath.setAttribute('stroke-linecap', 'round');
            locationPath.setAttribute('stroke-linejoin', 'round');

            const locationSpan = document.createElement('span');
            locationSpan.textContent = property.location;

            propertyLocationDiv.appendChild(locationSvg);
            locationSvg.appendChild(locationPath);
            propertyLocationDiv.appendChild(locationSpan);

            const propertyPriceDiv = document.createElement('div');
            propertyPriceDiv.className = 'property-price';
            propertyPriceDiv.textContent = property.price;

            const propertyFeaturesDiv = document.createElement('div');
            propertyFeaturesDiv.className = 'property-features';

            property.features.forEach(feature => {
                const featureSpan = document.createElement('span');
                featureSpan.className = 'property-feature';
                featureSpan.textContent = feature;
                propertyFeaturesDiv.appendChild(featureSpan);
            });

            const propertyDescriptionP = document.createElement('p');
            propertyDescriptionP.className = 'property-description';
            propertyDescriptionP.textContent = property.description;

            propertyContentDiv.appendChild(propertyTitleH3);
            propertyContentDiv.appendChild(propertyLocationDiv);
            propertyContentDiv.appendChild(propertyPriceDiv);
            propertyContentDiv.appendChild(propertyFeaturesDiv);
            propertyContentDiv.appendChild(propertyDescriptionP);

            propertyCard.appendChild(propertyImageDiv);
            propertyCard.appendChild(propertyContentDiv);

            // Add reveal animation attribute
            propertyCard.setAttribute('data-reveal', '');

            propGrid.appendChild(propertyCard);
        });

        // Update property counter to show filtered count
        const propCurrent = document.getElementById('propCurrent');
        if (propCurrent) {
            propCurrent.textContent = filteredProperties.length.toString().padStart(2, '0');
        }
    }

    // Add scroll progress indicator (optional)
    // const progressBar = document.createElement('div');
    // progressBar.className = 'scroll-progress';
    // progressBar.innerHTML = '<div class="progress-bar"></div>';
    // document.body.appendChild(progressBar);

    // Update progress on scroll
    // lenis.on('scroll', ({ scroll, limit }) => {
    //     const progress = scroll / limit;
    //     document.querySelector('.progress-bar').style.width = `${progress * 100}%`;
    // });

    // Reveal elements on load for initial view
    setTimeout(() => {
        const revealElements = document.querySelectorAll('[data-reveal]');
        revealElements.forEach(el => {
            el.classList.add('visible');
        });
    }, 300);
});
