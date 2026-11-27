# @mohirlab/themes

## 0.4.0

### Minor Changes

- ef2c0d2: Navigation, plus safe-area values:

  - `Tabs`, `TabList`, `Tab`, `TabPanel`: the WAI-ARIA tabs pattern. Roving tabindex; arrow keys (right-to-left aware), Home and End with automatic activation; disabled tabs are skipped; panels are linked both ways. The tab list scrolls sideways on phones.
  - `SegmentedControl`: one choice from a few short options, built on native radios. `fullWidth`, icons and disabled options.
  - `BottomNav`, `BottomNavItem`, `BottomNavSpacer`: the phone tab bar. Fixed and clear of the home indicator, with `aria-current` and an optional badge whose count is part of the accessible name. Hidden from tablet (or desktop) up.
  - `Breadcrumbs`: `nav` + `ol` with `aria-current="page"`. Below tablet width it collapses to a back link to the parent.
  - `@mohirlab/themes` exports `safeArea` (`env(safe-area-inset-*)` with 0 fallbacks) and `withSafeArea()`. Dialog sheets, toasts and the bottom nav use them.

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

- Updated dependencies [f47477e]
  - @mohirlab/tokens@0.3.0

## 0.2.0

### Minor Changes

- 5ebc147: Overlays and motion.

  - `Dialog` on the native `<dialog>` element: `placement` `auto` (bottom sheet on phones, centered from tablet up), `center` or `sheet`; drag a sheet down to dismiss; `role="alertdialog"` with `dismissible={false}` for decisions; `DialogBody` and `DialogActions`.
  - `ToastProvider` and `useToast()`: tones, an optional action, pause on hover and focus, polite announcements (danger interrupts), at most three on screen.
  - Hooks: `usePresence` (keep elements mounted until their exit animation ends) and `useDisclosure`.
  - New semantic token `color.scrim` (and `vars.color.scrim`) for the backdrop behind modals.
  - Requires `@mohirlab/motion` and its stylesheet: `import '@mohirlab/motion/styles.css'`.

### Patch Changes

- Updated dependencies [5ebc147]
  - @mohirlab/tokens@0.2.0

## 0.1.1

### Patch Changes

- 3c2772d: First release published from GitHub Actions through npm trusted publishing, with provenance. `publishConfig` no longer sets `provenance`: trusted publishing adds it automatically.
- Updated dependencies [3c2772d]
  - @mohirlab/tokens@0.1.1
