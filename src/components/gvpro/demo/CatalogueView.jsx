import { Check } from 'lucide-react';
import { DEMO, pick } from '@/gvpro/jobs';
import { tr } from '@/gvpro/ui';

/* A catalogue is browsed and asked about. What is out of stock says so rather than quietly
   disappearing — a customer who drives over for a rug that is not there does not come back. */
export default function CatalogueView({ lang, state, set, onDone, done }) {
  const t = (k) => tr(lang, k);
  const { items, out } = DEMO.catalogue;

  if (done) {
    return (
      <div className="gv-done" data-testid="demo-done">
        <span className="gv-tick"><Check size={22} /></span>
        <b>{t('asked')}</b>
        <span>{done}</span>
        <p className="gv-d-note">{t('demoNote')}</p>
      </div>
    );
  }

  const chosen = items.find((x) => x.id === state.product);

  return (
    <div data-testid="demo-catalogue">
      <ul className="gv-d-list">
        {items.map((p, i) => {
          const gone = out.indexOf(p.id) >= 0;
          return (
            <li key={p.id}>
              <button
                type="button"
                className="gv-d-row"
                aria-pressed={state.product === p.id}
                data-testid={'item-' + i}
                onClick={() => set({ product: p.id })}
              >
                <span className="gv-d-nm">
                  {pick(p.name, lang)}
                  <em style={{ color: gone ? '#BE123C' : undefined }}>{gone ? t('outOfStock') : t('inStock')}</em>
                </span>
                <b>{'₪' + p.price}</b>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="gv-btn gv-primary gv-d-go"
        disabled={!chosen}
        data-testid="demo-confirm"
        onClick={() => onDone(pick(chosen.name, lang), { kind: 'catalogue', amount: chosen.price })}
      >{t('askAbout')}</button>

      <p className="gv-d-note">{t('demoNote')}</p>
    </div>
  );
}
