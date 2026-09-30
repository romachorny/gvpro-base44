import { useCallback, useEffect, useRef, useState } from 'react';
import { ORDER, PER_PAGE, styleName } from '@/gvpro/engine';
import { ArrowIcon } from './Icons';
import PreviewFrame from './PreviewFrame';
import AppPhone from './AppPhone';
import { useLangPack } from '@/gvpro/useLangPack';

const SITE_PAGES = [];
for (let i = 0; i < ORDER.length; i += PER_PAGE) SITE_PAGES.push(ORDER.slice(i, i + PER_PAGE));
/* In app mode a page is one phone, because a tab bar and a booking sheet on a thumbnail
   would be a picture of an app rather than an app. Twelve pages instead of four. */
const APP_PAGES = ORDER.map((s) => [s]);

/* Twelve styles in one rail you swipe, the way the studio site shows them. In site mode a page
   is one wide card and two tall ones; in app mode a page is the style running as an app inside
   a phone. The rail itself is laid out left to right in every language on purpose: the green
   terminal stays first in Hebrew too. */
export default function StyleRail({ name, niche, lang, mode, selected, hint, onSelect, onOpen, onWantApp }) {
  const pv = useRef(null);
  const [page, setPage] = useState(0);
  useLangPack(lang);   /* the twelve style names live in the pack */
  const app = mode === 'app';
  const pages = app ? APP_PAGES : SITE_PAGES;
  const per = app ? 1 : PER_PAGE;

  const pageOf = useCallback((style) => {
    const i = ORDER.indexOf(style);
    return i < 0 ? 0 : Math.floor(i / per);
  }, [per]);

  const goto = useCallback((p, instant) => {
    const el = pv.current;
    if (!el) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 8;
    el.scrollTo({ left: p * (el.clientWidth + gap), behavior: instant ? 'auto' : 'smooth' });
  }, []);

  /* A share link lands on a style, not on a page — and so does a flip of the Site/App toggle,
     which changes how many styles fit on a page. Put the chosen one back on screen either way. */
  useEffect(() => {
    const p = pageOf(selected);
    setPage(p);
    goto(p, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const onScroll = () => {
    const el = pv.current;
    if (!el) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 8;
    const step = el.clientWidth + gap;
    if (!step) return;
    const p = Math.max(0, Math.min(pages.length - 1, Math.round(el.scrollLeft / step)));
    if (p === page) return;
    setPage(p);
    /* the page a finger stops on is the style the order buttons speak for */
    if (pageOf(selected) !== p) onSelect(pages[p][0]);
  };

  return (
    <>
      <div className="gv-rail">
        <div className="gv-pv" ref={pv} onScroll={onScroll}>
          {pages.map((styles, p) => (app ? (
            /* Only the phone in front of the visitor and its two neighbours are alive: twelve
               running apps at once is a lot of iframe for a mid-range phone to carry. */
            <div className="gv-phone-slot" key={styles[0]} data-style={styles[0]} data-active={String(p === page)}>
              {Math.abs(p - page) <= 1 ? (
                <AppPhone
                  name={name}
                  niche={niche}
                  style={styles[0]}
                  lang={lang}
                  onInstall={onWantApp}
                />
              ) : <div className="gv-phone-body gv-phone-idle" />}
            </div>
          ) : (
            <div className="gv-page" key={p} data-active={String(p === page)}>
              {styles.map((style, i) => (
                <div className={'gv-card' + (i === 0 ? ' gv-big' : '')} key={style} data-style={style}>
                  <PreviewFrame
                    name={name}
                    niche={niche}
                    style={style}
                    lang={lang}
                    wide={i === 0}
                    label={styleName(style, lang)}
                    onOpen={() => { onSelect(style); onOpen(style); }}
                  />
                </div>
              ))}
            </div>
          )))}
        </div>
        <button
          type="button"
          className="gv-arr gv-prev"
          disabled={page === 0}
          data-testid="rail-prev"
          onClick={() => goto(page - 1)}
        ><ArrowIcon back /></button>
        <button
          type="button"
          className="gv-arr gv-next"
          disabled={page === pages.length - 1}
          data-testid="rail-next"
          onClick={() => goto(page + 1)}
        ><ArrowIcon /></button>
      </div>
      <div className="gv-swipe">
        <span>{app ? styleName(pages[page][0], lang) : hint}</span>
        <div className="gv-dots" data-testid="rail-dots">
          {pages.map((_, p) => <i key={p} className={p === page ? 'gv-on' : ''} />)}
        </div>
      </div>
    </>
  );
}
