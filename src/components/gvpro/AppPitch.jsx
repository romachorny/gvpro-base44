import { nicheCopy, plain } from '@/gvpro/engine';
import { tr } from '@/gvpro/ui';
import { APP_TIERS, isOrdering, priceText } from '@/gvpro/studio';
import { useLangPack } from '@/gvpro/useLangPack';

/* The screen between "I want an app" and the form. Somebody who has just played with the demo
   still does not know what they would be buying, and a price with nothing under it is a number
   people argue with. So: what this app does for this trade, the three ways in with one line
   each, and whose account it ends up being. Then, and only then, the form. */
export default function AppPitch({ niche, lang, pkg, onPick, onGo }) {
  const t = (k) => tr(lang, k);
  useLangPack(lang);
  const K = nicheCopy(niche, lang);
  const trade = plain(K.trade) || t(niche);
  const ordering = isOrdering(niche);

  const lines = [
    ordering ? t('pitchOrder') : t('pitchBook'),
    t('pitchDash'),
    t('pitchWa'),
    t('pitchInstall'),
    t('pitchLangs'),
  ];

  return (
    <div className="gv-pitch" data-testid="app-pitch">
      <h2>{t('pitchTitle')}</h2>
      <p className="gv-note">{t('pitchFor').replace('{trade}', trade)}</p>

      <ul>
        {lines.map((line, i) => <li key={i}>{line}</li>)}
      </ul>

      <h2 style={{ fontSize: 16 }}>{t('pkgTitle')}</h2>
      <div className="gv-pkg" style={{ marginTop: 8 }} role="group" aria-label={t('pkgTitle')}>
        {APP_TIERS.map((tier) => (
          <button
            key={tier.id}
            type="button"
            aria-pressed={pkg === tier.id}
            data-testid={'pkg-' + tier.id}
            onClick={() => onPick(tier.id)}
          >
            <span className="gv-pkg-top">
              <b>{t(tier.key)}</b>
              <span>{(tier.from ? t('pkgFrom') + ' ' : '') + priceText(tier.price)}</span>
            </span>
            <em>{t(tier.line)}</em>
          </button>
        ))}
      </div>

      <p className="gv-own" data-testid="pitch-own">{t('pitchOwn')}</p>

      <button type="button" className="gv-btn gv-primary" data-testid="pitch-go" onClick={onGo}>
        {t('pitchGo')}
      </button>
    </div>
  );
}
