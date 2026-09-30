import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { tr } from '@/gvpro/ui';
import { dirOf, styleName } from '@/gvpro/engine';
import { APPS_PAGE, normPhone, phoneOk, waLink, waTag } from '@/gvpro/studio';
import { CloseIcon } from './Icons';

/* The short form behind both doors. Four things are asked; four more ride along by themselves —
   the niche, the style, the language and which of the two buttons was pressed. It lands in the
   Lead entity, and only then does the thank-you screen open the agent on WhatsApp. */
export default function OrderSheet({ want, name, niche, style, lang, onClose }) {
  const t = (k) => tr(lang, k);
  const [form, setForm] = useState({ name: '', business_name: name || '', whatsapp: '', note: '' });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

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
        niche,
        style,
        lang,
        want,
        status: 'new',
        source: 'gvpro',
      });
      setDone(true);
    } catch (e) {
      setErr({ save: t('errSave') });
    } finally {
      setBusy(false);
    }
  }

  const wa = waLink({
    want,
    opener: t(want === 'app' ? 'waApp' : 'waSite'),
    businessName: form.business_name.trim() || name,
    niche,
    style,
    lang,
  });

  return (
    <div className="gv-sheet" role="dialog" aria-modal="true" dir={dirOf(lang)} data-testid="order-sheet">
      <div className="gv-sheet-in" style={{ position: 'relative' }}>
        <button type="button" className="gv-rb gv-close" aria-label={t('close')} onClick={onClose}>
          <CloseIcon />
        </button>

        {done ? (
          <div data-testid="thanks">
            <h2>{t('thanks')}</h2>
            <p className="gv-note">{t('thanksNote')}</p>
            <a className="gv-btn gv-primary" href={wa} target="_blank" rel="noopener noreferrer" data-testid="wa-continue" data-gvp-tag={waTag(want)}>
              {t('openWa')}
            </a>
            {want === 'app' ? (
              <>
                <a className="gv-btn gv-second" style={{ marginTop: 8 }} href={APPS_PAGE} target="_blank" rel="noopener noreferrer" data-testid="apps-link">
                  {t('seePackages')}
                </a>
                <p className="gv-note" style={{ marginTop: 8, textAlign: 'center' }}>{t('packages')}</p>
              </>
            ) : null}
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2>{t(want === 'app' ? 'formAppTitle' : 'formSiteTitle')}</h2>
            <p className="gv-note">{t('formNote')}</p>

            <label className="gv-field">
              <span>{t('fName')}</span>
              <input name="name" value={form.name} onChange={set('name')} autoComplete="name" data-testid="f-name" />
              {err.name ? <b className="gv-err" data-testid="e-name">{err.name}</b> : null}
            </label>

            <label className="gv-field">
              <span>{t('fBiz')}</span>
              <input name="business_name" value={form.business_name} onChange={set('business_name')} data-testid="f-biz" />
              {err.business_name ? <b className="gv-err" data-testid="e-biz">{err.business_name}</b> : null}
            </label>

            <label className="gv-field">
              <span>{t('fWa')}</span>
              <input
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
              <span>{t('fMsg')}</span>
              <textarea name="note" value={form.note} onChange={set('note')} data-testid="f-note" />
            </label>

            {/* what the visitor never has to type: it is on screen in front of them */}
            <p className="gv-note" data-testid="auto-fields">
              {[t(niche), styleName(style, lang), lang].join(' · ')}
            </p>

            {err.save ? <b className="gv-err" data-testid="e-save">{err.save}</b> : null}

            <button type="submit" className="gv-btn gv-primary" style={{ marginTop: 8 }} disabled={busy} data-testid="f-send">
              {busy ? t('sending') : t('send')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
