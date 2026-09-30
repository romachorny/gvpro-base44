/* One accent at a time. The default is the blue of the flag, and the other five are there so a
   florist and a garage do not have to look like the same app. No gradients, no glow: the accent
   is a solid colour on buttons, on the selected chip and on the demo's own highlights.

   `ink` is what sits on top of the accent, because a mid-amber needs dark text and a navy
   needs white, and guessing that at render time is how contrast quietly goes wrong. */

export const COLOURS = [
  { id: 'blue', hex: '#0038B8', ink: '#FFFFFF', soft: '#EEF3FD', line: '#D6E2FA' },
  { id: 'teal', hex: '#0F766E', ink: '#FFFFFF', soft: '#ECF7F5', line: '#CFE8E4' },
  { id: 'green', hex: '#15803D', ink: '#FFFFFF', soft: '#EDF7F0', line: '#CFE7D7' },
  { id: 'violet', hex: '#6D28D9', ink: '#FFFFFF', soft: '#F3EFFD', line: '#DFD4F7' },
  { id: 'amber', hex: '#B45309', ink: '#FFFFFF', soft: '#FBF3EA', line: '#F0DEC7' },
  { id: 'rose', hex: '#BE123C', ink: '#FFFFFF', soft: '#FDEFF2', line: '#F6D3DB' },
];

export const DEFAULT_COLOUR = 'blue';

export function colourOf(id) {
  return COLOURS.find((c) => c.id === id) || COLOURS[0];
}

/* The three variables everything else reads. Set on the page, and again inside the phone, so
   the demo recolours the moment a swatch is tapped. */
export function colourVars(id) {
  const c = colourOf(id);
  return { '--acc': c.hex, '--acc-ink': c.ink, '--acc-soft': c.soft, '--acc-line': c.line };
}
