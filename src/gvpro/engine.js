/* The one door between React and the ported engine.
   Nothing else in the app touches window.GVP: if the engine is re-ported from
   app.genvidpro.com, this file is the only place that has to still agree with it. */

import './config.js';      /* must be evaluated before the engine — see config.js */
import './tpl-engine.js';

const G = window.GVP;

/* The rail order of the twelve, copied from the old app: a green terminal, a violet neon and
   the signboard first, the light ones last. Three per page, four pages. */
export const ORDER = ['neon', 'mono', 'pole', 'kiosk', 'gold', 'bands', 'fade', 'grid', 'poster', 'zine', 'mag', 'salon'];
export const PER_PAGE = 3;
export const NICHES = G.CATS.map(([id]) => id);           /* barber clinic bakery yoga garage */
export const STYLES = G.TPL.map((t) => t.id);             /* twelve */
export const LANGS = ['en', 'he', 'ru', 'ar'];
export const RTL_LANGS = ['he', 'ar'];

export function isRTL(lang) { return RTL_LANGS.indexOf(lang) >= 0; }
export function dirOf(lang) { return isRTL(lang) ? 'rtl' : 'ltr'; }

/* ------------------------------------------------------------------ language packs */
/* The templates' own copy in Hebrew, Russian and Arabic is one generated file per language.
   Nothing may be painted before the pack is in: the engine falls back to English words while
   keeping dir=rtl, and an Arabic frame full of English sentences was the old app's RTL bug. */
const loaders = {
  he: () => import('./lang/he.js'),
  ru: () => import('./lang/ru.js'),
  ar: () => import('./lang/ar.js'),
};
const pending = {};
/* A pack arrives after the first paint, and whatever read the old one has to be told.
   Without this, an iframe repainted in Hebrew while the React text beside it — the price list
   in the demo, the tab's own word, the style's name — stayed in English, because a useMemo
   keyed on the language had nothing to recompute against. That is the RTL bug in a new place,
   and this is the one signal that closes it everywhere at once. */
const listeners = new Set();

export function onLangPack(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function langReady(lang) {
  return lang === 'en' || !!(window.GVP_LANG && window.GVP_LANG[lang]);
}

export function ensureLang(lang) {
  if (langReady(lang)) return Promise.resolve();
  if (!loaders[lang]) return Promise.resolve();
  if (!pending[lang]) {
    pending[lang] = loaders[lang]()
      .catch(() => {})
      .then(() => { listeners.forEach((fn) => fn(lang)); });
  }
  return pending[lang];
}

/* ------------------------------------------------------------------ names */
export function styleName(id, lang) {
  const pack = window.GVP_LANG && window.GVP_LANG[lang];
  if (pack && pack.tpl && pack.tpl[id]) return pack.tpl[id];
  const t = G.TPL.find((x) => x.id === id);
  return (t && t.n) || id;
}

/* What a niche calls itself, and the example name shown before anything is typed. */
export function nicheCopy(niche, lang) { return G.text(niche, lang); }

/* ------------------------------------------------------------------ pages */
/* full=false is the small tile in the rail (lite: no toy, no clips); full=true is the viewer. */
export function stateFor({ name, niche, style, lang, full }) {
  const K = G.text(niche, lang);
  return G.dress({
    cat: niche,
    lang,
    name: name || K.name,
    tag: K.tag,
    city: K.city,
    wa: '',
    toy: !!full,
    logo: 'tone',
  }, style);
}

export function renderPage({ name, niche, style, lang, full }) {
  return G.page(style, stateFor({ name, niche, style, lang, full }), !full);
}

/* ------------------------------------------------------------------ plain text */
/* The engine's copy is written for innerHTML: &#8362; for the shekel, &ndash;, <br>.
   React prints text, not markup, so anything of the engine's that reaches a React node has
   to come through here first — otherwise the price of a haircut reads "&#8362;70".
   The input is always our own constant strings; a textarea's innerHTML decodes entities and
   runs nothing. */
const decoder = typeof document !== 'undefined' ? document.createElement('textarea') : null;

export function plain(s) {
  const src = String(s == null ? '' : s);
  if (!decoder) return src;
  decoder.innerHTML = src.replace(/<br\s*\/?>/gi, ' · ').replace(/<[^>]*>/g, '');
  return decoder.value.replace(/\s+/g, ' ').trim();
}

/* "₪70" -> 70, for a demo basket's total. Anything without a number counts as nothing. */
export function priceNumber(s) {
  const m = plain(s).replace(/[^\d.]/g, '');
  const n = parseFloat(m);
  return isNaN(n) ? 0 : n;
}
