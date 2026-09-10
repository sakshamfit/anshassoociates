// ══════════════════════════════════════════════════
//  ANSH ASSOCIATES — Dependency-free smooth scroll
//
//  Replaces the previously referenced js/vendor/lenis.min.js,
//  which was not present in the repository (the script tag 404'd
//  and `new Lenis(...)` threw, killing every handler in main.js).
//
//  Design note: rather than translating a wrapper (which desyncs
//  ScrollTrigger unless you wire up scrollerProxy), this drives the
//  real window scroll position on the GSAP ticker. ScrollTrigger
//  therefore stays perfectly in sync, because it is reading the
//  same native scroll offset we are writing.
//
//  Falls back to plain native scrolling when:
//    - the user prefers reduced motion
//    - the device is touch-primary
//    - GSAP is unavailable
// ══════════════════════════════════════════════════

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// Same ease-out-expo curve Lenis ships with by default.
export const defaultEasing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function createSmoothScroll(options = {}) {
  const {
    duration = 1.2,
    easing = defaultEasing,
    wheelMultiplier = 1
  } = options;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const touchPrimary = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (reduceMotion.matches || touchPrimary || typeof window.gsap === 'undefined') {
    return null; // native scrolling — CSS `scroll-behavior: smooth` handles anchors
  }

  const root = document.documentElement;
  // Critical: our rAF writes scroll every frame, so CSS smooth scrolling
  // would fight it and produce visible stutter.
  root.style.scrollBehavior = 'auto';

  let target = window.scrollY;
  let current = window.scrollY;
  let startTime = 0;
  let from = 0;
  let to = 0;
  let animating = false;
  let nativeScroll = false; // distinguishes our writes from user/keyboard/scrollbar
  let enabled = true;

  const maxScroll = () => Math.max(0, document.body.scrollHeight - window.innerHeight);

  const settle = () => {
    from = window.scrollY;
    to = from;
    current = from;
    target = from;
    startTime = performance.now();
    animating = false;
  };

  const onWheel = (event) => {
    if (!enabled) return;
    // Never hijack a modifier-scroll or a horizontally-dominant gesture.
    if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

    event.preventDefault();
    animating = false;

    // deltaMode 1 = lines, 2 = pages — normalise to pixels.
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    target = clamp(target + event.deltaY * unit * wheelMultiplier, 0, maxScroll());
  };

  const onScroll = () => {
    if (nativeScroll) {
      nativeScroll = false;
      return;
    }
    // Scrollbar drag, keyboard, browser find-in-page, or an anchor jump.
    settle();
  };

  const tick = (now) => {
    const distance = target - current;
    if (Math.abs(distance) < 0.4) {
      if (current !== target) {
        nativeScroll = true;
        current = target;
        window.scrollTo(0, current);
      }
      return;
    }

    // Frame-rate independent lerp derived from the configured duration.
    const rate = 1 - Math.exp((-6 / Math.max(duration, 0.05)) * (1 / 60));
    current += distance * rate;

    nativeScroll = true;
    window.scrollTo(0, current);

    if (typeof window.ScrollTrigger !== 'undefined') window.ScrollTrigger.update();
    void now; void easing; void startTime; void from; void to; void animating;
  };

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', settle);

  // Keep the anchor-jump path consistent with the smooth curve.
  const scrollToTarget = (y) => {
    target = clamp(y, 0, maxScroll());
    if (current === target) return;
    const step = (now) => {
      if (Math.abs(target - current) < 0.5) { settle(); return; }
      const progress = clamp((now - startTime) / (duration * 1000), 0, 1);
      current = from + (target - from) * easing(progress);
      nativeScroll = true;
      window.scrollTo(0, current);
      if (progress < 1) requestAnimationFrame(step);
      else settle();
    };
    from = window.scrollY;
    startTime = performance.now();
    requestAnimationFrame(step);
  };

  // Drive the lerp off the GSAP ticker so it shares one rAF with the animations.
  window.gsap.ticker.add(tick);
  settle();

  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) { enabled = false; window.gsap.ticker.remove(tick); settle(); }
    else { enabled = true; window.gsap.ticker.add(tick); }
  });

  return {
    scrollTo: scrollToTarget,
    stop: () => { enabled = false; window.gsap.ticker.remove(tick); settle(); root.style.scrollBehavior = ''; },
    get scroll() { return window.scrollY; }
  };
}
