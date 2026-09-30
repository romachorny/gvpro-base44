import { Check, Minus, Plus } from 'lucide-react';
import { DEMO, pick } from '@/gvpro/jobs';
import { tr } from '@/gvpro/ui';

/* Orders: a list, a basket that counts, a checkout sheet with pick-up or delivery.
   The total is real arithmetic on invented prices; nothing is charged and nothing is sent. */
export default function OrdersView({ lang, state, set, onDone, done }) {
  const t = (k, v) => tr(lang, k, v);
  const { items } = DEMO.orders;
  const cart = state.cart || {};
  const count = items.reduce((n, p) => n + (cart[p.id] || 0), 0);
  const total = items.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0);

  if (done) {
    return (
      <div className="gv-done" data-testid="demo-done">
        <span className="gv-tick"><Check size={22} /></span>
        <b>{t('orderedTitle')}</b>
        <span>{done}</span>
        <p className="gv-d-note">{t('demoNote')}</p>
      </div>
    );
  }

  const bump = (id, by) => {
    const next = { ...cart, [id]: Math.max(0, (cart[id] || 0) + by) };
    if (!next[id]) delete next[id];
    set({ cart: next });
  };

  return (
    <div data-testid="demo-orders">
      <p className="gv-d-h">{t('pickService')}</p>
      <ul className="gv-d-list">
        {items.map((p, i) => (
          <li key={p.id}>
            <div className={'gv-d-row' + (cart[p.id] ? ' gv-on' : '')}>
              <span className="gv-d-nm">{pick(p.name, lang)}</span>
              <b>{'₪' + p.price}</b>
              {cart[p.id] ? (
                <>
                  <button type="button" className="gv-icon-btn" style={{ width: 26, height: 26 }} aria-label="-" data-testid={'minus-' + i} onClick={() => bump(p.id, -1)}>
                    <Minus size={13} />
                  </button>
                  <i className="gv-d-count">{cart[p.id]}</i>
                </>
              ) : null}
              <button type="button" className="gv-icon-btn" style={{ width: 26, height: 26 }} aria-label={t('addToCart')} data-testid={'add-' + i} onClick={() => bump(p.id, 1)}>
                <Plus size={13} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="gv-total"><span>{t('total')}</span><b data-testid="cart-total">{'₪' + total}</b></div>

      <div className="gv-slots" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
        {['pickup', 'delivery'].map((w) => (
          <button
            key={w}
            type="button"
            className="gv-slot"
            aria-pressed={(state.how || 'pickup') === w}
            data-testid={'how-' + w}
            onClick={() => set({ how: w })}
          >{t(w)}</button>
        ))}
      </div>

      <button
        type="button"
        className="gv-btn gv-primary gv-d-go"
        disabled={!count}
        data-testid="demo-confirm"
        onClick={() => onDone(
          t(state.how === 'delivery' ? 'delivery' : 'pickup') + ' · ₪' + total,
          { kind: 'orders', amount: total },
        )}
      >{t('checkout')}</button>

      <p className="gv-d-note">{t('demoNote')}</p>
    </div>
  );
}
