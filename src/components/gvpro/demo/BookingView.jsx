import { Check } from 'lucide-react';
import { DEMO, pick } from '@/gvpro/jobs';
import { tr } from '@/gvpro/ui';

/* Booking: what, then which day, then which hour. A week strip that starts today, slots with a
   few already taken — an appointment book with nothing in it looks broken, one with nothing
   free looks shut. Nothing is saved: the confirmation lives in React state and dies with the tab. */
export default function BookingView({ lang, week, day, setDay, state, set, onDone, done }) {
  const t = (k, v) => tr(lang, k, v);
  const { items, slots, taken } = DEMO.booking;
  const days = tr(lang, 'days');

  if (done) {
    return (
      <div className="gv-done" data-testid="demo-done">
        <span className="gv-tick"><Check size={22} /></span>
        <b>{t('bookedTitle')}</b>
        <span>{done}</span>
        <p className="gv-d-note">{t('demoNote')}</p>
      </div>
    );
  }

  const chosen = items.find((x) => x.id === state.service);

  return (
    <div data-testid="demo-booking">
      <p className="gv-d-h">{t('pickService')}</p>
      <ul className="gv-d-list">
        {items.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className="gv-d-row"
              aria-pressed={state.service === s.id}
              data-testid={'svc-' + i}
              onClick={() => set({ service: s.id, time: '' })}
            >
              <span className="gv-d-nm">{pick(s.name, lang)}<em>{t('minutes', { n: s.mins })}</em></span>
              <b>{'₪' + s.price}</b>
            </button>
          </li>
        ))}
      </ul>

      {chosen ? (
        <>
          <p className="gv-d-h">{t('pickTime')}</p>
          <div className="gv-week" data-testid="week-strip">
            {week.map((d, i) => (
              <button
                key={i}
                type="button"
                className="gv-day"
                aria-pressed={day === i}
                data-testid={'day-' + i}
                onClick={() => { setDay(i); set({ time: '' }); }}
              >
                <span>{days[d.dow]}</span>
                <b>{d.date}</b>
              </button>
            ))}
          </div>
          <div className="gv-slots">
            {slots.map((s) => {
              const gone = !!taken[day + '|' + s];
              return (
                <button
                  key={s}
                  type="button"
                  className="gv-slot"
                  aria-pressed={state.time === s}
                  disabled={gone}
                  title={gone ? t('slotTaken') : undefined}
                  data-testid={'slot-' + s}
                  onClick={() => set({ time: s })}
                >{s}</button>
              );
            })}
          </div>
          <button
            type="button"
            className="gv-btn gv-primary gv-d-go"
            disabled={!state.time}
            data-testid="demo-confirm"
            onClick={() => onDone(
              t('bookedLine', {
                what: pick(chosen.name, lang),
                when: (day === 0 ? t('today') : days[week[day].dow]) + ' ' + state.time,
              }),
              { kind: 'booking', amount: chosen.price },
            )}
          >{t('confirm')}</button>
        </>
      ) : null}

      <p className="gv-d-note">{t('demoNote')}</p>
    </div>
  );
}
