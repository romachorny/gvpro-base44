import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, House, LayoutDashboard, LayoutGrid, ShoppingBag, UtensilsCrossed, Users } from 'lucide-react';
import { JOB_TAB } from '@/gvpro/jobs';
import { colourVars } from '@/gvpro/theme';
import { tr } from '@/gvpro/ui';
import HomeView from './demo/HomeView';
import BookingView from './demo/BookingView';
import OrdersView from './demo/OrdersView';
import MenuView from './demo/MenuView';
import CatalogueView from './demo/CatalogueView';
import TeamView from './demo/TeamView';
import OwnerView from './demo/OwnerView';

/* The business's own app, running. Not a picture of one: the slots really fill, the basket
   really counts, and what the visitor does on the customer tab shows up on the owner tab.
   Three tabs — the business, the job it hired the app for, and the owner's own screen.

   The accent is set again here as CSS variables, so a swatch on the page recolours the demo
   in the same paint as the page itself and there is never a second source of truth. */

const JOB_ICON = {
  booking: CalendarDays, orders: ShoppingBag, menu: UtensilsCrossed, catalogue: LayoutGrid, team: Users,
};

/* Seven days from today, so "today" is really today and the week strip never looks stale. */
function weekFrom(now) {
  const out = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    out.push({ dow: d.getDay(), date: d.getDate() });
  }
  return out;
}

export default function PhoneApp({ name, job, colour, lang, tab, onTab }) {
  const [day, setDay] = useState(0);
  const [state, setState] = useState({});
  const [done, setDone] = useState('');
  const [mine, setMine] = useState([]);
  const week = useMemo(() => weekFrom(new Date()), []);
  const t = (k) => tr(lang, k);

  /* A change of job throws the demo away: four croissants make no sense on a shift board. */
  useEffect(() => { setState({}); setDone(''); setMine([]); setDay(0); }, [job]);

  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  /* what the customer just did, in one line, for the confirmation and for the owner's screen */
  function finish(line, extra) {
    setDone(line);
    setMine((m) => [{ line, amount: (extra && extra.amount) || 0 }, ...m]);
  }

  const JobIcon = JOB_ICON[job] || CalendarDays;
  const jobTab = JOB_TAB[job] || 'book';
  const tabs = [
    { id: 'home', label: t('tabHome'), Icon: House },
    { id: 'job', label: t('tab_' + jobTab), Icon: JobIcon },
    { id: 'owner', label: t('tabOwner'), Icon: LayoutDashboard },
  ];

  const shared = { lang, state, set, onDone: finish, done };
  const views = {
    booking: <BookingView {...shared} week={week} day={day} setDay={setDay} />,
    orders: <OrdersView {...shared} />,
    menu: <MenuView lang={lang} state={state} set={set} />,
    catalogue: <CatalogueView {...shared} />,
    team: <TeamView lang={lang} week={week} state={state} set={set} />,
  };

  return (
    <div className="gv-phone" style={colourVars(colour)} data-testid="phone">
      <div className="gv-screen">
        <div className="gv-screen-hd">
          <b data-testid="phone-name">{name}</b>
          <span>{t('tab_' + jobTab)}</span>
        </div>

        <div className="gv-screen-body" data-testid="phone-body">
          {tab === 'home' ? <HomeView lang={lang} name={name} /> : null}
          {tab === 'job' ? views[job] : null}
          {tab === 'owner' ? <OwnerView lang={lang} job={job} mine={mine} /> : null}
        </div>

        <nav className="gv-tabbar" data-testid="phone-tabs">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={tab === id}
              data-testid={'tab-' + id}
              onClick={() => { if (id === 'job' && done) setDone(''); onTab(id); }}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
