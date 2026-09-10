// ══════════════════════════════════════════════════
//  ANSH ASSOCIATES — Internationalisation
//
//  The markup already carried data-i18n / data-i18n-aria hooks on 80+
//  nodes and the header shipped an English/हिन्दी switch, but no
//  translation layer existed: the buttons toggled an `is-active`
//  class, wrote to localStorage, and dispatched an event nobody
//  listened to. Nothing on screen ever changed.
//
//  This module is that missing layer. Keys are flat so they map 1:1
//  onto the data-i18n attribute values in index.html.
//  Values may contain <br> — they are applied via innerHTML.
// ══════════════════════════════════════════════════

export const LANGUAGES = ['en', 'hi'];
export const DEFAULT_LANG = 'en';
const STORAGE_KEY = 'ansh:lang';

const en = {
  'nav.home': 'Home',
  'nav.properties': 'Properties',
  'nav.services': 'Services',
  'nav.about': 'About Us',
  'nav.testimonials': 'Testimonials',
  'nav.contact': 'Contact',

  'aria.search': 'Search',
  'aria.account': 'Account',
  'aria.wishlist': 'Wishlist',
  'aria.bag': 'Enquiries',
  'aria.menu': 'Menu',

  'com.bag': 'Enquiries',
  'com.wishlist': 'Wishlist',
  'com.account': 'Account',

  'hero.eyebrow': 'Premium Properties for',
  'hero.display': 'Discerning Clients',
  'hero.subline': 'ANSH ASSOCIATES — Where luxury meets opportunity',
  'hero.cta': 'Explore Our Properties',

  'sig.overline': 'The ANSH Standard',
  'sig.fabrics': 'Trust<br>Integrity',
  'sig.craft': 'Expertise<br>Experience',
  'sig.elegance': 'Excellence<br>Results',

  'scroll.cue': 'Scroll to Discover',

  'search.label': 'Search properties',
  'search.placeholder': 'Search by name, city or feature…',

  'prop.empty': 'No properties match your search.',
  'prop.countLabel': 'Listings',
  'prop.save': 'Save',

  'prop.statement': 'Exclusive Properties',
  'prop.eyebrow': 'Featured Properties',
  'prop.heading': 'Luxury Living Spaces',
  'prop.sub': 'Carefully curated residential and commercial properties for the discerning investor.',
  'prop.cta': 'View All Properties',
  'prop.ethos': 'Quality<br>Location<br>Value',
  'prop.view': 'View Details',

  'prop.1.title': 'Prestige Heights',
  'prop.1.location': 'Bangalore, Karnataka',
  'prop.1.desc': 'Luxury apartment with panoramic city views and premium amenities.',
  'prop.2.title': 'Royal Palm Villas',
  'prop.2.location': 'Mumbai, Maharashtra',
  'prop.2.desc': 'Spacious villa with a private garden and swimming pool.',
  'prop.3.title': 'Skyline Towers',
  'prop.3.location': 'Hyderabad, Telangana',
  'prop.3.desc': 'Modern high-rise with a state-of-the-art fitness centre.',
  'prop.4.title': 'Heritage Manor',
  'prop.4.location': 'Jaipur, Rajasthan',
  'prop.4.desc': 'Restored heritage property with contemporary amenities.',

  'serv.eyebrow': 'Our Services',
  'serv.heading': 'Comprehensive Services',
  'serv.support': 'End-to-end real estate solutions tailored to your unique needs.',
  'serv.side': 'Complete<br>Property<br>Solutions',
  'serv.foot': 'Your property journey — guided by ANSH ASSOCIATES.',

  'serv.1.title': 'Residential Sales',
  'serv.1.text': 'Apartments, villas and plotted development, sourced and verified end to end.',
  'serv.2.title': 'Commercial Leasing',
  'serv.2.text': 'Office, retail and warehousing space matched to your operational footprint.',
  'serv.3.title': 'Investment Advisory',
  'serv.3.text': 'Yield modelling and market timing for portfolios of every scale.',
  'serv.4.title': 'Property Management',
  'serv.4.text': 'Tenancy, upkeep and reporting handled by a dedicated account manager.',
  'serv.5.title': 'Legal &amp; Documentation',
  'serv.5.text': 'Title diligence, registration and stamp duty, reviewed before you sign.',
  'serv.6.title': 'Valuation &amp; Research',
  'serv.6.text': 'Independently benchmarked valuations backed by live transaction data.',

  'abt.eyebrow': 'About Us',
  'abt.heading': 'ANSH ASSOCIATES',
  'abt.side': 'Est.<br>Trust · Craft',
  'abt.support': 'Founded on principles of trust, integrity and excellence, ANSH ASSOCIATES has emerged as a premier real estate firm specialising in luxury properties and investment opportunities.',
  'abt.mission.t': 'Our Mission',
  'abt.mission.line': 'To provide unparalleled real estate services that exceed client expectations while maintaining the highest standards of professionalism and ethics.',
  'abt.mission.note': 'Client satisfaction is our priority.',
  'abt.vision.t': 'Our Vision',
  'abt.vision.line': 'To be the most trusted real estate brand, known for integrity, innovation and exceptional client service.',
  'abt.vision.note': 'Building lasting relationships one property at a time.',
  'abt.values.t': 'Our Values',
  'abt.values.line': 'Trust · Integrity · Excellence · Innovation · Client-Centric Approach',
  'abt.values.note': 'The foundation of everything we do.',
  'abt.foot': 'Two decades of discretion, diligence and delivered outcomes.',
  'abt.media.alt': 'The ANSH ASSOCIATES advisory team',

  'tst.eyebrow': 'What Our Clients Say',
  'tst.heading': 'Client Experiences',
  'tst.side': 'Trusted<br>Coast to Coast',
  'tst.support': 'Hear from clients who have experienced the ANSH ASSOCIATES difference.',
  'tst.rating': '{n}/5 Rating',
  'tst.foot': 'Every engagement begins with listening — and ends with a signed deed.',

  'tst.1.name': 'Rajesh Kumar',
  'tst.1.text': '“ANSH ASSOCIATES helped me find my dream luxury apartment. Their professionalism, attention to detail and commitment to client satisfaction made the entire process seamless and enjoyable.”',
  'tst.2.name': 'Priya Sharma',
  'tst.2.text': '“As an investor I have worked with several firms, but ANSH ASSOCIATES stands out for market knowledge, transparency and a genuine dedication to maximising returns.”',
  'tst.3.name': 'Amit Patel',
  'tst.3.text': '“The team exceeded my expectations in every way. From the first consultation to the final closing they provided expert guidance throughout my commercial purchase.”',

  'ct.eyebrow': 'Contact Us',
  'ct.heading': 'Get in Touch',
  'ct.support': 'Ready to find your perfect property? Our team is here to assist you with expert guidance and personalised service.',
  'ct.office.alt': 'ANSH ASSOCIATES office interior',

  'ct.phone.t': 'Call Us',
  'ct.phone.line': '+91 98765 43210',
  'ct.phone.note': 'Available Monday–Saturday, 9AM–7PM',
  'ct.location.t': 'Visit Us',
  'ct.location.addr': '123 Prestige Towers,<br>MG Road, Bangalore 560001',
  'ct.location.note': 'By appointment only',
  'ct.email.t': 'Email Us',
  'ct.email.note': 'Responses within 24 hours',
  'ct.whatsapp.t': 'WhatsApp',
  'ct.whatsapp.note': 'Instant property inquiries',
  'ct.directions': 'Get Directions',
  'ct.wa.btn': 'Chat on WhatsApp',
  'ct.google': 'Find Us on Google',
  'ct.google.line': 'Find Us on Google · ANSH ASSOCIATES, Bangalore',

  'ct.inq.h': 'Property Inquiry',
  'ct.inq.name': 'Full Name',
  'ct.inq.email': 'Email Address',
  'ct.inq.phone': 'Phone Number',
  'ct.inq.type': 'Property Type',
  'ct.inq.budget': 'Budget Range',
  'ct.inq.message': 'Message (Optional)',
  'ct.inq.submit': 'Send Inquiry',

  'ct.ph.name': 'Enter your full name',
  'ct.ph.email': 'Enter your email address',
  'ct.ph.phone': 'Enter your phone number',
  'ct.ph.message': 'Any specific requirements or questions…',

  'ct.opt.selectType': 'Select Property Type',
  'ct.opt.residential': 'Residential',
  'ct.opt.commercial': 'Commercial',
  'ct.opt.land': 'Land / Plot',
  'ct.opt.investment': 'Investment',
  'ct.opt.selectBudget': 'Select Budget Range',
  'ct.opt.under-50lac': 'Under ₹50 Lakhs',
  'ct.opt.50lac-1cr': '₹50 Lakhs – ₹1 Crore',
  'ct.opt.1cr-2cr': '₹1 Crore – ₹2 Crores',
  'ct.opt.2cr-5cr': '₹2 Crores – ₹5 Crores',
  'ct.opt.above-5cr': 'Above ₹5 Crores',

  'ct.quote': '“Your dream property is just a conversation away.”',
  'ct.loc.eyebrow': 'Our Location',
  'ct.loc.city': 'Bangalore',
  'ct.loc.line': 'Premium real estate services in India’s Silicon Valley.',
  'ct.map.open': 'Open in Maps',
  'ct.map.alt': 'Stylised map of our MG Road location',

  'toast.sent': 'Thank you — your inquiry has been received. Our team will contact you shortly.',
  'toast.lang': 'Language switched to English',
  'footer.rights': 'All rights reserved.'
};

