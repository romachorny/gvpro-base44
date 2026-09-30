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

/* Nothing here reaches a real backend: every call the SDK makes is answered locally, so the
   walk never writes a Lead anywhere. */
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

/* The home screen hides its own overflow, so scrollWidth can never exceed clientWidth and a
   check on it says "fine" about a layout that has walked off the right-hand edge. It did
   exactly that — the phone pushed the rail's column wider than the screen and took the whole
   page with it — and only a screenshot caught it. So measure real edges instead.

   The rail is a horizontal scroller on purpose: eleven pages legitimately sit off to the right.
   Those are skipped, and the page that IS on screen is checked against the viewport instead. */
function noSideways(page) {
  return page.evaluate(() => {
    const pv = document.querySelector('.gv-pv');
    const w = document.documentElement.clientWidth;
    let far = 0, near = 0, what = '';
    document.querySelectorAll('.gv-home, .gv-home *').forEach((el) => {
      if (pv && pv.contains(el) && el !== pv) return;          /* inside the rail: it scrolls */
      if (!el.getClientRects().length) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.right > far) { far = r.right; what = el.className || el.tagName; }
      near = Math.min(near, r.left);
    });
    /* the page the visitor is looking at has to fit too */
    const live = document.querySelector('[data-active="true"]');
    if (live) {
      const r = live.getBoundingClientRect();
      if (r.right > far) { far = r.right; what = 'the page on screen'; }
      near = Math.min(near, r.left);
      live.querySelectorAll('*').forEach((el) => {
        if (!el.getClientRects().length) return;
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) return;
        if (b.right > far) { far = b.right; what = el.className || el.tagName; }
        near = Math.min(near, b.left);
      });
    }
    return { clientW: w, far: Math.ceil(far), near: Math.floor(near), what: String(what).slice(0, 60) };
  });
}

/* Only the phone in front of the visitor is alive, and its two neighbours are mounted beside
   it off screen. Every question about "the app" means the one on screen, so ask that one. */
function live(page) { return page.locator('.gv-phone-slot[data-active="true"]'); }
function liveFrame(page) {
  return page.evaluate(() => {
    const slot = document.querySelector('.gv-phone-slot[data-active="true"]');
    const f = slot && slot.querySelector('iframe');
    if (!f || !f.contentDocument) return null;
    const d = f.contentDocument;
    return { dir: d.documentElement.dir, lang: d.documentElement.lang, cls: d.body.className, text: (d.body.innerText || '').slice(0, 400) };
  });
}

/* fill the order form and send it */
async function fillAndSend(page, wa) {
  await page.getByTestId('f-name').fill('Moshe');
  await page.getByTestId('f-wa').fill(wa);
  await page.getByTestId('f-send').click();
  await page.getByTestId('thanks').waitFor({ timeout: 10000 });
  return decodeURIComponent(await page.getByTestId('wa-continue').getAttribute('href') || '');
}

