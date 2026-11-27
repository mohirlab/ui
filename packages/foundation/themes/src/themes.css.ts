import { createTheme, globalStyle } from '@vanilla-extract/css';
import { vars } from './contract.css';
import { declareLayers, layers } from './layers';
import { darkValues, lightValues } from './values';

declareLayers();

export const lightTheme = createTheme(vars, lightValues, 'light');
export const darkTheme = createTheme(vars, darkValues, 'dark');

/** Theme class names by mode. */
export const themes = { light: lightTheme, dark: darkTheme } as const;
export type ThemeMode = keyof typeof themes;

// A theme class is also a scope: it paints its own canvas and text, so a dark
// panel nested inside a light page (or the other way round) just works.
for (const [mode, className] of Object.entries(themes)) {
  globalStyle(`.${className}`, {
    '@layer': {
      [layers.theme]: {
        colorScheme: mode,
        backgroundColor: vars.color.canvas,
        color: vars.color.text,
        fontFamily: vars.font.family.sans,
        fontSize: vars.font.size.md,
        lineHeight: vars.font.leading.normal,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      },
    },
  });
  globalStyle(`.${className} ::selection`, {
    '@layer': { [layers.theme]: { backgroundColor: vars.color.selection, color: vars.color.text } },
  });
}

globalStyle(
  `:where(.${lightTheme}, .${darkTheme}) *, :where(.${lightTheme}, .${darkTheme}) *::before, :where(.${lightTheme}, .${darkTheme}) *::after`,
  {
    '@layer': { [layers.reset]: { boxSizing: 'border-box' } },
  },
);