const hi = {
  'nav.home': 'होम',
  'nav.properties': 'संपत्तियाँ',
  'nav.services': 'सेवाएँ',
  'nav.about': 'हमारे बारे में',
  'nav.testimonials': 'प्रशंसापत्र',
  'nav.contact': 'संपर्क',

  'aria.search': 'खोजें',
  'aria.account': 'खाता',
  'aria.wishlist': 'पसंदीदा सूची',
  'aria.bag': 'पूछताछ',
  'aria.menu': 'मेन्यू',

  'com.bag': 'पूछताछ',
  'com.wishlist': 'पसंदीदा सूची',
  'com.account': 'खाता',

  'hero.eyebrow': 'प्रीमियम संपत्तियाँ',
  'hero.display': 'समझदार ग्राहकों के लिए',
  'hero.subline': 'अंश एसोसिएट्स — जहाँ विलासिता अवसर से मिलती है',
  'hero.cta': 'हमारी संपत्तियाँ देखें',

  'sig.overline': 'अंश मानक',
  'sig.fabrics': 'विश्वास<br>ईमानदारी',
  'sig.craft': 'विशेषज्ञता<br>अनुभव',
  'sig.elegance': 'उत्कृष्टता<br>परिणाम',

  'scroll.cue': 'खोजने के लिए स्क्रॉल करें',

  'search.label': 'संपत्तियाँ खोजें',
  'search.placeholder': 'नाम, शहर या सुविधा से खोजें…',

  'prop.empty': 'आपकी खोज से कोई संपत्ति मेल नहीं खाती।',
  'prop.countLabel': 'संपत्तियाँ',
  'prop.save': 'सहेजें',

  'prop.statement': 'अनन्य संपत्तियाँ',
  'prop.eyebrow': 'चयनित संपत्तियाँ',
  'prop.heading': 'विलासिता जीवन स्थान',
  'prop.sub': 'समझदार निवेशकों के लिए सावधानी से चुने गए आवासीय और व्यावसायिक स्थान।',
  'prop.cta': 'सभी संपत्तियाँ देखें',
  'prop.ethos': 'गुणवत्ता<br>स्थान<br>मूल्य',
  'prop.view': 'विवरण देखें',

  'prop.1.title': 'प्रेस्टीज हाइट्स',
  'prop.1.location': 'बेंगलुरु, कर्नाटक',
  'prop.1.desc': 'शहर के मनोरम दृश्य और प्रीमियम सुविधाओं वाला विलासिता अपार्टमेंट।',
  'prop.2.title': 'रॉयल पाम विलास',
  'prop.2.location': 'मुंबई, महाराष्ट्र',
  'prop.2.desc': 'निजी बगीचे और स्विमिंग पूल वाला विशाल विला।',
  'prop.3.title': 'स्काईलाइन टॉवर्स',
  'prop.3.location': 'हैदराबाद, तेलंगाना',
  'prop.3.desc': 'अत्याधुनिक फ़िटनेस सेंटर वाला आधुनिक हाई-राइज़।',
  'prop.4.title': 'हेरिटेज मनोर',
  'prop.4.location': 'जयपुर, राजस्थान',
  'prop.4.desc': 'आधुनिक सुविधाओं के साथ पुनर्निर्मित विरासत संपत्ति।',

  'serv.eyebrow': 'हमारी सेवाएँ',
  'serv.heading': 'व्यापक सेवाएँ',
  'serv.support': 'आपकी विशिष्ट आवश्यकताओं के अनुरूप संपूर्ण रियल एस्टेट समाधान।',
  'serv.side': 'संपूर्ण<br>संपत्ति<br>समाधान',
  'serv.foot': 'आपकी संपत्ति की यात्रा — अंश एसोसिएट्स के मार्गदर्शन में।',

  'serv.1.title': 'आवासीय बिक्री',
  'serv.1.text': 'अपार्टमेंट, विला और प्लॉट — स्रोत से सत्यापन तक पूरी प्रक्रिया।',
  'serv.2.title': 'व्यावसायिक लीज़िंग',
  'serv.2.text': 'आपकी कार्य आवश्यकताओं के अनुरूप कार्यालय, रिटेल और गोदाम स्थान।',
  'serv.3.title': 'निवेश सलाह',
  'serv.3.text': 'हर स्तर के पोर्टफोलियो के लिए रिटर्न मॉडलिंग और सही समय का चयन।',
  'serv.4.title': 'संपत्ति प्रबंधन',
  'serv.4.text': 'किरायेदारी, रखरखाव और रिपोर्टिंग — समर्पित प्रबंधक द्वारा।',
  'serv.5.title': 'कानूनी एवं दस्तावेज़ीकरण',
  'serv.5.text': 'स्वामित्व जाँच, पंजीकरण और स्टांप ड्यूटी — हस्ताक्षर से पहले समीक्षित।',
  'serv.6.title': 'मूल्यांकन एवं शोध',
  'serv.6.text': 'वास्तविक लेन-देन आँकड़ों पर आधारित स्वतंत्र मूल्यांकन।',

  'abt.eyebrow': 'हमारे बारे में',
  'abt.heading': 'अंश एसोसिएट्स',
  'abt.side': 'स्थापित<br>विश्वास · कौशल',
  'abt.support': 'विश्वास, ईमानदारी और उत्कृष्टता के सिद्धांतों पर स्थापित, अंश एसोसिएट्स विलासिता संपत्तियों और निवेश अवसरों में विशेषज्ञता रखने वाली एक अग्रणी रियल एस्टेट फ़र्म बनकर उभरी है।',
  'abt.mission.t': 'हमारा लक्ष्य',
  'abt.mission.line': 'व्यावसायिकता और नैतिकता के उच्चतम मानकों को बनाए रखते हुए ग्राहकों की अपेक्षाओं से आगे बढ़कर अद्वितीय रियल एस्टेट सेवाएँ प्रदान करना।',
  'abt.mission.note': 'ग्राहक संतुष्टि हमारी सर्वोच्च प्राथमिकता है।',
  'abt.vision.t': 'हमारी दृष्टि',
  'abt.vision.line': 'ईमानदारी, नवाचार और उत्कृष्ट सेवा के लिए पहचाना जाने वाला सबसे विश्वसनीय रियल एस्टेट ब्रांड बनना।',
  'abt.vision.note': 'एक संपत्ति के साथ स्थायी संबंधों का निर्माण।',
  'abt.values.t': 'हमारे मूल्य',
  'abt.values.line': 'विश्वास · ईमानदारी · उत्कृष्टता · नवाचार · ग्राहक-केंद्रित दृष्टिकोण',
  'abt.values.note': 'हम जो कुछ करते हैं, उसकी नींव।',
  'abt.foot': 'दो दशकों का विवेक, परिश्रम और पूरा किया गया भरोसा।',
  'abt.media.alt': 'अंश एसोसिएट्स सलाहकार दल',

  'tst.eyebrow': 'हमारे ग्राहक क्या कहते हैं',
  'tst.heading': 'ग्राहक अनुभव',
  'tst.side': 'देशभर में<br>विश्वसनीय',
  'tst.support': 'उन ग्राहकों से सुनें जिन्होंने अंश एसोसिएट्स का अनुभव किया है।',
  'tst.rating': '{n}/5 रेटिंग',
  'tst.foot': 'हर कार्य सुनने से शुरू होता है — और रजिस्ट्री के साथ पूरा।',

  'tst.1.name': 'राजेश कुमार',
  'tst.1.text': '“अंश एसोसिएट्स ने मुझे मेरा सपनों का विलासिता अपार्टमेंट खोजने में मदद की। उनकी व्यावसायिकता और ग्राहक संतुष्टि के प्रति समर्पण ने पूरी प्रक्रिया को सहज बना दिया।”',
  'tst.2.name': 'प्रिया शर्मा',
  'tst.2.text': '“एक निवेशक के रूप में मैंने कई फ़र्मों के साथ काम किया है, लेकिन अंश एसोसिएट्स बाज़ार की समझ, पारदर्शिता और रिटर्न बढ़ाने की सच्ची लगन के लिए अलग हैं।”',
  'tst.3.name': 'अमित पटेल',
  'tst.3.text': '“दल ने हर मामले में मेरी अपेक्षाओं को पार किया। पहली बैठक से अंतिम रजिस्ट्री तक, मेरी व्यावसायिक खरीद में उन्होंने विशेषज्ञ मार्गदर्शन दिया।”',

  'ct.eyebrow': 'संपर्क करें',
  'ct.heading': 'संपर्क करें',
  'ct.support': 'अपनी संपूर्ण संपत्ति खोजने के लिए तैयार हैं? हमारा दल विशेषज्ञ मार्गदर्शन और व्यक्तिगत सेवा के साथ आपकी सहायता के लिए उपलब्ध है।',
  'ct.office.alt': 'अंश एसोसिएट्स कार्यालय का आंतरिक दृश्य',

  'ct.phone.t': 'कॉल करें',
  'ct.phone.line': '+91 98765 43210',
  'ct.phone.note': 'सोमवार–शनिवार, सुबह 9 – शाम 7 बजे',
  'ct.location.t': 'हमसे मिलें',
  'ct.location.addr': '123 प्रेस्टीज टॉवर्स,<br>एमजी रोड, बेंगलुरु 560001',
  'ct.location.note': 'केवल पूर्व निर्धारित समय पर',
  'ct.email.t': 'ईमेल करें',
  'ct.email.note': '24 घंटे में उत्तर',
  'ct.whatsapp.t': 'व्हाट्सएप',
  'ct.whatsapp.note': 'तुरंत संपत्ति पूछताछ',
  'ct.directions': 'दिशा-निर्देश पाएँ',
  'ct.wa.btn': 'व्हाट्सएप पर बात करें',
  'ct.google': 'Google पर हमें खोजें',
  'ct.google.line': 'Google पर हमें खोजें · अंश एसोसिएट्स, बेंगलुरु',

  'ct.inq.h': 'संपत्ति पूछताछ',
  'ct.inq.name': 'पूरा नाम',
  'ct.inq.email': 'ईमेल पता',
  'ct.inq.phone': 'फ़ोन नंबर',
  'ct.inq.type': 'संपत्ति प्रकार',
  'ct.inq.budget': 'बजट सीमा',
  'ct.inq.message': 'संदेश (वैकल्पिक)',
  'ct.inq.submit': 'पूछताछ भेजें',

  'ct.ph.name': 'अपना पूरा नाम लिखें',
  'ct.ph.email': 'अपना ईमेल पता लिखें',
  'ct.ph.phone': 'अपना फ़ोन नंबर लिखें',
  'ct.ph.message': 'कोई विशेष आवश्यकता या प्रश्न…',

  'ct.opt.selectType': 'संपत्ति प्रकार चुनें',
  'ct.opt.residential': 'आवासीय',
  'ct.opt.commercial': 'व्यावसायिक',
  'ct.opt.land': 'भूमि / प्लॉट',
  'ct.opt.investment': 'निवेश',
  'ct.opt.selectBudget': 'बजट सीमा चुनें',
  'ct.opt.under-50lac': '₹50 लाख से कम',
  'ct.opt.50lac-1cr': '₹50 लाख – ₹1 करोड़',
  'ct.opt.1cr-2cr': '₹1 करोड़ – ₹2 करोड़',
  'ct.opt.2cr-5cr': '₹2 करोड़ – ₹5 करोड़',
  'ct.opt.above-5cr': '₹5 करोड़ से अधिक',

  'ct.quote': '“आपकी सपनों की संपत्ति बस एक बातचीत दूर है।”',
  'ct.loc.eyebrow': 'हमारा स्थान',
  'ct.loc.city': 'बेंगलुरु',
  'ct.loc.line': 'भारत की सिलिकॉन वैली में प्रीमियम रियल एस्टेट सेवाएँ।',
  'ct.map.open': 'Maps में खोलें',
  'ct.map.alt': 'हमारे एमजी रोड स्थान का शैलीबद्ध नक्शा',

  'toast.sent': 'धन्यवाद — आपकी पूछताछ प्राप्त हो गई है। हमारा दल शीघ्र ही आपसे संपर्क करेगा।',
  'toast.lang': 'भाषा हिन्दी में बदल दी गई',
  'footer.rights': 'सर्वाधिकार सुरक्षित।'
};

export const DICTIONARIES = { en, hi };

export function translate(key, lang = DEFAULT_LANG) {
  const table = DICTIONARIES[lang] || DICTIONARIES[DEFAULT_LANG];
  if (Object.prototype.hasOwnProperty.call(table, key)) return table[key];
  // Fall back to English rather than rendering a raw key to the visitor.
  return DICTIONARIES[DEFAULT_LANG][key] ?? key;
}

// Supports simple "{n}" style interpolation for ratings.
export function format(key, vars = {}, lang = DEFAULT_LANG) {
  return translate(key, lang).replace(/\{(\w+)\}/g, (_, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? vars[name] : `{${name}}`
  );
}

export function storedLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return LANGUAGES.includes(saved) ? saved : null;
  } catch {
    return null; // private mode / storage disabled
  }
}

export function persistLanguage(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* non-fatal */ }
}

// Keys missing from a locale that exist in English — used by the self-check in tests.
export function missingKeys(lang) {
  return Object.keys(en).filter((k) => !Object.prototype.hasOwnProperty.call(DICTIONARIES[lang] || {}, k));
}
