import { useEffect, useRef } from 'react';

/* "your idea, your app" in the language on screen, shrunk until it fits beside the neon letters.
   Russian next to a 375 px phone is the case that needs it: the old app cut the line to
   "your idea, y…" until it learned to shrink instead, and a clipped slogan reads as a bug. */
export default function Slogan({ text }) {
  const box = useRef(null);
  const line = useRef(null);

  useEffect(() => {
    const el = box.current, tx = line.current;
    if (!el || !tx) return undefined;
    const fit = () => {
      el.style.fontSize = '';
      const max = parseFloat(getComputedStyle(el).fontSize) || 26;
      let fs = max;
      const wide = () => tx.scrollWidth > el.clientWidth + 1;
      while (wide() && fs > 12) { fs -= 1; el.style.fontSize = fs + 'px'; }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit).catch(() => {});
    return () => ro.disconnect();
  }, [text]);

  return (
    <div className="gv-slogan" ref={box}><span ref={line}>{text}</span></div>
  );
}
