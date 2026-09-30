/* The studio's own public details. Everything here is already printed on genvidpro.com:
   no keys, no personal numbers, the business agent's number only. */

export const WA_AGENT = '972539760820';
export const SITE = 'https://genvidpro.com';
export const BASE44 = 'https://base44.com';
export const BRAND = 'GenVidPro';

/* The three packages, the same three as genvidpro.com/apps. `key` and `line` point at the words
   in ui.js, so a package reads in whichever of the four languages is on screen. */
export const PACKAGES = [
  { id: 'start', price: 2900, key: 'pkgStart', line: 'pkgStartLine' },
  { id: 'business', price: 5900, key: 'pkgBusiness', line: 'pkgBusinessLine' },
  { id: 'pro', price: 9900, from: true, key: 'pkgPro', line: 'pkgProLine' },
];

export const WA_TAG = 'gvpro_app';

/* 2900 -> "₪2,900" */
export function priceText(n) {
  return '₪' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* The whole lead rides in the first WhatsApp line, so the agent never opens cold. */
export function waLink({ opener, businessName, job, colour, pkg, lang }) {
  const tail = [WA_TAG, 'job ' + job, 'colour ' + colour, 'lang ' + lang];
  if (pkg) tail.push('package ' + pkg);
  const lines = [opener + (businessName ? ': ' + businessName : ''), tail.join(' · ')];
  return 'https://wa.me/' + WA_AGENT + '?text=' + encodeURIComponent(lines.join('\n'));
}

/* Israeli numbers as people actually type them: 05x…, +972…, 00972…. */
export function normPhone(raw) {
  let d = String(raw || '').replace(/[^0-9+]/g, '');
  if (d.charAt(0) === '+') d = d.slice(1);
  else if (d.slice(0, 2) === '00') d = d.slice(2);
  else if (d.charAt(0) === '0') d = '972' + d.slice(1);
  return d;
}

export function phoneOk(raw) {
  return /^[1-9][0-9]{7,14}$/.test(normPhone(raw));
}
