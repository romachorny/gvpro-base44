/* The walk, not the tests: a browser opens the built app on a laptop and on a phone, in Hebrew
   and in English, and clicks through what a visitor would click. Zero failures means nothing on
   its own — the run also drops screenshots next to itself, and those are meant to be looked at.
   Three defects in v1 passed every assertion and were caught by a picture.

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
const HEB = /[֐-׿]/;

let failed = 0;
function ok(name, cond, extra) {
  if (cond) { console.log('  ok   ' + name); return true; }
  failed++;
  console.log('  FAIL ' + name + (extra ? '  — ' + extra : ''));
  return false;
}

/* Nothing here reaches a real backend: every call the SDK makes is answered locally, so the
   walk never writes a Lead anywhere. */
async function newPage(browser, viewport) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.route('**/api/**', (route) => {
    const url = route.request().url();
    if (/lead/i.test(url) && route.request().method() === 'POST') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'stub-lead', status: 'new' }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'stub', public_settings: {} }) });
  });
  return page;
}

/* The page scrolls up and down, never sideways. Measuring scrollWidth is not enough — in v1 an
   overflow:hidden parent hid a layout that had walked off the right edge — so measure the far
   edge of everything actually on screen. */
function noSideways(page) {
  return page.evaluate(() => {
    const w = document.documentElement.clientWidth;
    let far = 0, near = 0, what = '';
    document.querySelectorAll('.gv, .gv *').forEach((el) => {
      if (!el.getClientRects().length) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.right > far) { far = r.right; what = String(el.className || el.tagName); }
      near = Math.min(near, r.left);
    });
    return { clientW: w, far: Math.ceil(far), near: Math.floor(near), what: what.slice(0, 60) };
  });
}

