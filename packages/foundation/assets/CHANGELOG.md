# @mohirlab/assets

## 0.2.0

### Minor Changes

- daf62fa: Lighter imagery. The palettes now bottom out at a mid-tone instead of near-black, so artwork reads airy on the page. Initials avatars are light tiles with lettering in the palette's deep ink, which meets WCAG AA (4.5:1) on both the tile and the star texture; a test enforces it for every palette. New export: `paletteInk`.

### Patch Changes

- 03ea4b9: Tilework artwork uses smaller tiles, so large images read as a texture instead of a few oversized stars.
- f47477e: Visual refresh: modern, calm surfaces that keep the Mohirlab identity.

  **Breaking:**

  - Shadow tokens `lip` and `lipPressed` are replaced by `control` (`vars.shadow.control`).
  - `keycap` in `@mohirlab/recipes` is replaced by `pressable`: a soft lift and a subtle press-in.

  **Visual:**

  - Radii 4/8/12/16/24; softer, more diffuse shadows; weights 600/680.
  - Buttons are flat with a soft lift. Outline buttons and inputs have a uniform hairline border; inputs get a soft focus halo.
  - Badges are sentence-case pills that keep the square seal.
  - `Text variant="label"` is a sans eyebrow; mono is for code only.
  - The sheet grab handle is a pill. Generated avatar initials are set in the sans face.

- Updated dependencies [f47477e]
  - @mohirlab/tokens@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [5ebc147]
  - @mohirlab/tokens@0.2.0

## 0.1.1

### Patch Changes

- 3c2772d: First release published from GitHub Actions through npm trusted publishing, with provenance. `publishConfig` no longer sets `provenance`: trusted publishing adds it automatically.
- Updated dependencies [3c2772d]
  - @mohirlab/tokens@0.1.1
