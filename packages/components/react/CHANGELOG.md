# @mohirlab/react

## 0.3.0

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

- Updated dependencies [03ea4b9]
- Updated dependencies [daf62fa]
- Updated dependencies [f47477e]
  - @mohirlab/assets@0.2.0
  - @mohirlab/themes@0.3.0
  - @mohirlab/sprinkles@0.1.3
  - @mohirlab/motion@0.1.2

## 0.2.0

### Minor Changes

- 5ebc147: Overlays and motion.

  - `Dialog` on the native `<dialog>` element: `placement` `auto` (bottom sheet on phones, centered from tablet up), `center` or `sheet`; drag a sheet down to dismiss; `role="alertdialog"` with `dismissible={false}` for decisions; `DialogBody` and `DialogActions`.
  - `ToastProvider` and `useToast()`: tones, an optional action, pause on hover and focus, polite announcements (danger interrupts), at most three on screen.
  - Hooks: `usePresence` (keep elements mounted until their exit animation ends) and `useDisclosure`.
  - New semantic token `color.scrim` (and `vars.color.scrim`) for the backdrop behind modals.
  - Requires `@mohirlab/motion` and its stylesheet: `import '@mohirlab/motion/styles.css'`.

- 81aa4db: `Popover` and `Tooltip`, built on the native Popover API and CSS anchor positioning: no JavaScript positioning. Popovers light-dismiss, close on Escape and flip at viewport edges; tooltips show on hover (after a delay) and on focus, hide on Escape, and describe their trigger with `aria-describedby`. `placement` takes `top`, `bottom`, `start` and `end`, plus `-start`/`-end` alignments.

### Patch Changes

- Updated dependencies [5ebc147]
  - @mohirlab/themes@0.2.0
  - @mohirlab/motion@0.1.1
  - @mohirlab/sprinkles@0.1.2
  - @mohirlab/assets@0.1.2

## 0.1.1

### Patch Changes

- 3c2772d: First release published from GitHub Actions through npm trusted publishing, with provenance. `publishConfig` no longer sets `provenance`: trusted publishing adds it automatically.
- Updated dependencies [3c2772d]
  - @mohirlab/icons@0.1.1
  - @mohirlab/assets@0.1.1
  - @mohirlab/themes@0.1.1
  - @mohirlab/sprinkles@0.1.1
