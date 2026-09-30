import { OWNER } from '@/gvpro/jobs';
import { tr } from '@/gvpro/ui';
import { priceText } from '@/gvpro/studio';

/* The second tab, and the one that sells the thing. A customer app anybody can picture; what
   they cannot picture is opening their own phone at eight in the morning and seeing the day.
   The numbers are invented, but they move with whatever the visitor just did in the demo — a
   booking made on the tab before this one shows up here, which is the point. */
export default function OwnerView({ lang, job, mine }) {
  const t = (k, v) => tr(lang, k, v);
  const base = OWNER[job] || OWNER.booking;
  const count = base.count + mine.length;
  const revenue = base.revenue + mine.reduce((sum, m) => sum + (m.amount || 0), 0);

  return (
    <div data-testid="demo-owner">
      <p className="gv-d-h">{t('ownerToday')}</p>
      <div className="gv-stats">
        <div className="gv-stat">
          <span>{t('ownerCount_' + job)}</span>
          <b data-testid="owner-count">{count}</b>
        </div>
        <div className="gv-stat">
          <span>{t('ownerRevenue')}</span>
          <b data-testid="owner-revenue">{priceText(revenue)}</b>
        </div>
        <div className="gv-stat gv-wide">
          <span>{t('ownerNext')}</span>
          <b>{t('ownerNextIn', { n: base.nextIn })}</b>
        </div>
      </div>

      {mine.length ? (
        <ul className="gv-d-list" data-testid="owner-list">
          {mine.map((m, i) => (
            <li key={i}>
              <div className="gv-d-row">
                <span className="gv-d-nm">{m.line}</span>
                {m.amount ? <b>{priceText(m.amount)}</b> : null}
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="gv-d-note" style={{ textAlign: 'start' }}>{t('demoEmpty')}</p>}

      <p className="gv-d-note">{t('demoNote')}</p>
    </div>
  );
}
