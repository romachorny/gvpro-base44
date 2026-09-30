import { useCallback, useEffect, useRef, useState } from 'react';
import { ORDER, PER_PAGE, styleName } from '@/gvpro/engine';
import { ArrowIcon } from './Icons';
import PreviewFrame from './PreviewFrame';

const PAGES = [];
for (let i = 0; i < ORDER.length; i += PER_PAGE) PAGES.push(ORDER.slice(i, i + PER_PAGE));

/* Twelve styles in one rail you swipe, three at a time, the way the studio site shows them.
   Every page is one wide card on top and two tall ones under it. The rail itself is laid out
   left to right in every language on purpose: the green terminal stays first in Hebrew too. */
export default function StyleRail({ name, niche, lang, selected, hint, onSelect, onOpen }) {
  const pv = useRef(null);
  const [page, setPage] = useState(0);

  const pageOf = useCallback((style) => {
    const i = ORDER.indexOf(style);
    return i < 0 ? 0 : Math.floor(i / PER_PAGE);
  }, []);

  const goto = useCallback((p, instant) => {
    const el = pv.current;
    if (!el) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 8;
    el.scrollTo({ left: p * (el.clientWidth + gap), behavior: instant ? 'auto' : 'smooth' });
  }, []);

  /* A share link lands on a style, not on a page: put its page on screen right away. */
  useEffect(() => {
    const p = pageOf(selected);
    setPage(p);
    goto(p, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = () => {
    const el = pv.current;
    if (!el) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 8;
    const step = el.clientWidth + gap;
    if (!step) return;
    const p = Math.max(0, Math.min(PAGES.length - 1, Math.round(el.scrollLeft / step)));
    if (p === page) return;
    setPage(p);
    /* the page a finger stops on is the style the order buttons speak for */
    if (ORDER.indexOf(selected) < 0 || pageOf(selected) !== p) onSelect(PAGES[p][0]);
  };

  return (
    <>
      <div className="gv-rail">
        <div className="gv-pv" ref={pv} onScroll={onScroll}>
          {PAGES.map((styles, p) => (
            <div className="gv-page" key={p}>
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
          ))}
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
          disabled={page === PAGES.length - 1}
          data-testid="rail-next"
          onClick={() => goto(page + 1)}
        ><ArrowIcon /></button>
      </div>
      <div className="gv-swipe">
        <span>{hint}</span>
        <div className="gv-dots" data-testid="rail-dots">
          {PAGES.map((_, p) => <i key={p} className={p === page ? 'gv-on' : ''} />)}
        </div>
      </div>
    </>
  );
}
