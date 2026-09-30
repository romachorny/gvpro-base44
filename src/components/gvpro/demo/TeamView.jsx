import { DEMO, pick } from '@/gvpro/jobs';
import { tr } from '@/gvpro/ui';

/* The shift board: four people, a week, a morning and an evening. What is already covered says
   who has it; what is open can be taken, and taking it is the whole demo — a rota that only
   shows you the rota is a photograph. */
export default function TeamView({ lang, week, state, set }) {
  const t = (k) => tr(lang, k);
  const days = tr(lang, 'days');
  const { staff, roster } = DEMO.team;
  const mine = state.shifts || {};

  const who = (key) => {
    if (mine[key]) return { label: t('taken'), cls: ' gv-yours' };
    const id = roster[key];
    if (id) {
      const p = staff.find((s) => s.id === id);
      return { label: p ? pick(p.name, lang) : id, cls: ' gv-filled' };
    }
    return { label: t('openShift'), cls: '' };
  };

  return (
    <div data-testid="demo-team">
      <p className="gv-d-h">{t('tab_shifts')}</p>
      <div className="gv-board">
        <div className="gv-board-row">
          <span />
          <span>{t('amShift')}</span>
          <span>{t('pmShift')}</span>
        </div>
        {week.slice(0, 5).map((d, i) => (
          <div className="gv-board-row" key={i}>
            <span>{days[d.dow]} {d.date}</span>
            {['am', 'pm'].map((half) => {
              const key = i + '|' + half;
              const info = who(key);
              const free = !roster[key] && !mine[key];
              return (
                <button
                  key={half}
                  type="button"
                  className={'gv-shift' + info.cls}
                  data-testid={'shift-' + key}
                  disabled={!free && !mine[key]}
                  onClick={() => free && set({ shifts: { ...mine, [key]: 1 } })}
                >{info.label}</button>
              );
            })}
          </div>
        ))}
      </div>
      <p className="gv-d-note">{t('demoNote')}</p>
    </div>
  );
}
