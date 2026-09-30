/* The drawn signs, copied from app.genvidpro.com. A trade is a picture, not a word:
   five of them fit one row in every language, which five words never did. */

function Svg({ children }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{children}</svg>;
}

export const NicheIcon = {
  barber: () => (
    <Svg>
      <circle cx="6.2" cy="17.4" r="2.5" />
      <circle cx="17.8" cy="17.4" r="2.5" />
      <path d="M8 15.6 19.4 4.2M16 15.6 4.6 4.2" />
    </Svg>
  ),
  clinic: () => (
    <Svg>
      <path d="M12 6.1C10.6 4.9 8 4.3 6.5 5.6 5.2 6.7 4.9 8.9 5.3 11c.4 2.3.9 3.8 1.2 6 .3 1.7.6 3 1.6 3 1.1 0 1.3-1.4 1.6-3 .2-1.2.4-2.4 1.9-2.4s1.7 1.2 1.9 2.4c.3 1.6.5 3 1.6 3 1 0 1.3-1.3 1.6-3 .3-2.2.8-3.7 1.2-6 .4-2.1.1-4.3-1.2-5.4C16.2 4.3 13.6 4.9 12 6.1Z" />
    </Svg>
  ),
  bakery: () => (
    <Svg>
      <path d="M3.6 13.8C3.6 10 7.4 7.6 12 7.6s8.4 2.4 8.4 6.2v2.1c0 .7-.6 1.3-1.3 1.3H4.9c-.7 0-1.3-.6-1.3-1.3Z" />
      <path d="M8.4 10.7 6.9 13.2M12.2 10.3l-1.5 2.9M16 10.7l-1.5 2.5" />
    </Svg>
  ),
  yoga: () => (
    <Svg>
      <path d="M12 3.6c1.7 1.9 2.5 3.8 2.5 5.9 0 1.4-.8 2.6-2.5 3.5-1.7-.9-2.5-2.1-2.5-3.5 0-2.1.8-4 2.5-5.9Z" />
      <path d="M4.4 9.4c2.3.6 3.9 1.6 4.8 3 .8 1.2.7 2.5-.2 4-1.8-.3-3.1-1-3.9-2.1-.8-1.3-1-3-.7-4.9Z" />
      <path d="M19.6 9.4c-2.3.6-3.9 1.6-4.8 3-.8 1.2-.7 2.5.2 4 1.8-.3 3.1-1 3.9-2.1.8-1.3 1-3 .7-4.9Z" />
      <path d="M4.2 16.6c2 2.1 4.7 3.2 7.8 3.2s5.8-1.1 7.8-3.2" />
    </Svg>
  ),
  garage: () => (
    <Svg>
      <path d="M3.8 16.4v-2.7l2.1-4.3c.3-.6.9-1 1.6-1h9c.7 0 1.3.4 1.6 1l2.1 4.3v2.7" />
      <path d="M6.4 13.5h11.2" />
      <circle cx="7.6" cy="16.9" r="1.7" />
      <circle cx="16.4" cy="16.9" r="1.7" />
    </Svg>
  ),
};

export const ShareIcon = () => (
  <Svg>
    <circle cx="18" cy="5.5" r="2.6" /><circle cx="6" cy="12" r="2.6" /><circle cx="18" cy="18.5" r="2.6" />
    <path d="M8.3 10.7 15.7 6.8M8.3 13.3l7.4 3.9" />
  </Svg>
);

export const GlobeIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.2 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.2-3.3-8.5S9.8 5.9 12 3.5Z" />
  </Svg>
);

export const ArrowIcon = ({ back }) => (
  <Svg>{back ? <path d="M15 5 8 12l7 7" /> : <path d="M9 5l7 7-7 7" />}</Svg>
);

export const CloseIcon = () => (<Svg><path d="M6 6l12 12M18 6 6 18" /></Svg>);
