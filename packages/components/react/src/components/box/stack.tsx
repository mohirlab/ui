import type { Sprinkles } from '@mohirlab/sprinkles';
import { Box, type BoxProps } from './box';

export interface StackProps extends Omit<
  BoxProps,
  'display' | 'flexDirection' | 'alignItems' | 'justifyContent' | 'flexWrap'
> {
  /** `column` stacks vertically (default), `row` lays out inline. Responsive. */
  direction?: Sprinkles['flexDirection'];
  align?: Sprinkles['alignItems'];
  justify?: Sprinkles['justifyContent'];
  wrap?: boolean;
}

/** Flex layout with token gaps. */
export function Stack({ direction = 'column', align, justify, wrap, gap = '3', ...rest }: StackProps) {
  return (
    <Box
      display="flex"
      flexDirection={direction}
      alignItems={align}
      justifyContent={justify}
      flexWrap={wrap ? 'wrap' : undefined}
      gap={gap}
      {...rest}
    />
  );
}
