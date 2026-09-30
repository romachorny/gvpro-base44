import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays, ChevronLeft, ChevronRight, LayoutGrid, MonitorSmartphone,
  Share2, ShoppingBag, UtensilsCrossed, Users,
} from 'lucide-react';
import { JOBS } from '@/gvpro/jobs';
import { COLOURS, colourVars } from '@/gvpro/theme';
import { SAMPLE_NAME, dirOf, isRTL, tr } from '@/gvpro/ui';
import { guessLang, readShare, shareLink, syncAddressBar } from '@/gvpro/share';
import PhoneApp from '@/components/gvpro/PhoneApp';
import OrderSheet from '@/components/gvpro/OrderSheet';
import LangSwitch from '@/components/gvpro/LangSwitch';
import Footer from '@/components/gvpro/Footer';
import '@/gvpro.css';

/* GVPro. Two screens and one question.
   Screen one asks what the business is for; screen two hands back a working app for exactly
   that, with the business's own name on it, in its own colour. Nothing to install, nothing to
   sign up for, nothing saved — and one blue button under it. */

const JOB_ICON = {
  booking: CalendarDays, orders: ShoppingBag, menu: UtensilsCrossed, catalogue: LayoutGrid, team: Users,
};

export default function Home() {
  const shared = useMemo(() => readShare(), []);
  const [name, setName] = useState(shared.name);
  const [job, setJob] = useState(shared.job);
  const [colour, setColour] = useState(shared.colour);
  const [lang, setLang] = useState(shared.lang || guessLang());
  const [tab, setTab] = useState(shared.tab);
  /* a link that already names a job opens straight on the app it is a link to */
  const [screen, setScreen] = useState(shared.shared ? 'app' : 'pick');
  const [order, setOrder] = useState(false);
  const [toast, setToast] = useState('');

  const t = useCallback((k) => tr(lang, k), [lang]);
  const shownName = name.trim() || SAMPLE_NAME[lang] || SAMPLE_NAME.he;
  const rtl = isRTL(lang);
  const Chevron = rtl ? ChevronLeft : ChevronRight;

  /* RTL is first class: Hebrew and Arabic turn the document round, and everything inside it
     is laid out with logical properties, so nothing has to be mirrored by hand. */
  useEffect(() => {
    const el = document.documentElement;
    const prevLang = el.lang, prevDir = el.dir;
    el.lang = lang;
    el.dir = dirOf(lang);
    document.title = tr(lang, 'brand') + ' — ' + tr(lang, 'tagline');
    return () => { el.lang = prevLang; el.dir = prevDir; };
  }, [lang]);

  /* The address bar always holds the view, so a reload, a bookmark and a copied link agree. */
  useEffect(() => {
    syncAddressBar({ name: name.trim(), job, colour, lang, tab });
  }, [name, job, colour, lang, tab]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  async function share() {
    const url = shareLink({ name: name.trim(), job, colour, lang, tab });
    if (navigator.share) {
      try { await navigator.share({ title: tr(lang, 'brand'), text: shownName, url }); return; } catch (e) { /* cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      setToast(t('copied'));
    } catch (e) {
      setToast(t('copyFail'));
    }
  }

  const head = (
    <div className="gv-head">
      <span className="gv-mark"><i>GV</i>{t('brand')}</span>
      <span className="gv-spacer" />
      <LangSwitch lang={lang} onPick={setLang} />
      <button type="button" className="gv-icon-btn" aria-label={t('share')} title={t('share')} data-testid="share-btn" onClick={share}>
        <Share2 size={18} />
      </button>
    </div>
  );

  const nameField = (
    <div className="gv-card">
      <label className="gv-label" htmlFor="gv-name">{t('nameLabel')}</label>
      <input
        id="gv-name"
        className="gv-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('namePh')}
        maxLength={60}
        data-testid="biz-name"
      />
    </div>
  );

  return (
    <div className="gv" dir={dirOf(lang)} style={colourVars(colour)} data-lang={lang} data-rtl={String(rtl)}>
      <div className="gv-page">
        {head}

        {screen === 'pick' ? (
          <div data-testid="screen-pick">
            {nameField}
            <div style={{ marginTop: 14 }}>
              <p className="gv-q">{t('q1')}</p>
              <div className="gv-jobs">
                {JOBS.map((id) => {
                  const Icon = JOB_ICON[id];
                  return (
                    <button
                      key={id}
                      type="button"
                      className="gv-job"
                      aria-pressed={id === job}
                      data-testid={'job-' + id}
                      onClick={() => { setJob(id); setTab('job'); setScreen('app'); }}
                    >
                      <span className="gv-job-ic"><Icon size={19} /></span>
                      <span className="gv-job-tx">
                        <b>{t('job_' + id)}</b>
                        <em>{t('job_' + id + '_eg')}</em>
                      </span>
                      <Chevron size={18} className="gv-job-go" />
                    </button>
                  );
                })}
              </div>
            </div>
            <Footer lang={lang} />
          </div>
        ) : null}

        {screen === 'app' ? (
          /* One column on a phone, two on a laptop — and the same markup for both. The layout
             moves with grid areas rather than a second copy of the button hidden by CSS: two
             "I want this app" buttons in one document is one too many for a screen reader, and
             it is how a duplicate slipped in the first time. */
          <div className="gv-app" data-testid="screen-app">
            <button type="button" className="gv-link gv-a-back" data-testid="back-to-jobs" onClick={() => setScreen('pick')}>
              {(rtl ? '\u2192 ' : '\u2190 ') + t('back')}
            </button>

            <div className="gv-a-name">{nameField}</div>

            <div className="gv-card gv-a-col">
              <span className="gv-label">{t('colourTitle')}</span>
              <div className="gv-swatches" role="group" aria-label={t('colourTitle')} data-testid="swatches">
                {COLOURS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="gv-swatch"
                    aria-pressed={c.id === colour}
                    aria-label={c.id}
                    title={c.id}
                    data-testid={'colour-' + c.id}
                    onClick={() => setColour(c.id)}
                  ><i style={{ background: c.hex }} /></button>
                ))}
              </div>
            </div>

            {/* On a laptop there is room to change the job without walking back a screen.
                On a phone there is not, and the back link is one tap away. */}
            <div className="gv-card gv-a-jobs gv-only-wide">
              <p className="gv-q" style={{ fontSize: 15, marginBottom: 8 }}>{t('q1')}</p>
              <div className="gv-jobs">
                {JOBS.map((id) => {
                  const Icon = JOB_ICON[id];
                  return (
                    <button
                      key={id}
                      type="button"
                      className="gv-job"
                      style={{ padding: '9px 11px' }}
                      aria-pressed={id === job}
                      data-testid={'pick-' + id}
                      onClick={() => { setJob(id); setTab('job'); }}
                    >
                      <span className="gv-job-ic" style={{ width: 32, height: 32, borderRadius: 10 }}><Icon size={16} /></span>
                      <span className="gv-job-tx"><b style={{ fontSize: 14 }}>{t('job_' + id)}</b></span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="gv-phone-wrap gv-a-phone">
              <PhoneApp name={shownName} job={job} colour={colour} lang={lang} tab={tab} onTab={setTab} />
            </div>

            <div className="gv-a-cta">
              <button type="button" className="gv-btn gv-primary" data-testid="want-app" onClick={() => setOrder(true)}>
                {t('cta')}
              </button>
              <p className="gv-gift" data-testid="gift-line">
                <MonitorSmartphone size={15} />
                <span>{t('gift')}</span>
              </p>
            </div>

            <div className="gv-a-foot"><Footer lang={lang} /></div>
          </div>
        ) : null}
      </div>

      {order ? (
        <OrderSheet name={shownName} job={job} colour={colour} lang={lang} onClose={() => setOrder(false)} />
      ) : null}

      {toast ? <div className="gv-toast" role="status" data-testid="toast">{toast}</div> : null}
    </div>
  );
}