async function run() {
  mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch();

  for (const [label, viewport] of [['desktop', DESKTOP], ['phone', PHONE]]) {
    console.log('\n== ' + label + ' ' + viewport.width + '×' + viewport.height);
    const page = await newPage(browser, viewport);
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });

    /* ---- the app is what opens, not the site */
    await live(page).getByTestId('app-phone').waitFor({ timeout: 20000 });
    ok('the app is the view you land on', (await page.getByTestId('mode-app').getAttribute('aria-pressed')) === 'true');
    ok('the red button is the app one', (await page.getByTestId('want-app').getAttribute('class') || '').includes('gv-primary'));
    ok('the site is the quiet button under it', (await page.getByTestId('want-site').getAttribute('class') || '').includes('gv-white'));
    ok('twelve phones to swipe through', (await page.locator('.gv-phone-slot').count()) === 12);

    await page.waitForFunction(() => {
      const slot = document.querySelector('.gv-phone-slot[data-active="true"]');
      const f = slot && slot.querySelector('iframe');
      return f && f.contentDocument && f.contentDocument.body && f.contentDocument.body.children.length > 2;
    }, null, { timeout: 20000 });

    const box = await noSideways(page);
    ok('nothing sticks out sideways', box.far <= box.clientW + 1 && box.near >= -1, 'right edge ' + box.far + ' of ' + box.clientW + ', left ' + box.near + ' — ' + box.what);
    ok('four tabs along the bottom', (await live(page).getByTestId('app-tabs').locator('button').count()) === 4);
    /* isVisible() is true for an element lying under an iframe, and that is exactly what
       happened once. Ask what is actually on top at the chip's own centre. */
    const chipOnTop = await page.evaluate(() => {
      const slot = document.querySelector('.gv-phone-slot[data-active="true"]');
      const chip = slot && slot.querySelector('[data-testid="install-chip"]');
      if (!chip) return false;
      const r = chip.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !!hit && (hit === chip || chip.contains(hit));
    });
    ok('the install chip is the thing you can actually see and press', chipOnTop);

    await page.getByTestId('biz-name').fill('Moshe Barber');
    await page.waitForTimeout(1400);
    const inPhone = await liveFrame(page);
    ok('the typed name is on the app', !!inPhone && /Moshe Barber/.test(inPhone.text));
    await page.screenshot({ path: SHOTS + '/' + label + '-app.png' });

    /* ---- the demo really books */
    await live(page).getByTestId('tab-do').click();
    await live(page).getByTestId('demo-sheet').waitFor();
    await live(page).getByTestId('demo-item-1').click();
    await live(page).getByTestId('demo-slot-12:00').click();
    await live(page).getByTestId('demo-confirm').click();
    await live(page).getByTestId('demo-mine').waitFor();
    ok('the demo booking lands in "my bookings"', (await live(page).getByTestId('demo-mine').innerText()).includes('12:00'));
    await page.screenshot({ path: SHOTS + '/' + label + '-demo.png' });
    await live(page).getByTestId('tab-home').click();

    /* ---- the other kind of trade orders instead of booking */
    await page.getByTestId('niche-bakery').click();
    await page.waitForTimeout(900);
    await live(page).getByTestId('tab-do').click();
    await live(page).getByTestId('demo-item-0').click();
    await live(page).getByTestId('demo-item-0').click();
    const total = await live(page).locator('.gv-ap-total').innerText();
    ok('a bakery counts a basket instead of slots', /[1-9]/.test(total.replace(/[^\d]/g, '')), total);
    ok('a bakery has no time slots', (await live(page).locator('.gv-ap-slots').count()) === 0);
    await live(page).getByTestId('demo-confirm').click();
    await live(page).getByTestId('demo-mine').waitFor();
    ok('the demo order lands in "my orders"', (await live(page).getByTestId('demo-mine').innerText()).length > 0);
    await page.getByTestId('niche-barber').click();
    await page.waitForTimeout(600);

    /* ---- the site side still works */
    await page.getByTestId('mode-site').click();
    await page.waitForTimeout(1200);
    ok('twelve styles in site mode', (await page.locator('.gv-card').count()) === 12);
    ok('four pages of three', (await page.getByTestId('rail-dots').locator('i').count()) === 4);
    const boxSite = await noSideways(page);
    ok('nothing sticks out sideways in site mode', boxSite.far <= boxSite.clientW + 1 && boxSite.near >= -1, 'right edge ' + boxSite.far + ' of ' + boxSite.clientW + ' — ' + boxSite.what);
    await page.screenshot({ path: SHOTS + '/' + label + '-site.png' });
    await page.getByTestId('mode-app').click();
    await page.waitForTimeout(600);

    /* ---- "I want an app" says what it is before it asks for anything */
    await page.getByTestId('want-app').click();
    await page.getByTestId('app-pitch').waitFor();
    ok('the app screen comes before the form', (await page.getByTestId('f-name').count()) === 0);
    ok('three packages', (await page.locator('.gv-pkg button').count()) === 3);
    ok('the prices are the three from the site', (await page.getByTestId('app-pitch').innerText()).replace(/\s/g, '').includes('2,900'));
    ok('whose account it is, said out loud', /Base44/.test(await page.getByTestId('pitch-own').innerText()));
    await page.screenshot({ path: SHOTS + '/' + label + '-pitch.png' });

    await page.getByTestId('pkg-pro').click();
    await page.getByTestId('pitch-go').click();
    await page.getByTestId('f-send').click();
    ok('the empty form refuses', await page.getByTestId('e-name').isVisible() && await page.getByTestId('e-wa').isVisible());
    await page.getByTestId('f-wa').fill('12');
    await page.getByTestId('f-name').fill('Moshe');
    await page.getByTestId('f-send').click();
    ok('a bad number is refused', await page.getByTestId('e-wa').isVisible());
    ok('the chosen package is carried into the form', (await page.getByTestId('picked-package').innerText()).includes('9,900'));
    await page.screenshot({ path: SHOTS + '/' + label + '-form.png' });

    const appHref = await fillAndSend(page, '050-123-4567');
    ok('the thank you opens the business agent', /wa\.me\/972539760820/.test(appHref), appHref);
    ok('the app tag rides along', /gvpro_app/.test(appHref));
    ok('so does the package', /package pro/.test(appHref), appHref);
    ok('the app door links the packages page', (await page.getByTestId('apps-link').getAttribute('href')) === 'https://genvidpro.com/apps');
    await page.screenshot({ path: SHOTS + '/' + label + '-thanks.png' });
    await page.locator('.gv-close').first().click();

    /* ---- the site door has nothing to pitch and goes straight to the form */
    await page.getByTestId('want-site').click();
    await page.getByTestId('order-sheet').waitFor();
    ok('the site door opens straight onto the form', (await page.getByTestId('app-pitch').count()) === 0);
    const siteHref = await fillAndSend(page, '0501234567');
    ok('the site tag rides along', /gvpro_site/.test(siteHref));
    ok('no package on a site lead', !/package /.test(siteHref), siteHref);
    await page.locator('.gv-close').first().click();

    ok('the Base44 badge is on the page', (await page.getByTestId('base44-badge').getAttribute('href')) === 'https://base44.com');

    await page.context().close();
  }

  /* ----- truly RTL, on the shell, in the app layer and inside the templates */
  for (const lang of ['he', 'ar']) {
    console.log('\n== RTL ' + lang);
    const page = await newPage(browser, PHONE);
    await page.goto(BASE + '/?n=' + encodeURIComponent(lang === 'he' ? 'מספרה' : 'صالون') + '&niche=barber&tpl=neon&lang=' + lang + '&mode=app', { waitUntil: 'networkidle' });
    await live(page).getByTestId('app-phone').waitFor({ timeout: 20000 });
    await page.waitForTimeout(1800);

    ok('the document turns round', (await page.evaluate(() => document.documentElement.dir)) === 'rtl');
    /* innerText, not textContent: the engine ships inline helper scripts and their source
       is not what a visitor reads */
    const frameDir = await liveFrame(page);
    ok('the template turns round too', frameDir && frameDir.dir === 'rtl', JSON.stringify(frameDir && frameDir.dir));
    ok('the template speaks the language', frameDir && frameDir.lang === lang);
    const script = lang === 'he' ? /[֐-׿]/ : /[؀-ۿ]/;
    ok('the template is written in that script, not English', frameDir && script.test(frameDir.text), (frameDir && frameDir.text || '').slice(0, 80));
    ok('so is the app layer over it', script.test(await live(page).getByTestId('app-tabs').innerText()));

    await live(page).getByTestId('tab-do').click();
    await live(page).getByTestId('demo-sheet').waitFor();
    ok('and so is the booking sheet', script.test(await live(page).getByTestId('demo-sheet').innerText()));
    /* Not the sheet as a whole: our own heading is Hebrew whatever happens, and it hid a price
       list still written in English because the pack landed after the first render. Ask the
       rows and the tab, which are the engine's own words. */
    ok('the price list speaks it too', script.test(await live(page).locator('.gv-ap-nm').first().innerText()),
      await live(page).locator('.gv-ap-nm').first().innerText());
    ok('and the tab that opens it', script.test(await live(page).getByTestId('tab-do').innerText()),
      await live(page).getByTestId('tab-do').innerText());
    ok('and the name of the style under the rail', script.test(await page.locator('.gv-swipe span').innerText()),
      await page.locator('.gv-swipe span').innerText());

    const box = await noSideways(page);
    ok('nothing sticks out sideways', box.far <= box.clientW + 1 && box.near >= -1, 'right edge ' + box.far + ' of ' + box.clientW + ', left ' + box.near + ' — ' + box.what);
    await page.screenshot({ path: SHOTS + '/phone-' + lang + '.png' });

    await live(page).getByTestId('tab-home').click();
    await page.getByTestId('want-app').click();
    await page.getByTestId('app-pitch').waitFor();
    ok('and the app screen', script.test(await page.getByTestId('app-pitch').innerText()));
    if (lang === 'he') await page.screenshot({ path: SHOTS + '/phone-he-pitch.png' });
    await page.context().close();
  }

  /* ----- a share link restores exactly that view, app side and site side */
  {
    console.log('\n== share link');
    const page = await newPage(browser, PHONE);
    await page.goto(BASE + '/?n=' + encodeURIComponent('Sara Bakery') + '&niche=bakery&tpl=zine&lang=ru&mode=app', { waitUntil: 'networkidle' });
    await live(page).getByTestId('app-phone').waitFor({ timeout: 20000 });
    await page.waitForTimeout(1500);

    ok('the name comes back', (await page.getByTestId('biz-name').inputValue()) === 'Sara Bakery');
    ok('the trade comes back', (await page.getByTestId('niche-bakery').getAttribute('aria-pressed')) === 'true');
    ok('the language comes back', (await page.evaluate(() => document.documentElement.lang)) === 'ru');
    ok('the app mode comes back', (await page.getByTestId('mode-app').getAttribute('aria-pressed')) === 'true');
    const shown = await liveFrame(page);
    ok('the style comes back', !!shown && /\bt-zine\b/.test(shown.cls), shown && shown.cls);
    const back = await page.evaluate(() => location.search);
    ok('the address bar holds the view', /niche=bakery/.test(back) && /tpl=zine/.test(back) && /lang=ru/.test(back) && /mode=app/.test(back), back);
    await page.context().close();

    const page2 = await newPage(browser, PHONE);
    await page2.goto(BASE + '/?n=Sara&niche=bakery&tpl=zine&lang=en&mode=site', { waitUntil: 'networkidle' });
    await page2.getByTestId('viewer').waitFor({ timeout: 20000 });
    ok('a site link opens the style at full size', (await page2.getByTestId('mode-site').getAttribute('aria-pressed')) === 'true');
    await page2.context().close();
  }

  await browser.close();
  console.log('\n' + (failed ? failed + ' FAILED' : 'all good') + ' — screenshots in tests/shots/');
  process.exit(failed ? 1 : 0);
}

run().catch((e) => { console.error(e); process.exit(1); });
