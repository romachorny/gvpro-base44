import { useEffect, useState } from 'react';
import { dirOf, ensureLang, renderPage, styleName } from '@/gvpro/engine';
import { tr } from '@/gvpro/ui';
import { CloseIcon } from './Icons';

/* The style at full size, the way the visitor's own phone will show it. The frame is the same
   engine call as the small tiles, only full: the toy and the clips come with it. */
export default function Viewer({ name, niche, style, lang, onClose, children }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    let live = true;
    setHtml('');
    ensureLang(lang).then(() => {
      if (live) setHtml(renderPage({ name, niche, style, lang, full: true }));
    });
    return () => { live = false; };
  }, [name, niche, style, lang]);

  /* the phone's own Back closes the viewer, not the app */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="gv-sheet" style={{ placeItems: 'stretch', padding: 0 }} role="dialog" aria-modal="true" dir={dirOf(lang)} data-testid="viewer">
      <div style={{ display: 'grid', gridTemplateRows: 'auto minmax(0,1fr) auto', height: '100dvh', width: '100%', background: '#07060A' }}>
        <div className="gv-hd" style={{ padding: '8px 12px', gap: 10 }}>
          <button type="button" className="gv-rb" aria-label={tr(lang, 'close')} onClick={onClose} data-testid="viewer-close">
            <CloseIcon />
          </button>
          <div className="gv-slogan" style={{ fontFamily: 'inherit', fontSize: 14, fontWeight: 700, textShadow: 'none' }}>
            <span>{(name || '') + ' · ' + styleName(style, lang)}</span>
          </div>
        </div>

        <div style={{ minHeight: 0, overflow: 'hidden', background: '#000' }}>
          {html ? (
            <iframe
              title={styleName(style, lang)}
              srcDoc={html}
              style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
              data-testid="viewer-frame"
            />
          ) : null}
        </div>

        <div style={{ padding: '10px 12px calc(10px + env(safe-area-inset-bottom,0px))' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
