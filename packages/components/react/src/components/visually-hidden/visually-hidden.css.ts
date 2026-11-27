import { style } from '@vanilla-extract/css';
import { declareLayers, inLayer } from '@mohirlab/themes';
import { srOnly } from '@mohirlab/recipes';

declareLayers();

export const visuallyHidden = style(inLayer('components', srOnly));

/** Hidden until focused: for "Skip to content" links. */
export const untilFocused = style(
  inLayer('components', {
    selectors: {
      '&:focus, &:focus-within': {
        position: 'static',
        width: 'auto',
        height: 'auto',
        margin: 0,
        overflow: 'visible',
        clip: 'auto',
        whiteSpace: 'normal',
      },
    },
  }),
);
