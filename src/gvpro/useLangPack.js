import { useEffect, useState } from 'react';
import { ensureLang, langReady, onLangPack } from './engine.js';

/* Ask for the language pack and re-render once it is in.
   Anything that reads the engine's own copy — a price list, a tab's word, a style's name —
   has to call this, or it will print whatever English it read before the pack arrived and
   never correct itself. */
export function useLangPack(lang) {
  const [, bump] = useState(0);

  useEffect(() => {
    let live = true;
    const off = onLangPack(() => { if (live) bump((n) => n + 1); });
    ensureLang(lang);
    return () => { live = false; off(); };
  }, [lang]);

  return langReady(lang);
}