function accentOf(page) {
  return page.evaluate(() => getComputedStyle(document.querySelector('.gv')).getPropertyValue('--acc').trim());
}

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
    for (const lang of ['he', 'en']) {
      const tag = label + '-' + lang;
      console.log('\n== ' + tag + ' ' + viewport.width + '×' + viewport.height);
      const page = await newPage(browser, viewport);
      await page.goto(BASE + '/?lang=' + lang, { waitUntil: 'networkidle' });

      /* ---- screen one: the name and the one question */
      await page.getByTestId('screen-app').waitFor({ timeout: 20000 });
      await page.getByTestId('back-to-jobs').click();
      await page.getByTestId('screen-pick').waitFor();
      ok('five jobs to choose from', (await page.locator('.gv-jobs .gv-job').count()) === 5);

      const dir = await page.evaluate(() => document.documentElement.dir);
      ok('the document reads the right way', dir === (lang === 'he' ? 'rtl' : 'ltr'), dir);
      if (lang === 'he') ok('and it is written in Hebrew', HEB.test(await page.getByTestId('screen-pick').innerText()));

      await page.getByTestId('biz-name').fill(lang === 'he' ? 'המספרה של משה' : 'Moshe Barber');
      await page.screenshot({ path: SHOTS + '/' + tag + '-1-pick.png' });

      /* ---- screen two: the app itself */
      await page.getByTestId('job-booking').click();
      await page.getByTestId('phone').waitFor();
      await page.waitForTimeout(400);
      ok('the business name is on the app', (await page.getByTestId('phone-name').innerText()).length > 2);
      ok('three tabs at the bottom', (await page.getByTestId('phone-tabs').locator('button').count()) === 3);
      ok('the gift line is under the button', (await page.getByTestId('gift-line').innerText()).length > 10);

      /* no word "site" anywhere a finger lands */
      const buttonWords = await page.evaluate(() => Array.from(document.querySelectorAll('.gv button, .gv a'))
        .map((b) => (b.innerText || '').trim()).filter(Boolean).join(' | ').toLowerCase());
      ok('no button offers a site', !/\bsite\b|\bאתר\b|\bсайт\b/.test(buttonWords), buttonWords.slice(0, 120));

      let box = await noSideways(page);
      ok('nothing sticks out sideways', box.far <= box.clientW + 1 && box.near >= -1, 'right edge ' + box.far + ' of ' + box.clientW + ' — ' + box.what);

      /* ---- the colour really recolours */
      const before = await accentOf(page);
      await page.getByTestId('colour-amber').click();
      await page.waitForTimeout(250);
      const after = await accentOf(page);
      const phoneAcc = await page.evaluate(() => getComputedStyle(document.querySelector('[data-testid="phone"]')).getPropertyValue('--acc').trim());
      ok('a swatch repaints the page', before !== after && after.toUpperCase() === '#B45309', before + ' -> ' + after);
      ok('and the demo inside the phone with it', phoneAcc.toUpperCase() === '#B45309', phoneAcc);
      await page.getByTestId('colour-blue').click();

      /* ---- booking: service, day, slot, confirm */
      await page.getByTestId('demo-booking').waitFor();
      await page.getByTestId('svc-1').click();
      await page.getByTestId('week-strip').waitFor();
      await page.getByTestId('day-1').click();
      await page.getByTestId('slot-13:30').click();
      await page.getByTestId('demo-confirm').click();
      await page.getByTestId('demo-done').waitFor();
      ok('a booking really goes through', (await page.getByTestId('demo-done').innerText()).includes('13:30'));
      await page.screenshot({ path: SHOTS + '/' + tag + '-2-app.png' });

      /* ---- and lands on the owner's screen */
      await page.getByTestId('tab-owner').click();
      await page.getByTestId('demo-owner').waitFor();
      const count = parseInt(await page.getByTestId('owner-count').innerText(), 10);
      ok('the owner sees it', count === 10, String(count));
      ok('and a revenue number', /\d/.test(await page.getByTestId('owner-revenue').innerText()));
      ok('with the booking listed under it', (await page.getByTestId('owner-list').innerText()).includes('13:30'));
      await page.screenshot({ path: SHOTS + '/' + tag + '-3-owner.png' });

      /* ---- the other job: a basket that counts and a checkout */
      await page.getByTestId('back-to-jobs').click();
      await page.getByTestId('job-orders').click();
      await page.getByTestId('demo-orders').waitFor();
      await page.getByTestId('add-0').click();
      await page.getByTestId('add-0').click();
      await page.getByTestId('add-2').click();
      const total = await page.getByTestId('cart-total').innerText();
      ok('the basket adds up', total.replace(/[^\d]/g, '') === String(34 * 2 + 46), total);
      await page.getByTestId('how-delivery').click();
      await page.getByTestId('demo-confirm').click();
      await page.getByTestId('demo-done').waitFor();
      ok('an order really goes through', (await page.getByTestId('demo-done').innerText()).includes('114'));

      /* ---- the shift board is a board you can act on */
      await page.getByTestId('back-to-jobs').click();
      await page.getByTestId('job-team').click();
      await page.getByTestId('demo-team').waitFor();
      await page.getByTestId('shift-1|pm').click();
      ok('an open shift can be taken', (await page.getByTestId('shift-1|pm').getAttribute('class')).includes('gv-yours'));

      /* ---- menu and catalogue open at all */
      await page.getByTestId('back-to-jobs').click();
      await page.getByTestId('job-menu').click();
      await page.getByTestId('demo-menu').waitFor();
      await page.getByTestId('dish-main-0').click();
      ok('a dish tells you about itself', (await page.getByTestId('demo-menu').innerText()).split('\n').length > 8);

      await page.getByTestId('back-to-jobs').click();
      await page.getByTestId('job-catalogue').click();
      await page.getByTestId('demo-catalogue').waitFor();
      ok('a catalogue says what is not in stock', (await page.getByTestId('demo-catalogue').innerText()).length > 20);

      /* ---- the packages, then the form, then the thank you */
      await page.getByTestId('back-to-jobs').click();
      await page.getByTestId('job-booking').click();
      await page.getByTestId('want-app').click();
      await page.getByTestId('packages').waitFor();
      ok('the packages come before the form', (await page.getByTestId('f-name').count()) === 0);
      ok('three of them', (await page.locator('.gv-pkgs .gv-pkg').count()) === 3);
      ok('the prices are the three from the site', (await page.getByTestId('packages').innerText()).replace(/\s/g, '').includes('2,900'));
      ok('whose account it is, said out loud', /Base44/.test(await page.getByTestId('own-line').innerText()));
      await page.screenshot({ path: SHOTS + '/' + tag + '-4-packages.png' });

      await page.getByTestId('pkg-pro').click();
      await page.getByTestId('pkg-go').click();
      await page.getByTestId('f-send').click();
      ok('the empty form refuses', await page.getByTestId('e-name').isVisible() && await page.getByTestId('e-wa').isVisible());
      await page.getByTestId('f-name').fill('Moshe');
      await page.getByTestId('f-wa').fill('12');
      await page.getByTestId('f-send').click();
      ok('a bad number is refused', await page.getByTestId('e-wa').isVisible());
      ok('the chosen package came along', (await page.getByTestId('picked-package').innerText()).includes('9,900'));
      await page.screenshot({ path: SHOTS + '/' + tag + '-5-form.png' });

      const href = await fillAndSend(page, '050-123-4567');
      ok('the thank you opens the business agent', /wa\.me\/972539760820/.test(href), href);
      ok('tagged gvpro_app', /gvpro_app/.test(href));
      ok('with the job, the colour and the package on it', /job booking/.test(href) && /colour blue/.test(href) && /package pro/.test(href), href);
      await page.screenshot({ path: SHOTS + '/' + tag + '-6-thanks.png' });
      await page.getByTestId('sheet-close').click();

      ok('the Base44 badge is on the page', (await page.getByTestId('base44-badge').getAttribute('href')) === 'https://base44.com');

      box = await noSideways(page);
      ok('still nothing sideways at the end', box.far <= box.clientW + 1 && box.near >= -1, box.far + ' of ' + box.clientW + ' — ' + box.what);

      await page.context().close();
    }
  }

  /* ----- a share link restores exactly that view */
  {
    console.log('\n== share link');
    const page = await newPage(browser, PHONE);
    await page.goto(BASE + '/?n=' + encodeURIComponent('מאפיית שרה') + '&job=orders&c=rose&lang=he&tab=owner', { waitUntil: 'networkidle' });
    await page.getByTestId('phone').waitFor({ timeout: 20000 });
    await page.waitForTimeout(400);

    ok('the name comes back', (await page.getByTestId('biz-name').inputValue()) === 'מאפיית שרה');
    ok('the job comes back', (await page.getByTestId('phone-tabs').locator('button').nth(1).getAttribute('aria-pressed')) === 'false');
    ok('the colour comes back', (await accentOf(page)).toUpperCase() === '#BE123C');
    ok('the language comes back', (await page.evaluate(() => document.documentElement.lang)) === 'he');
    ok('the open tab comes back', (await page.getByTestId('tab-owner').getAttribute('aria-pressed')) === 'true');
    ok('and the owner screen is really the one showing', await page.getByTestId('demo-owner').isVisible());

    const back = await page.evaluate(() => location.search);
    ok('the address bar holds the view', /job=orders/.test(back) && /c=rose/.test(back) && /tab=owner/.test(back), back);
    await page.screenshot({ path: SHOTS + '/phone-share.png' });
    await page.context().close();
  }

  await browser.close();
  console.log('\n' + (failed ? failed + ' FAILED' : 'all good') + ' — screenshots in tests/shots/');
  process.exit(failed ? 1 : 0);
}

run().catch((e) => { console.error(e); process.exit(1); });
