# @mohirlab/recipes

## 0.2.1

### Patch Changes

- Updated dependencies [ef2c0d2]
  - @mohirlab/themes@0.4.0

## 0.2.0

### Minor Changes

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

### Patch Changes

- Updated dependencies [f47477e]
  - @mohirlab/themes@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [5ebc147]
  - @mohirlab/themes@0.2.0

## 0.1.1

### Patch Changes

- 3c2772d: First release published from GitHub Actions through npm trusted publishing, with provenance. `publishConfig` no longer sets `provenance`: trusted publishing adds it automatically.
- Updated dependencies [3c2772d]
  - @mohirlab/themes@0.1.1
