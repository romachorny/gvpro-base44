import { DEMO, pick } from '@/gvpro/jobs';
import { tr } from '@/gvpro/ui';

/* A menu is read, not ordered from: sections, dishes, and one line about each once you tap it.
   That line is the whole reason a restaurant wants this instead of a photographed page. */
export default function MenuView({ lang, state, set }) {
  const t = (k) => tr(lang, k);
  const open = state.dish;

  return (
    <div data-testid="demo-menu">
      {DEMO.menu.sections.map((sec) => (
        <div key={sec.id}>
          <p className="gv-d-h">{pick(sec.title, lang)}</p>
          <ul className="gv-d-list">
            {sec.items.map((d, i) => (
              <li key={d.id}>
                <button
                  type="button"
                  className="gv-d-row"
                  aria-pressed={open === d.id}
                  data-testid={'dish-' + sec.id + '-' + i}
                  onClick={() => set({ dish: open === d.id ? '' : d.id })}
                >
                  <span className="gv-d-nm">
                    {pick(d.name, lang)}
                    {open === d.id && d.note ? <em style={{ whiteSpace: 'normal' }}>{pick(d.note, lang)}</em> : null}
                  </span>
                  <b>{'₪' + d.price}</b>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="gv-d-note">{t('menuNote')}</p>
      <p className="gv-d-note">{t('demoNote')}</p>
    </div>
  );
}
