// ══════════════════════════════════════════════════
//  ANSH ASSOCIATES — Content Data
//  Single source of truth for everything rendered into
//  the page at runtime (properties, services, testimonials).
//  Every string here is an i18n key resolved via js/i18n.js
//  unless it is inherently non-translatable (a price, a date).
// ══════════════════════════════════════════════════

export const SITE = {
  name: 'ANSH ASSOCIATES',
  phoneDisplay: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
  whatsapp: '919876543210',
  email: 'info@anshassociates.com',
  mapsQuery: 'ANSH+ASSOCIATES+MG+Road+Bangalore',
  // Normalised once so the header, footer and structured data cannot drift apart.
  address: {
    street: '123 Prestige Towers, MG Road',
    city: 'Bangalore',
    postcode: '560001',
    region: 'Karnataka',
    country: 'IN'
  }
};

export const PROPERTIES = [
  {
    id: 'prestige-heights',
    key: 'prop.1',
    image: 'assets/img/properties/prestige-heights.jpg',
    width: 1408,
    height: 768,
    price: '₹2.5 Cr',
    features: ['4 BHK', '3 Bath', 'Balcony', 'Parking']
  },
  {
    id: 'royal-palm-villas',
    key: 'prop.2',
    image: 'assets/img/properties/royal-palm-villas.jpg',
    width: 1408,
    height: 768,
    price: '₹5.8 Cr',
    features: ['5 BHK', '4 Bath', 'Garden', 'Pool']
  },
  {
    id: 'skyline-towers',
    key: 'prop.3',
    image: 'assets/img/properties/skyline-towers.jpg',
    width: 1408,
    height: 768,
    price: '₹1.9 Cr',
    features: ['3 BHK', '2 Bath', 'Balcony', 'Gym']
  },
  {
    id: 'heritage-manor',
    key: 'prop.4',
    image: 'assets/img/properties/heritage-manor.jpg',
    width: 1408,
    height: 768,
    price: '₹3.2 Cr',
    features: ['4 BHK', '3 Bath', 'Terrace', 'Heritage']
  }
];

// Inline SVG so the service icons inherit currentColor and need no extra requests.
const ICONS = {
  home: '<svg viewBox="0 0 32 32" fill="none"><path d="M4 14 16 4l12 10v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V14Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M13 28v-8h6v8" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  tower: '<svg viewBox="0 0 32 32" fill="none"><path d="M6 28V9l9-5 11 5v19" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M3 28h26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M11 13h3m4 0h3M11 18h3m4 0h3M11 23h3m4 0h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  chart: '<svg viewBox="0 0 32 32" fill="none"><path d="M4 27h24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 27V18m6 9V11m6 16v-9m6 9V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="m5 13 7-7 6 4 8-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  key: '<svg viewBox="0 0 32 32" fill="none"><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5"/><path d="m15.5 15.5 12 12M23 23l3-3M19 19l2.5-2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  doc: '<svg viewBox="0 0 32 32" fill="none"><path d="M8 3h11l6 6v20H8V3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M19 3v6h6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 17h9M12 22h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  scale: '<svg viewBox="0 0 32 32" fill="none"><path d="M16 5v22M8 27h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M16 9 6 12m10-3 10 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M2 12h8l-4 7-4-7Zm20 0h8l-4 7-4-7Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>'
};

export const SERVICES = [
  { key: 'serv.1', icon: ICONS.home },
  { key: 'serv.2', icon: ICONS.tower },
  { key: 'serv.3', icon: ICONS.chart },
  { key: 'serv.4', icon: ICONS.key },
  { key: 'serv.5', icon: ICONS.doc },
  { key: 'serv.6', icon: ICONS.scale }
];

export const TESTIMONIALS = [
  {
    key: 'tst.1',
    initials: 'RK',
    rating: 5,
    meta: 'Mumbai, Maharashtra • March 2024'
  },
  {
    key: 'tst.2',
    initials: 'PS',
    rating: 5,
    meta: 'Delhi NCR • January 2024'
  },
  {
    key: 'tst.3',
    initials: 'AP',
    rating: 5,
    meta: 'Bangalore, Karnataka • February 2024'
  }
];

// The leadership carousel is a React island (src/leadership.tsx) that
// renders these people through <CircularTestimonials />. Copy is keyed
// into js/i18n.js so the English/हिन्दी switch covers it too.
export const LEADERSHIP = [
  { key: 'lead.1', image: 'assets/img/leadership/founder.jpg' },
  { key: 'lead.2', image: 'assets/img/leadership/managing-director.jpg' },
  { key: 'lead.3', image: 'assets/img/leadership/head-investments.jpg' },
  { key: 'lead.4', image: 'assets/img/leadership/client-relations.jpg' }
];

export const PROPERTY_TYPES = ['residential', 'commercial', 'land', 'investment'];
export const BUDGETS = ['under-50lac', '50lac-1cr', '1cr-2cr', '2cr-5cr', 'above-5cr'];
