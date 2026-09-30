import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ensureLang, nicheCopy, plain, priceNumber, renderPage, styleName } from '@/gvpro/engine';
import { tr } from '@/gvpro/ui';
import { isOrdering } from '@/gvpro/studio';
import { useLangPack } from '@/gvpro/useLangPack';

/* The app, as an app. The chosen template sits inside a phone, and the app layer sits on top
   of it: the tab bar along the bottom, a booking or order sheet that really works, and the
   install chip. Everything here is a demo and says so — nothing is booked, nothing is sent,
   nothing leaves the browser. It is what the "I want an app" button is selling, shown rather
   than described. */

const TIMES = ['09:00', '10:30', '12:00', '14:30', '16:00', '17:30'];
/* A couple of slots are taken, because an appointment book with nothing in it looks broken. */
const TAKEN = { '0|10:30': 1, '1|14:30': 1 };

function Pill({ on, children, ...rest }) {
  return <button type="button" className={'gv-ap-pill' + (on ? ' gv-on' : '')} {...rest}>{children}</button>;
}

export default function AppPhone({ name, niche, style, lang, onInstall }) {
  const [tab, setTab] = useState('home');
  const [html, setHtml] = useState('');
  const [service, setService] = useState(null);   /* index into the price list */
  const [day, setDay] = useState(0);
  const [time, setTime] = useState('');
  const [basket, setBasket] = useState({});       /* index -> how many */
  const [mine, setMine] = useState([]);
  const screen = useRef(null);
  const box = useRef(null);

  const t = (k) => tr(lang, k);
  const ordering = isOrdering(niche);
  const ready = useLangPack(lang);
  const K = useMemo(() => nicheCopy(niche, lang), [niche, lang, ready]);
  const services = (K.services || []).map((r) => ({ name: plain(r[0]), price: plain(r[1]), dur: plain(r[2]), line: plain(r[3]) }));
  const actionWord = plain(K.bookShort || (ordering ? t('demoOrderBtn') : t('demoConfirm')));

  useEffect(() => {
    let live = true;
    setHtml('');
    ensureLang(lang).then(() => { if (live) setHtml(renderPage({ name, niche, style, lang, full: true })); });
    return () => { live = false; };
  }, [name, niche, style, lang]);

  /* A change of trade throws the demo basket away: four croissants make no sense in a garage. */
  useEffect(() => { setTab('home'); setService(null); setTime(''); setBasket({}); setMine([]); }, [niche]);

  /* A phone has to fit the room in BOTH directions. aspect-ratio alone cannot do that: given a
     height it computes a width, and a max-width then clamps the width without giving the height
     back, so the phone either squashes or — worse — pushes the rail's column wider than the
     screen. That is what it did, and because the home screen hides its own overflow, nothing
     scrolled sideways to show it: the layout just walked off the right edge. Measured, it is
     four lines and always right. */
  useLayoutEffect(() => {
    const outer = box.current;
    if (!outer) return undefined;
    const fit = () => {
      const w = outer.clientWidth, h = outer.clientHeight;
      if (!w || !h) return;
      const width = Math.min(w, h * 9 / 19);
      const body = outer.firstElementChild;
      if (!body) return;
      body.style.width = Math.floor(width) + 'px';
      body.style.height = Math.floor(width * 19 / 9) + 'px';
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(outer);
    return () => ro.disconnect();
  }, []);

  /* The template is drawn at a phone's own 390 px and scaled into whatever the phone got. */
  useLayoutEffect(() => {
    const el = screen.current;
    if (!el) return undefined;
    const fit = () => {
      const f = el.querySelector('iframe');
      if (!f) return;
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      const k = w / 390;
      f.style.width = '390px';
      f.style.height = Math.ceil(h / k) + 'px';
      f.style.transform = 'scale(' + k + ')';
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [html, tab]);

  const total = Object.keys(basket).reduce((sum, i) => sum + priceNumber(services[i] ? services[i].price : 0) * basket[i], 0);
  const basketCount = Object.keys(basket).reduce((n, i) => n + basket[i], 0);

  function book() {
    if (!service && service !== 0) return;
    if (!time) return;
    setMine([{ what: services[service].name, when: t(day ? 'demoTomorrow' : 'demoToday') + ' · ' + time, price: services[service].price }, ...mine]);
    setService(null); setTime('');
    setTab('mine');
  }

  function order() {
    const rows = Object.keys(basket).filter((i) => basket[i] > 0)
      .map((i) => ({ what: services[i].name + ' × ' + basket[i], when: t('demoTomorrow'), price: services[i].price }));
    if (!rows.length) return;
    setMine([...rows, ...mine]);
    setBasket({});
    setTab('mine');
  }

  const TABS = [
    { id: 'home', label: t('tabHome') },
    { id: 'do', label: actionWord },
    { id: 'mine', label: ordering ? t('tabMineOrders') : t('tabMine') },
    { id: 'contact', label: t('tabContact') },
  ];

  return (
    <div className="gv-phone" data-testid="app-phone" ref={box}>
      <div className="gv-phone-body">
        <span className="gv-phone-notch" aria-hidden="true" />
        <div className="gv-phone-screen">

          {/* The template lives in row 1 of the screen and nowhere else. It used to be absolute
              inside the whole screen, which quietly put it over the install chip — Playwright
              still called the chip visible, because a covered element is visible to a locator
              and invisible to a person. */}
          {tab === 'home' ? (
            <div className="gv-phone-home" ref={screen}>
              {html ? <iframe title={styleName(style, lang)} srcDoc={html} className="gv-phone-frame" data-testid="phone-frame" /> : null}
            </div>
          ) : null}

          {tab === 'do' ? (
            <div className="gv-ap-view" data-testid="demo-sheet">
              <p className="gv-ap-h">{t('demoPick')}</p>
              <ul className="gv-ap-list">
                {services.map((s, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      className={'gv-ap-row' + (!ordering && service === i ? ' gv-on' : '')}
                      data-testid={'demo-item-' + i}
                      onClick={() => (ordering
                        ? setBasket({ ...basket, [i]: (basket[i] || 0) + 1 })
                        : setService(i))}
                    >
                      <span className="gv-ap-nm">{s.name}<em>{ordering ? s.line : s.dur}</em></span>
                      <b>{s.price}</b>
                      {ordering && basket[i] ? <i className="gv-ap-count">{basket[i]}</i> : null}
                    </button>
                  </li>
                ))}
              </ul>

              {!ordering && service !== null ? (
                <>
                  <p className="gv-ap-h">{t('demoWhen')}</p>
                  <div className="gv-ap-pills">
                    <Pill on={day === 0} onClick={() => { setDay(0); setTime(''); }}>{t('demoToday')}</Pill>
                    <Pill on={day === 1} onClick={() => { setDay(1); setTime(''); }}>{t('demoTomorrow')}</Pill>
                  </div>
                  <div className="gv-ap-slots">
                    {TIMES.map((x) => {
                      const gone = TAKEN[day + '|' + x];
                      return (
                        <Pill
                          key={x}
                          on={time === x}
                          disabled={!!gone}
                          data-testid={'demo-slot-' + x}
                          onClick={() => setTime(x)}
                        >{x}</Pill>
                      );
                    })}
                  </div>
                  <button type="button" className="gv-btn gv-primary gv-ap-go" disabled={!time} data-testid="demo-confirm" onClick={book}>
                    {t('demoConfirm')}
                  </button>
                </>
              ) : null}

              {ordering ? (
                <>
                  <div className="gv-ap-total"><span>{t('demoTotal')}</span><b>{'₪' + total}</b></div>
                  <button type="button" className="gv-btn gv-primary gv-ap-go" disabled={!basketCount} data-testid="demo-confirm" onClick={order}>
                    {t('demoOrderBtn')}
                  </button>
                </>
              ) : null}

              <p className="gv-ap-note">{t('demoNote')}</p>
            </div>
          ) : null}

          {tab === 'mine' ? (
            <div className="gv-ap-view" data-testid="demo-mine">
              <p className="gv-ap-h">{ordering ? t('tabMineOrders') : t('tabMine')}</p>
              {mine.length ? (
                <ul className="gv-ap-list">
                  {mine.map((m, i) => (
                    <li key={i}>
                      <div className="gv-ap-row">
                        <span className="gv-ap-nm">{m.what}<em>{m.when}</em></span>
                        <b>{m.price}</b>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="gv-ap-note">{t('demoEmpty')}</p>}
              <p className="gv-ap-note">{t('demoNote')}</p>
            </div>
          ) : null}

          {tab === 'contact' ? (
            <div className="gv-ap-view" data-testid="demo-contact">
              <p className="gv-ap-h">{name}</p>
              <ul className="gv-ap-list">
                <li><div className="gv-ap-row"><span className="gv-ap-nm">{t('demoWa')}<em>{plain(K.ask)}</em></span></div></li>
                <li><div className="gv-ap-row"><span className="gv-ap-nm">{t('demoCall')}<em>{plain(K.open)}</em></span></div></li>
                <li><div className="gv-ap-row"><span className="gv-ap-nm">{t('demoHours')}<em>{plain(K.hoursFull || K.hours)}</em></span></div></li>
                <li><div className="gv-ap-row"><span className="gv-ap-nm">{t('demoWhere')}<em>{plain(K.city)}</em></span></div></li>
              </ul>
              <p className="gv-ap-note">{t('demoNote')}</p>
            </div>
          ) : null}

          <button type="button" className="gv-ap-install" data-testid="install-chip" onClick={onInstall}>
            {t('installChip')}
          </button>

          <nav className="gv-ap-tabs" data-testid="app-tabs">
            {TABS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={tab === x.id}
                data-testid={'tab-' + x.id}
                onClick={() => setTab(x.id)}
              >{x.label}</button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
