/* The walk, not the tests: a browser opens the built app on a computer and on a phone and
   looks at what a visitor would see. Zero-failure output means nothing on its own — the run
   also drops screenshots next to itself, and those are meant to be looked at.

   node tests/check.mjs          against http://127.0.0.1:4173 (npm run preview)
   BASE=http://host node tests/check.mjs
*/
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SHOTS = resolve(HERE, 'shots');
const BASE = process.env.BASE || 'http://127.0.0.1:4173';
const DESKTOP = { width: 1521, height: 900 };
const PHONE = { width: 375, height: 812 };

let failed = 0;
function ok(name, cond, extra) {
  if (cond) { console.log('  ok   ' + name); return true; }
  failed++;
  console.log('  FAIL ' + name + (extra ? '  — ' + extra : ''));
  return false;
}

/* The app id is public (it is the address of the app). Nothing here reaches a real backend:
   every call the SDK makes is answered locally, so the walk never writes a Lead anywhere. */
async function stubBackend(page) {
  await page.route('**/api/**', async (route) => {
    const url = route.request().url();
    if (/lead/i.test(url) && route.request().method() === 'POST') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'stub-lead', status: 'new' }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'stub', public_settings: {} }) });
  });
}

async function newPage(browser, viewport) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await stubBackend(page);
  return page;
}

/* the rail paints a frame per card, and each frame is a whole site — give it a moment */
async function frames(page, min = 1) {
  await page.waitForFunction((m) => document.querySelectorAll('.gv-frame iframe.gv-on').length >= m, min, { timeout: 20000 });
}

function noSideways(page) {
  return page.evaluate(() => {
    const e = document.scrollingElement || document.documentElement;
    return { scrollW: e.scrollWidth, clientW: e.clientWidth };
  });
}

