import { tr } from '@/gvpro/ui';
import { BASE44, SITE } from '@/gvpro/studio';

/* Small, on every page: whose app this is and what it was built on. The Base44 badge is part
   of the deal for a published app and stays visible, not tucked into an about screen. */
export default function Footer({ lang = 'he' }) {
  return (
    <footer className="gv-foot">
      <a href={SITE} target="_blank" rel="noopener noreferrer">{tr(lang, 'by')}</a>
      <a className="gv-badge" href={BASE44} target="_blank" rel="noopener noreferrer" data-testid="base44-badge">
        {tr(lang, 'builtOn')}
      </a>
    </footer>
  );
}
