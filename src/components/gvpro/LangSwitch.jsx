import { useState } from 'react';
import { Globe, X } from 'lucide-react';
import { LANGS, LANG_LABEL, dirOf, tr } from '@/gvpro/ui';

/* Four languages, Hebrew first. Picking one turns the whole document round when it has to. */
export default function LangSwitch({ lang, onPick }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="gv-icon-btn"
        aria-label={tr(lang, 'lang')}
        title={tr(lang, 'lang')}
        aria-expanded={open}
        data-testid="lang-btn"
        onClick={() => setOpen(!open)}
      ><Globe size={18} /></button>

      {open ? (
        <div className="gv-sheet" role="dialog" aria-modal="true" dir={dirOf(lang)} onClick={() => setOpen(false)} data-testid="lang-sheet">
          <div className="gv-sheet-in" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="gv-icon-btn gv-sheet-x" aria-label={tr(lang, 'close')} onClick={() => setOpen(false)}>
              <X size={17} />
            </button>
            <h2>{tr(lang, 'lang')}</h2>
            <div className="gv-pkgs" style={{ marginTop: 14 }}>
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  className="gv-pkg"
                  aria-pressed={l === lang}
                  data-testid={'lang-' + l}
                  onClick={() => { setOpen(false); onPick(l); }}
                ><span className="gv-pkg-top"><b>{LANG_LABEL[l]}</b></span></button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
