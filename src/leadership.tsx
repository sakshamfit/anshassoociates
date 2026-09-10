// ══════════════════════════════════════════════════════════════
//  ANSH ASSOCIATES — Leadership "React island"
//
//  The surrounding site is a build-free vanilla page; this entry is
//  the single React surface on it. It is bundled by esbuild into
//  js/vendor/leadership.bundle.js (see package.json → build) and
//  mounted onto #leadershipWall.
//
//  Content comes from the site's own data + i18n modules so the
//  English/हिन्दी switch re-renders the island through the existing
//  `languageChange` CustomEvent that js/main.js already dispatches.
// ══════════════════════════════════════════════════════════════

import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { CircularTestimonials } from "@/components/ui/circular-testimonials";
import { LEADERSHIP } from "../js/data.js";
import { translate, storedLanguage, DEFAULT_LANG, LANGUAGES } from "../js/i18n.js";

type Lang = (typeof LANGUAGES)[number];

function LeadershipIsland() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = storedLanguage();
    return (LANGUAGES as string[]).includes(saved as string) ? (saved as Lang) : DEFAULT_LANG;
  });
  const [inView, setInView] = useState(false);

  // Re-render on the site-wide language switch.
  useEffect(() => {
    const onLang = (e: Event) => {
      const detail = (e as CustomEvent<{ lang?: string }>).detail;
      if (detail?.lang && (LANGUAGES as string[]).includes(detail.lang)) {
        setLang(detail.lang as Lang);
      }
    };
    document.addEventListener("languageChange", onLang);
    return () => document.removeEventListener("languageChange", onLang);
  }, []);

  // Arrow-key navigation only while the section is on screen, so the
  // component's window-level handler never steals scrolling elsewhere.
  useEffect(() => {
    const section = document.getElementById("leadership");
    if (!section || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.isIntersecting)),
      { rootMargin: "0px" }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const testimonials = useMemo(
    () =>
      LEADERSHIP.map((person) => ({
        name: translate(`${person.key}.name`, lang),
        designation: translate(`${person.key}.role`, lang),
        quote: translate(`${person.key}.quote`, lang),
        src: person.image,
      })),
    [lang]
  );

  const autoplay = useMemo(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  return (
    <CircularTestimonials
      testimonials={testimonials}
      autoplay={autoplay}
      keyboard={inView}
      colors={{
        name: "#2C1810",
        designation: "#8B0000",
        testimony: "#4A3B2F",
        arrowBackground: "#8B0000",
        arrowForeground: "#F8F4E3",
        arrowHoverBackground: "#2C1810",
      }}
      fontSizes={{
        name: "28px",
        designation: "17px",
        quote: "19px",
      }}
    />
  );
}

function mount() {
  const host = document.getElementById("leadershipWall");
  if (!host) return;
  createRoot(host).render(<LeadershipIsland />);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount, { once: true });
} else {
  mount();
}
