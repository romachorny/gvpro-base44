import { useState } from 'react';
import { LANGS } from '@/gvpro/engine';
import { tr } from '@/gvpro/ui';
import { GlobeIcon } from './Icons';

const LABEL = { en: 'English', he: 'עברית', ru: 'Русский', ar: 'العربية' };

/* The same four languages the app has today. Hebrew and Arabic turn the whole document
   round — the shell, the sheets and the page inside every frame. */
export default function LangSwitch({ lang, onPick }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="gv-rb"
        aria-label={tr(lang, 'lang')}
        title={tr(lang, 'lang')}
        aria-expanded={open}
        data-testid="lang-btn"
        onClick={() => setOpen(!open)}
      ><GlobeIcon /></button>

      {open ? (
        <div className="gv-sheet" role="dialog" aria-modal="true" onClick={() => setOpen(false)} data-testid="lang-sheet">
          <div className="gv-sheet-in" onClick={(e) => e.stopPropagation()}>
            <h2>{tr(lang, 'lang')}</h2>
            <div className="gv-cta" style={{ marginTop: 12 }}>
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  className={'gv-btn ' + (l === lang ? 'gv-primary' : 'gv-second')}
                  aria-pressed={l === lang}
                  data-testid={'lang-' + l}
                  onClick={() => { setOpen(false); onPick(l); }}
                >{LABEL[l]}</button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
