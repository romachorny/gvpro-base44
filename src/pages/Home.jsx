import { useCallback, useEffect, useMemo, useState } from 'react';
import { NICHES, dirOf, ensureLang, isRTL } from '@/gvpro/engine';
import { sampleName, tr } from '@/gvpro/ui';
import { guessLang, readShare, shareLink, syncAddressBar } from '@/gvpro/share';
import { NicheIcon, ShareIcon } from '@/components/gvpro/Icons';
import StyleRail from '@/components/gvpro/StyleRail';
import Viewer from '@/components/gvpro/Viewer';
import OrderSheet from '@/components/gvpro/OrderSheet';
import LangSwitch from '@/components/gvpro/LangSwitch';
import Footer from '@/components/gvpro/Footer';
import Slogan from '@/components/gvpro/Slogan';
import '@/gvpro.css';

/* GVPro — the one screen.
   A barber types the name of the shop, taps "Barber", and his possible sites are already on the
   phone in front of him, with his name on them, while he types. Sixty pages, five niches times
   twelve styles, all of them drawn by the engine ported from app.genvidpro.com. */
export default function Home() {
  const shared = useMemo(() => readShare(), []);
  const [name, setName] = useState(shared.name);
  const [niche, setNiche] = useState(shared.niche);
  const [style, setStyle] = useState(shared.style);
  const [lang, setLang] = useState(shared.lang || guessLang());
  const [viewer, setViewer] = useState(shared.shared ? shared.style : null);
  const [order, setOrder] = useState(null);      /* 'site' | 'app' | null */
  const [toast, setToast] = useState('');

  const t = useCallback((k) => tr(lang, k), [lang]);

  /* An empty field still shows a real site: the example name in the language on screen. */
  const shownName = name.trim() || sampleName(lang, niche);

  /* Truly RTL: the document turns round, and so does every page inside every frame — the engine
     writes dir=rtl itself once it is handed a Hebrew or Arabic state, which it always is here. */
  useEffect(() => {
    const el = document.documentElement;
    const prevLang = el.lang, prevDir = el.dir;
    el.lang = lang;
    el.dir = dirOf(lang);
    ensureLang(lang);
    document.title = 'GVPro — ' + tr(lang, 'slogan');
    return () => { el.lang = prevLang; el.dir = prevDir; };
  }, [lang]);

  /* The home screen is one screen, no page scroll — the same rule the app has today. */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* The address bar always holds the view, so a reload, a bookmark and a copied URL all agree. */
  useEffect(() => {
    syncAddressBar({ name: name.trim(), niche, style, lang });
  }, [name, niche, style, lang]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  async function share() {
    const url = shareLink({ name: name.trim(), niche, style, lang });
    const text = shownName;
    if (navigator.share) {
      try { await navigator.share({ title: 'GVPro', text, url }); return; } catch (e) { /* cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      setToast(t('copied'));
    } catch (e) {
      setToast(t('copyFail'));
    }
  }

  const doors = (
    <div className="gv-cta">
      <button type="button" className="gv-btn gv-primary" data-testid="want-site" onClick={() => setOrder('site')}>
        {t('wantSite')}
      </button>
      <button type="button" className="gv-btn gv-second" data-testid="want-app" onClick={() => setOrder('app')}>
        {t('wantApp')}
      </button>
    </div>
  );

  return (
    <div className="gv" dir={dirOf(lang)} data-lang={lang} data-rtl={String(isRTL(lang))}>
      <div className="gv-home">
        <div className="gv-hd">
          <div className="gv-logo" aria-label="GVPro">
            {['G', 'V', 'P', 'r', 'o'].map((c, i) => <i key={i}>{c}</i>)}
          </div>
          <Slogan text={t('slogan')} />
          <LangSwitch lang={lang} onPick={setLang} />
          <button type="button" className="gv-rb" aria-label={t('share')} title={t('share')} data-testid="share-btn" onClick={share}>
            <ShareIcon />
          </button>
        </div>

        <div className="gv-top">
          <div className="gv-chips" role="group" aria-label={t('hintName')}>
            {NICHES.map((n) => {
              const Icon = NicheIcon[n];
              return (
                <button
                  key={n}
                  type="button"
                  className="gv-chip"
                  aria-pressed={n === niche}
                  aria-label={t(n)}
                  title={t(n)}
                  data-testid={'niche-' + n}
                  onClick={() => setNiche(n)}
                >{Icon ? <Icon /> : null}</button>
              );
            })}
          </div>
          <input
            className="gv-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('ph')}
            aria-label={t('hintName')}
            maxLength={60}
            data-testid="biz-name"
          />
        </div>

        <StyleRail
          name={shownName}
          niche={niche}
          lang={lang}
          selected={style}
          hint={t('swipe')}
          onSelect={setStyle}
          onOpen={(s) => setViewer(s)}
        />

        {doors}

        <Footer lang={lang} />
      </div>

      {viewer ? (
        <Viewer name={shownName} niche={niche} style={viewer} lang={lang} onClose={() => setViewer(null)}>
          {doors}
        </Viewer>
      ) : null}

      {order ? (
        <OrderSheet
          want={order}
          name={shownName}
          niche={niche}
          style={viewer || style}
          lang={lang}
          onClose={() => setOrder(null)}
        />
      ) : null}

      {toast ? (
        <div
          role="status"
          data-testid="toast"
          style={{
            position: 'fixed', insetInline: 0, bottom: 84, margin: '0 auto', width: 'fit-content', maxWidth: '90vw',
            zIndex: 60, padding: '9px 16px', borderRadius: 999, background: 'rgba(14,11,18,.94)',
            border: '1px solid rgba(244,239,234,.2)', color: '#F4EFEA', fontSize: 13,
          }}
        >{toast}</div>
      ) : null}
    </div>
  );
}
