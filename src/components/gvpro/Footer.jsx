import { tr } from '@/gvpro/ui';
import { BASE44, BRAND, SITE, WATERMARK } from '@/gvpro/studio';

/* On every page, home and admin alike: whose app this is, and what it was built on.
   The Base44 badge is part of the deal for a published app and stays visible, not tucked
   into an about screen. */
export default function Footer({ lang = 'en' }) {
  return (
    <footer className="gv-foot">
      <a href={SITE} target="_blank" rel="noopener noreferrer">{BRAND}</a>
      <span>{WATERMARK}</span>
      <a className="gv-badge" href={BASE44} target="_blank" rel="noopener noreferrer" data-testid="base44-badge">
        {tr(lang, 'builtOn')}
      </a>
    </footer>
  );
}
