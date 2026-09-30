/* The share link is the whole view, and there is no database behind it.
   https://gvpro.base44.app/?n=<name>&job=<job>&c=<colour>&lang=<lang>&tab=<tab>
   Opening it puts the visitor on exactly what the sender was looking at, down to which tab of
   the demo was open. Nothing to store, nothing to rate-limit, nothing to expire. */

import { JOBS } from './jobs.js';
import { COLOURS, DEFAULT_COLOUR } from './theme.js';
import { LANGS } from './ui.js';

export const TABS = ['home', 'job', 'owner'];
export const DEFAULTS = { name: '', job: 'booking', colour: DEFAULT_COLOUR, lang: 'he', tab: 'job' };
const MAX_NAME = 60;
const COLOUR_IDS = COLOURS.map((c) => c.id);

function pick(value, allowed, fallback) {
  const v = String(value || '').trim();
  return allowed.indexOf(v) >= 0 ? v : fallback;
}

/* Hebrew unless the browser clearly says otherwise: the customer is in Israel. */
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
  const shared = ['n', 'job', 'c', 'lang', 'tab'].some((k) => q.has(k));
  return {
    shared,
    name: String(q.get('n') || '').slice(0, MAX_NAME),
    job: pick(q.get('job'), JOBS, DEFAULTS.job),
    colour: pick(q.get('c'), COLOUR_IDS, DEFAULTS.colour),
    lang: pick(q.get('lang'), LANGS, ''),
    tab: pick(q.get('tab'), TABS, DEFAULTS.tab),
  };
}

export function shareLink({ name, job, colour, lang, tab }, origin) {
  const base = (origin || window.location.origin) + '/';
  const q = new URLSearchParams();
  if (name) q.set('n', String(name).slice(0, MAX_NAME));
  q.set('job', job);
  q.set('c', colour);
  q.set('lang', lang);
  q.set('tab', tab || DEFAULTS.tab);
  return base + '?' + q.toString();
}

/* The address bar holds the view too, so a reload and a copied URL never disagree. */
export function syncAddressBar(state) {
  try {
    window.history.replaceState(window.history.state, '', shareLink(state));
  } catch (e) { /* a sandboxed frame may refuse; the view is unaffected */ }
}
