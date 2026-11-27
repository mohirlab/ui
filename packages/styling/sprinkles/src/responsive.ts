import { breakpoint } from '@mohirlab/themes';

export const breakpoints = breakpoint;
export type Breakpoint = keyof typeof breakpoints;

/** Media query for "this breakpoint and up". Mobile-first. */
export const mq = (bp: Exclude<Breakpoint, 'mobile'>) => `screen and (min-width: ${breakpoints[bp]})`;

/** Sprinkles conditions, generated from the breakpoint tokens. */
export const responsiveConditions = {
  mobile: {},
  tablet: { '@media': mq('tablet') },
  desktop: { '@media': mq('desktop') },
  wide: { '@media': mq('wide') },
} as const;
