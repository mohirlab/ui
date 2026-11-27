import { createVar, style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';

declareLayers();

const { color } = vars;

/** How far the track is filled, 0%–100%. Set from the value. */
export const fill = createVar();

const trackFill = `linear-gradient(to right, ${color.accent} ${fill}, color-mix(in oklch, ${color.border}, ${color.text} 8%) ${fill})`;
const thumb = {
  width: '1.25rem',
  height: '1.25rem',
  borderRadius: '50%',
  backgroundColor: color.onAccent,
  border: `2px solid ${color.accent}`,
  boxShadow: vars.shadow.control,
  cursor: 'grab',
} as const;

export const slider = style(
  inLayer('components', {
    vars: { [fill]: '50%' },
    appearance: 'none',
    display: 'block',
    width: '100%',
    height: '1.25rem',
    margin: 0,
    background: 'transparent',
    cursor: 'pointer',
    outline: 'none',
    // Touch screens: a taller hit area without a taller look.
    '@media': { '(pointer: coarse)': { height: '2.75rem' } },
    selectors: {
      '&::-webkit-slider-runnable-track': {
        height: '0.375rem',
        borderRadius: '999px',
        background: trackFill,
      },
      '&::-moz-range-track': { height: '0.375rem', borderRadius: '999px', background: trackFill },
      '&::-webkit-slider-thumb': { ...thumb, appearance: 'none', marginTop: '-0.4375rem' },
      '&::-moz-range-thumb': thumb,
      '&:active::-webkit-slider-thumb': { cursor: 'grabbing' },
      '&:focus-visible::-webkit-slider-thumb': {
        boxShadow: `0 0 0 2px ${color.canvas}, 0 0 0 4px ${color.focus}`,
      },
      '&:focus-visible::-moz-range-thumb': {
        boxShadow: `0 0 0 2px ${color.canvas}, 0 0 0 4px ${color.focus}`,
      },
      '&:disabled': { cursor: 'not-allowed', opacity: 0.5 },
    },
  }),
);

export const header = style(
  inLayer('components', {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: vars.space['3'],
  }),
);
export const output = style(
  inLayer('components', {
    fontSize: vars.font.size.sm,
    fontWeight: vars.font.weight.strong,
    fontVariantNumeric: 'tabular-nums',
    color: color.text,
  }),
);
