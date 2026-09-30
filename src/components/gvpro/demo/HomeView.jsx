import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { tr } from '@/gvpro/ui';

/* The first thing a customer sees when they open the app: whose it is, whether it is open, and
   the two buttons they were going to look for anyway. Both buttons are dead — this is a demo,
   and a demo that dials somebody's phone is not a demo. */
export default function HomeView({ lang, name }) {
  const t = (k) => tr(lang, k);

  return (
    <div data-testid="demo-home">
      <div className="gv-d-row" style={{ display: 'grid', gap: 2, padding: '12px' }}>
        <b style={{ fontSize: 15 }}>{name}</b>
        <span style={{ fontSize: 11.5, color: 'var(--acc)', fontWeight: 600 }}>{t('openNow')}</span>
      </div>

      <ul className="gv-d-list" style={{ marginTop: 8 }}>
        <li>
          <div className="gv-d-row">
            <Clock size={15} color="var(--muted)" />
            <span className="gv-d-nm">{t('hoursLabel')}<em style={{ whiteSpace: 'normal' }}>{t('hoursLine')}</em></span>
          </div>
        </li>
        <li>
          <div className="gv-d-row">
            <MapPin size={15} color="var(--muted)" />
            <span className="gv-d-nm">{t('whereLabel')}<em style={{ whiteSpace: 'normal' }}>{t('addressLine')}</em></span>
          </div>
        </li>
      </ul>

      <div className="gv-slots" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
        <span className="gv-slot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <Phone size={13} />{t('callBtn')}
        </span>
        <span className="gv-slot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <MessageCircle size={13} />{t('waBtn')}
        </span>
      </div>

      <p className="gv-d-note">{t('demoNote')}</p>
    </div>
  );
}
