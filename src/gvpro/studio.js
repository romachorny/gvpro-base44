/* The studio's own public details. Everything here is already printed on genvidpro.com;
   nothing private, no keys, no personal number — the business agent's number only. */

export const WA_AGENT = '972539760820';
export const SITE = 'https://genvidpro.com';
export const APPS_PAGE = 'https://genvidpro.com/apps';
export const BASE44 = 'https://base44.com';
export const BRAND = 'GenVidPro';
/* Rule from the brief: every poster image the app ever renders carries this handle.
   v1 renders no poster, so the handle lives in the footer and in the share text; the constant
   is here so the first poster has nowhere else to look. */
export const WATERMARK = '@GenVidPro';

/* The three packages, the same three as genvidpro.com/apps. `key`/`line` point at the words
   in src/gvpro/ui.js, so a package reads in whichever of the four languages is on screen. */
export const APP_TIERS = [
  { id: 'start', price: 2900, key: 'pkgStart', line: 'pkgStartLine' },
  { id: 'business', price: 5900, key: 'pkgBusiness', line: 'pkgBusinessLine' },
  { id: 'pro', price: 9900, from: true, key: 'pkgPro', line: 'pkgProLine' },
];

/* 2900 -> "2,900". The shekel sign goes in front in every language the app speaks. */
export function priceText(n) {
  return '\u20AA' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* Which of the two an app for this trade is really about. A bakery takes orders; everyone
   else takes bookings. The tab's own word comes from the engine (K.bookShort), already
   translated and already niche-correct — this only decides which of our own lines to use. */
const ORDERING = ['bakery'];
export function isOrdering(niche) { return ORDERING.indexOf(niche) >= 0; }

/* The tag the agent reads to know which of the two buttons was pressed. */
export function waTag(want) { return want === 'app' ? 'gvpro_app' : 'gvpro_site'; }

/* wa.me carries the whole lead in the first line, so the agent opens on the right foot
   even when the visitor never says anything else. */
export function waLink({ want, opener, businessName, niche, style, lang, pkg }) {
  const tail = [waTag(want), 'niche ' + niche, 'style ' + style, 'lang ' + lang];
  if (want === 'app' && pkg) tail.push('package ' + pkg);
  const lines = [opener + (businessName ? ': ' + businessName : ''), tail.join(' · ')];
  return 'https://wa.me/' + WA_AGENT + '?text=' + encodeURIComponent(lines.join('\n'));
}

/* Israeli numbers as people actually type them: 05x…, 5x…, +972…, 00972…. */
export function normPhone(raw) {
  let d = String(raw || '').replace(/[^0-9+]/g, '');
  if (d.charAt(0) === '+') d = d.slice(1);
  else if (d.slice(0, 2) === '00') d = d.slice(2);
  else if (d.charAt(0) === '0') d = '972' + d.slice(1);
  return d;
}

export function phoneOk(raw) {
  const d = normPhone(raw);
  return /^[1-9][0-9]{7,14}$/.test(d);
}
