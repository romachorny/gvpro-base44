import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { tr, dirOf } from '@/gvpro/ui';
import { colourVars } from '@/gvpro/theme';
import { PACKAGES, WA_TAG, normPhone, phoneOk, priceText, waLink } from '@/gvpro/studio';

/* What happens after "I want this app": the packages, then the form, then the thank you.
   The packages come first on purpose — somebody who has just played with the demo still does
   not know what they would be buying, and a price with nothing under it is a number people
   argue with. The form asks four things; five more ride along by themselves, because the job,
   the colour, the package and the language are already on screen. */
export default function OrderSheet({ name, job, colour, lang, onClose }) {
  const t = (k) => tr(lang, k);
  const [step, setStep] = useState('packages');
  const [pkg, setPkg] = useState('business');
  const [form, setForm] = useState({ name: '', business_name: name || '', whatsapp: '', note: '' });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const tier = PACKAGES.find((p) => p.id === pkg);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = t('errName');
    if (!form.business_name.trim()) e.business_name = t('errBiz');
    if (!phoneOk(form.whatsapp)) e.whatsapp = t('errWa');
    setErr(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev) {
    ev.preventDefault();
    if (busy || !validate()) return;
    setBusy(true);
    try {
      await base44.entities.Lead.create({
        name: form.name.trim(),
        business_name: form.business_name.trim(),
        whatsapp: normPhone(form.whatsapp),
        note: form.note.trim(),
        job,
        colour,
        package: pkg,
        lang,
        status: 'new',
        source: 'gvpro',
      });
      setStep('thanks');
    } catch (e) {
      setErr({ save: t('errSave') });
    } finally {
      setBusy(false);
    }
  }

  const wa = waLink({
    opener: t('waOpener'),
    businessName: form.business_name.trim() || name,
    job,
    colour,
    pkg,
    lang,
  });

  return (
    <div className="gv-sheet" role="dialog" aria-modal="true" dir={dirOf(lang)} style={colourVars(colour)} data-testid="order-sheet">
      <div className="gv-sheet-in">
        <button type="button" className="gv-icon-btn gv-sheet-x" aria-label={t('close')} onClick={onClose} data-testid="sheet-close">
          <X size={17} />
        </button>

        {step === 'packages' ? (
          <div data-testid="packages">
            <h2>{t('pkgTitle')}</h2>
            <div className="gv-pkgs">
              {PACKAGES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="gv-pkg"
                  aria-pressed={pkg === p.id}
                  data-testid={'pkg-' + p.id}
                  onClick={() => setPkg(p.id)}
                >
                  <span className="gv-pkg-top">
                    <b>{t(p.key)}</b>
                    <span>{(p.from ? t('pkgFrom') + ' ' : '') + priceText(p.price)}</span>
                  </span>
                  <em>{t(p.line)}</em>
                </button>
              ))}
            </div>
            <p className="gv-own" data-testid="own-line">{t('ownBase44')}</p>
            <button type="button" className="gv-btn gv-primary" data-testid="pkg-go" onClick={() => setStep('form')}>
              {t('pkgGo')}
            </button>
          </div>
        ) : null}

        {step === 'form' ? (
          <form onSubmit={submit} noValidate>
            <h2>{t('formTitle')}</h2>
            <p className="gv-note" style={{ marginBottom: 14 }}>{t('formNote')}</p>

            {tier ? (
              <button type="button" className="gv-pkg" style={{ marginBottom: 14 }} data-testid="picked-package" onClick={() => setStep('packages')}>
                <span className="gv-pkg-top">
                  <b>{t('pkgPicked') + ': ' + t(tier.key)}</b>
                  <span>{(tier.from ? t('pkgFrom') + ' ' : '') + priceText(tier.price)}</span>
                </span>
              </button>
            ) : null}

            <label className="gv-field">
              <span className="gv-label">{t('fName')}</span>
              <input className="gv-input" name="name" value={form.name} onChange={set('name')} autoComplete="name" data-testid="f-name" />
              {err.name ? <b className="gv-err" data-testid="e-name">{err.name}</b> : null}
            </label>

            <label className="gv-field">
              <span className="gv-label">{t('fBiz')}</span>
              <input className="gv-input" name="business_name" value={form.business_name} onChange={set('business_name')} data-testid="f-biz" />
              {err.business_name ? <b className="gv-err" data-testid="e-biz">{err.business_name}</b> : null}
            </label>

            <label className="gv-field">
              <span className="gv-label">{t('fWa')}</span>
              <input
                className="gv-input"
                name="whatsapp"
                value={form.whatsapp}
                onChange={set('whatsapp')}
                inputMode="tel"
                autoComplete="tel"
                placeholder={t('fWaPh')}
                dir="ltr"
                data-testid="f-wa"
              />
              {err.whatsapp ? <b className="gv-err" data-testid="e-wa">{err.whatsapp}</b> : null}
            </label>

            <label className="gv-field">
              <span className="gv-label">{t('fMsg')}</span>
              <textarea className="gv-area" name="note" value={form.note} onChange={set('note')} data-testid="f-note" />
            </label>

            {/* what the visitor never has to type: it is on screen in front of them */}
            <p className="gv-note" style={{ fontSize: 12.5, marginBottom: 10 }} data-testid="auto-fields">
              {[t('job_' + job), t('colourTitle') + ': ' + colour, lang].join(' · ')}
            </p>

            {err.save ? <b className="gv-err" data-testid="e-save">{err.save}</b> : null}

            <button type="submit" className="gv-btn gv-primary" disabled={busy} data-testid="f-send">
              {busy ? t('sending') : t('send')}
            </button>
          </form>
        ) : null}

        {step === 'thanks' ? (
          <div data-testid="thanks">
            <div className="gv-done" style={{ paddingTop: 4 }}>
              <span className="gv-tick"><Check size={22} /></span>
              <b style={{ fontSize: 20 }}>{t('thanks')}</b>
            </div>
            <p className="gv-note" style={{ textAlign: 'center', marginBottom: 16 }}>{t('thanksNote')}</p>
            <a
              className="gv-btn gv-primary"
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="wa-continue"
              data-gvp-tag={WA_TAG}
            >{t('openWa')}</a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
