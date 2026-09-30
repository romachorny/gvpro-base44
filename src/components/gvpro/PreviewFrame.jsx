import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { renderPage, ensureLang, styleName } from '@/gvpro/engine';

/* One preview: the real engine's page inside a srcdoc frame, scaled down — never a drawn card.
   The old app's rule, kept: the frame's size and its scale are set before it enters the card and
   it stays transparent until its page has loaded, so nothing ever flashes unscaled.
   A wide card draws the site at 1200 px, the way a computer shows it; a tall card at a phone's 390. */
export default function PreviewFrame({ name, niche, style, lang, wide, onOpen, label }) {
  const box = useRef(null);
  const [html, setHtml] = useState('');
  const [shown, setShown] = useState(false);
  const vw = wide ? 1200 : 390;

  /* The language pack has to be in before the first paint: without it the engine keeps dir=rtl
     but falls back to English words, which is exactly what "not truly RTL" looked like. */
  useEffect(() => {
    let live = true;
    setShown(false);
    ensureLang(lang).then(() => {
      if (live) setHtml(renderPage({ name, niche, style, lang, full: false }));
    });
    return () => { live = false; };
  }, [name, niche, style, lang]);

  /* Scale to whatever room the card got, and follow it when the window changes. */
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const fit = () => {
      const f = el.querySelector('iframe');
      if (!f) return;
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      const k = w / vw;
      f.style.width = vw + 'px';
      f.style.height = Math.ceil(h / k) + 'px';
      f.style.transform = 'scale(' + k + ')';
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [html, vw]);

  return (
    <div ref={box} className={'gv-frame' + (shown ? '' : ' gv-sk')}>
      {html ? (
        <iframe
          title={label || styleName(style, lang)}
          tabIndex={-1}
          aria-hidden="true"
          className={shown ? 'gv-on' : ''}
          srcDoc={html}
          onLoad={() => setShown(true)}
        />
      ) : null}
      <button type="button" className="gv-tap" aria-label={label || styleName(style, lang)} onClick={onOpen} />
    </div>
  );
}
