// ══════════════════════════════════════════════════
//  ANSH ASSOCIATES — Animation
//
//  This file previously began with:
//      import { gsap } from './vendor/gsap.min.js';
//  resolved from js/animations/, that points at
//  js/animations/vendor/gsap.min.js — a path that does not exist. And
//  even at the correct path the vendor bundle is a UMD script with no
//  ES exports, so the named import would have failed regardless. The
//  whole module graph threw, which took js/main.js down with it.
//
//  GSAP and ScrollTrigger are already on the page via classic <script>
//  tags, so they are read from the global scope. Every animation is
//  additionally gated on their presence, and on prefers-reduced-motion,
//  so the page degrades to plain CSS reveals rather than to a blank one.
// ══════════════════════════════════════════════════

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Content reveals are CSS-driven ([data-reveal] → .visible) so they work
// whether or not GSAP is available.
export function initRevealObserver() {
  const nodes = () => [...document.querySelectorAll('[data-reveal]:not(.visible)')];

  if (!('IntersectionObserver' in window)) {
    nodes().forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
  );

  const observe = () => nodes().forEach((el) => observer.observe(el));
  observe();

  // The property grid is re-rendered on search and on language change.
  document.addEventListener('ansh:rendered', observe);
  return observer;
}

function animateHero(gsap) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });

  tl.from('.hero-copy .eyebrow', { opacity: 0, y: 24, duration: 0.7 })
    .from('.display-word', { opacity: 0, y: 46, duration: 1.05 }, '-=0.35')
    .from('.hero-copy .subline', { opacity: 0, y: 20, duration: 0.7 }, '-=0.55')
    .from('.hero-copy .cta', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from('.signature', { opacity: 0, y: 24, duration: 0.7 }, '-=0.3')
    .from('.signature-grid li', { opacity: 0, y: 18, duration: 0.5, stagger: 0.12 }, '-=0.4')
    .from('.hero-side', { opacity: 0, x: 28, duration: 0.8 }, '-=0.9')
    .from('.hero-script', { opacity: 0, y: 20, duration: 0.8 }, '-=0.9')
    .from('.hero-scroll', { opacity: 0, y: 18, duration: 0.6 }, '-=0.8');

  // Draw the calligraphic swash under the headline.
  document.querySelectorAll('.swash-line').forEach((path, i) => {
    const length = path.getTotalLength ? path.getTotalLength() : 0;
    if (!length) return;
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    tl.to(path, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, `-=${1.6 - i * 0.35}`);
  });

  return tl;
}

function animateEntrance(gsap) {
  // clearProps strips the inline transform GSAP leaves behind, so the CSS
  // :hover / focus transforms on these controls keep working afterwards.
  gsap.from('#logo-header', { opacity: 0, scale: 0.86, duration: 0.9, ease: 'power2.out', delay: 0.2, clearProps: 'transform,opacity' });
  gsap.from('.nav-link', { opacity: 0, y: -12, duration: 0.6, stagger: 0.06, ease: 'power2.out', delay: 0.45, clearProps: 'transform,opacity' });
  gsap.from('.header-utils .icon-btn, .header-utils .lang-switch', {
    opacity: 0, y: -10, duration: 0.5, stagger: 0.05, ease: 'power2.out', delay: 0.6, clearProps: 'transform,opacity'
  });
}

function initScrollEffects(gsap, ScrollTrigger) {
  // Slow parallax drift on the decorative botanicals — cheap and subtle.
  gsap.utils.toArray('.prop-florals img, .about-florals img, .test-florals img, .con-florals img').forEach((img) => {
    gsap.to(img, {
      yPercent: -14,
      ease: 'none',
      scrollTrigger: { trigger: img.closest('section') || img, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  gsap.utils.toArray('.serv-blossoms img, .serv-leaves img').forEach((img) => {
    gsap.to(img, {
      rotate: img.closest('.serv-leaves') ? -5 : 6,
      yPercent: -10,
      ease: 'none',
      scrollTrigger: { trigger: '#services', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // Hero image pushes back as the section leaves. The frame is inset:0 and
  // clipped by #hero's overflow:hidden, so the scale must exceed the travel
  // distance or the translate would expose the section background at the top.
  gsap.to('#heroFrame', {
    yPercent: 7,
    scale: 1.18,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });
}

// Note: card hover lift is intentionally left to CSS. Every card already has
// `:hover { transform: translateY(-8px) }`, and a GSAP tween would write an
// inline transform that overrides it — the two would fight.

export function initGSAPAnimations() {
  initRevealObserver();

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (!gsap) return; // CSS reveals still run — the page is never blank.
  if (prefersReducedMotion()) {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('visible'));
    return;
  }

  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    // The hero entrance is deliberately not scroll-scrubbed, so let it finish
    // before ScrollTrigger starts measuring pinned/scrubbed tweens.
    animateHero(gsap);
    initScrollEffects(gsap, ScrollTrigger);
  } else {
    animateHero(gsap);
  }

  animateEntrance(gsap);

  // Re-rendered grids (search, language switch) need their reveals re-armed.
  document.addEventListener('ansh:rendered', () => {
    if (ScrollTrigger) ScrollTrigger.refresh();
  });
}