async function run() {
  mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch();

  for (const [label, viewport] of [['desktop', DESKTOP], ['phone', PHONE]]) {
    console.log('\n== ' + label + ' ' + viewport.width + '×' + viewport.height);
    const page = await newPage(browser, viewport);
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await frames(page, 3);

    const box = await noSideways(page);
    ok('no horizontal scroll', box.scrollW <= box.clientW + 1, box.scrollW + ' > ' + box.clientW);

    ok('twelve styles in the rail', (await page.locator('.gv-card').count()) === 12);
    ok('five trades', (await page.locator('.gv-chip').count()) === 5);

    /* the name in the field is the name on every preview, while it is being typed */
    await page.getByTestId('biz-name').fill('Moshe Barber');
    await page.waitForTimeout(1200);
    await frames(page, 1);
    const inFrame = await page.evaluate(() => {
      const f = document.querySelector('.gv-frame iframe');
      return f && f.contentDocument ? f.contentDocument.body.textContent : '';
    });
    ok('typed name is on the preview', /Moshe Barber/.test(inFrame || ''));

    await page.screenshot({ path: SHOTS + '/' + label + '-home.png' });

    /* both doors, and the form behind them */
    await page.getByTestId('want-site').click();
    await page.getByTestId('order-sheet').waitFor();
    await page.getByTestId('f-send').click();
    ok('empty form refuses', await page.getByTestId('e-name').isVisible() && await page.getByTestId('e-wa').isVisible());
    await page.getByTestId('f-name').fill('Moshe');
    await page.getByTestId('f-wa').fill('12');
    await page.getByTestId('f-send').click();
    ok('a bad number is refused', await page.getByTestId('e-wa').isVisible());
    await page.screenshot({ path: SHOTS + '/' + label + '-form.png' });

    await page.getByTestId('f-wa').fill('050-123-4567');
    await page.getByTestId('f-send').click();
    await page.getByTestId('thanks').waitFor({ timeout: 10000 });
    const waHref = await page.getByTestId('wa-continue').getAttribute('href');
    ok('thank you opens the business agent', /wa\.me\/972539760820/.test(waHref || ''), waHref);
    ok('the site tag rides along', /gvpro_site/.test(decodeURIComponent(waHref || '')));
    await page.screenshot({ path: SHOTS + '/' + label + '-thanks.png' });
    await page.keyboard.press('Escape');
    await page.locator('.gv-close').first().click();

    /* the other door carries its own tag and the packages page */
    await page.getByTestId('want-app').click();
    await page.getByTestId('f-name').fill('Moshe');
    await page.getByTestId('f-wa').fill('0501234567');
    await page.getByTestId('f-send').click();
    await page.getByTestId('thanks').waitFor({ timeout: 10000 });
    const appHref = await page.getByTestId('wa-continue').getAttribute('href');
    ok('the app tag rides along', /gvpro_app/.test(decodeURIComponent(appHref || '')));
    ok('the app door links the packages', (await page.getByTestId('apps-link').getAttribute('href')) === 'https://genvidpro.com/apps');
    await page.locator('.gv-close').first().click();

    ok('the Base44 badge is on the page', (await page.getByTestId('base44-badge').getAttribute('href')) === 'https://base44.com');

    await page.context().close();
  }

  /* ----- truly RTL, on the shell and inside the templates */
  for (const lang of ['he', 'ar']) {
    console.log('\n== RTL ' + lang);
    const page = await newPage(browser, PHONE);
    await page.goto(BASE + '/?n=' + encodeURIComponent(lang === 'he' ? 'מספרה' : 'صالون') + '&niche=barber&tpl=neon&lang=' + lang, { waitUntil: 'networkidle' });
    await page.getByTestId('viewer').waitFor();
    await page.waitForTimeout(1500);

    ok('the document turns round', (await page.evaluate(() => document.documentElement.dir)) === 'rtl');
    const frameDir = await page.evaluate(() => {
      const f = document.querySelector('[data-testid="viewer-frame"]');
      if (!f || !f.contentDocument) return null;
      const d = f.contentDocument;
      /* innerText, not textContent: the engine ships inline helper scripts and their source
         is not what a visitor reads */
      return { dir: d.documentElement.dir, lang: d.documentElement.lang, text: (d.body.innerText || '').slice(0, 400) };
    });
    ok('the template turns round too', frameDir && frameDir.dir === 'rtl', JSON.stringify(frameDir && frameDir.dir));
    ok('the template speaks the language', frameDir && frameDir.lang === lang);
    const script = lang === 'he' ? /[֐-׿]/ : /[؀-ۿ]/;
    ok('the template is written in that script, not English', frameDir && script.test(frameDir.text), (frameDir && frameDir.text || '').slice(0, 80));

    const box = await noSideways(page);
    ok('no horizontal scroll', box.scrollW <= box.clientW + 1, box.scrollW + ' > ' + box.clientW);
    await page.screenshot({ path: SHOTS + '/phone-' + lang + '.png' });
    await page.context().close();
  }

  /* ----- a share link restores exactly that view */
  {
    console.log('\n== share link');
    const page = await newPage(browser, PHONE);
    const url = BASE + '/?n=' + encodeURIComponent('Sara Bakery') + '&niche=bakery&tpl=zine&lang=ru';
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.getByTestId('viewer').waitFor();
    await page.waitForTimeout(1200);

    ok('the name comes back', (await page.getByTestId('biz-name').inputValue()) === 'Sara Bakery');
    ok('the trade comes back', (await page.getByTestId('niche-bakery').getAttribute('aria-pressed')) === 'true');
    ok('the language comes back', (await page.evaluate(() => document.documentElement.lang)) === 'ru');
    const shown = await page.evaluate(() => {
      const f = document.querySelector('[data-testid="viewer-frame"]');
      return f && f.contentDocument ? f.contentDocument.body.className : '';
    });
    ok('the style comes back', /\bt-zine\b/.test(shown), shown);

    /* and the address bar still holds the same view, so a reload loses nothing */
    await page.getByTestId('viewer-close').click();
    const back = await page.evaluate(() => location.search);
    ok('the address bar holds the view', /niche=bakery/.test(back) && /tpl=zine/.test(back) && /lang=ru/.test(back), back);
    await page.context().close();
  }

  await browser.close();
  console.log('\n' + (failed ? failed + ' FAILED' : 'all good') + ' — screenshots in tests/shots/');
  process.exit(failed ? 1 : 0);
}

run().catch((e) => { console.error(e); process.exit(1); });
