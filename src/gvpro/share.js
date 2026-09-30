/* The share link is the whole state, and there is no database behind it.
   https://gvpro.base44.app/?n=<name>&niche=<niche>&tpl=<style>&lang=<lang>
   Opening that link puts the visitor on exactly the view the sender was looking at.
   The old app had to POST the state to /api/save and hand out a short code; four query
   parameters do the same job with nothing to store and nothing to rate-limit. */

import { NICHES, STYLES, LANGS, ORDER } from './engine.js';

export const DEFAULTS = { name: '', niche: 'barber', style: ORDER[0], lang: 'en' };
const MAX_NAME = 60;

function pick(value, allowed, fallback) {
  const v = String(value || '').trim();
  return allowed.indexOf(v) >= 0 ? v : fallback;
}

/* The browser's own language, the way the old app guessed it: Hebrew is the house default. */
export function guessLang() {
  const list = (navigator.languages && navigator.languages.length)
    ? navigator.languages
    : [navigator.language || ''];
  for (let i = 0; i < list.length; i++) {
    const l = String(list[i] || '').toLowerCase();
    if (/^(he|iw)\b/.test(l)) return 'he';
    if (/^ar\b/.test(l)) return 'ar';
    if (/^ru\b/.test(l)) return 'ru';
    if (/^en\b/.test(l)) return 'en';
  }
  return 'he';
}

export function readShare(search) {
  const q = new URLSearchParams(search == null ? window.location.search : search);
  const shared = q.has('n') || q.has('niche') || q.has('tpl') || q.has('lang');
  return {
    shared,
    name: String(q.get('n') || '').slice(0, MAX_NAME),
    niche: pick(q.get('niche'), NICHES, DEFAULTS.niche),
    style: pick(q.get('tpl'), STYLES, DEFAULTS.style),
    lang: pick(q.get('lang'), LANGS, ''),
  };
}

export function shareLink({ name, niche, style, lang }, origin) {
  const base = (origin || window.location.origin) + '/';
  const q = new URLSearchParams();
  if (name) q.set('n', String(name).slice(0, MAX_NAME));
  q.set('niche', niche);
  q.set('tpl', style);
  q.set('lang', lang);
  return base + '?' + q.toString();
}

/* Same shape in the address bar as in the link, so a reload never loses the view. */
export function syncAddressBar(state) {
  try {
    window.history.replaceState(window.history.state, '', shareLink(state));
  } catch (e) { /* a sandboxed frame may refuse; the view is unaffected */ }
}
