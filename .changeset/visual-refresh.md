---
'@mohirlab/tokens': minor
'@mohirlab/themes': minor
'@mohirlab/recipes': minor
'@mohirlab/react': minor
'@mohirlab/assets': patch
---

Visual refresh: modern, calm surfaces that keep the Mohirlab identity.

**Breaking:**

- Shadow tokens `lip` and `lipPressed` are replaced by `control` (`vars.shadow.control`).
- `keycap` in `@mohirlab/recipes` is replaced by `pressable`: a soft lift and a subtle press-in.

**Visual:**

- Radii 4/8/12/16/24; softer, more diffuse shadows; weights 600/680.
- Buttons are flat with a soft lift. Outline buttons and inputs have a uniform hairline border; inputs get a soft focus halo.
- Badges are sentence-case pills that keep the square seal.
- `Text variant="label"` is a sans eyebrow; mono is for code only.
- The sheet grab handle is a pill. Generated avatar initials are set in the sans face.
