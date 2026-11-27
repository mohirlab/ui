import { style } from '@vanilla-extract/css';
import { declareLayers, inLayer, vars } from '@mohirlab/themes';

declareLayers();

export const wrap = style(inLayer('components', { position: 'relative', display: 'block', minWidth: 0 }));

/** Room on the right for the chevron; the rest of the look comes from the input recipe. */
export const select = style(
  inLayer('components', {
    paddingRight: vars.space['10'],
    cursor: 'pointer',
    textOverflow: 'ellipsis',
    selectors: { '&:disabled': { cursor: 'not-allowed' } },
  }),
);

export const chevron = style(
  inLayer('components', {
    position: 'absolute',
    right: vars.space['3'],
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: vars.color.textSubtle,
  }),
);
