import { globalLayer, type StyleRule } from '@vanilla-extract/css';

/**
 * Cascade layer order for the whole ecosystem. Later layers win.
 * Consumer styles that are not in a layer beat all of them, which is
 * exactly what an app override should do.
 */
export const layers = {
  reset: 'ml-reset',
  theme: 'ml-theme',
  components: 'ml-components',
  utilities: 'ml-utilities',
} as const;

export type LayerName = keyof typeof layers;

/**
 * Declare the layer order. Call this at the top of every `.css.ts` entry that
 * emits styles: whichever stylesheet loads first fixes the order, and every
 * package declares the same order, so load order between packages never matters.
 * Must be called while a Vanilla Extract file scope is active (inside `.css.ts`).
 */
export function declareLayers(): void {
  for (const name of Object.values(layers)) globalLayer(name);
}

/** Wrap a style rule in one of the Mohirlab layers. */
export function inLayer(layer: LayerName, rule: StyleRule): StyleRule {
  return { '@layer': { [layers[layer]]: rule } } as StyleRule;
}
