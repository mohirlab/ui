import type { StyleRule } from '@vanilla-extract/css';
import { inLayer } from '@mohirlab/themes';
import { recipe } from '@vanilla-extract/recipes';

type VariantGroups = Record<string, Record<string, StyleRule>>;
type BooleanMap<T> = T extends 'true' | 'false' ? boolean : T;
type VariantSelection<V extends VariantGroups> = { [K in keyof V]?: BooleanMap<keyof V[K]> };

export interface ComponentRecipeOptions<V extends VariantGroups> {
  base?: StyleRule;
  variants?: V;
  compoundVariants?: Array<{ variants: VariantSelection<V>; style: StyleRule }>;
  defaultVariants?: VariantSelection<V>;
}

const layer = (rule: StyleRule) => inLayer('components', rule);

/**
 * `recipe()` with every generated rule placed in the `ml-components` cascade
 * layer, so sprinkles utilities and unlayered app styles always win over
 * component defaults, without specificity tricks. Call it inside `.css.ts`.
 */
export function componentRecipe<V extends VariantGroups = {}>(options: ComponentRecipeOptions<V>) {
  const variants = Object.fromEntries(
    Object.entries(options.variants ?? {}).map(([group, values]) => [
      group,
      Object.fromEntries(Object.entries(values).map(([name, rule]) => [name, layer(rule)])),
    ]),
  ) as V;

  return recipe({
    base: options.base ? layer(options.base) : undefined,
    variants,
    compoundVariants: options.compoundVariants?.map((c) => ({ ...c, style: layer(c.style) })) as never,
    defaultVariants: options.defaultVariants as never,
  });
}
