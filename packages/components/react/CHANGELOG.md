# @mohirlab/react

## 0.6.0

### Minor Changes

- 397869b: `Accordion`/`AccordionItem` on native `<details>`/`<summary>`: keyboard support, semantics and find-in-page come from the browser. `type="single"` lets only one item open at a time, through the `name` attribute.

  `Table`, `Th`, `Td`: a semantic table in a scroll container that becomes a named, focusable region only when it actually scrolls. `density`, sticky header (with `maxHeight`), sticky first column, `numeric` cells (right-aligned, tabular figures), and a hideable caption that still names the table.

## 0.5.0

### Minor Changes

- ef2c0d2: Navigation, plus safe-area values:

  - `Tabs`, `TabList`, `Tab`, `TabPanel`: the WAI-ARIA tabs pattern. Roving tabindex; arrow keys (right-to-left aware), Home and End with automatic activation; disabled tabs are skipped; panels are linked both ways. The tab list scrolls sideways on phones.
  - `SegmentedControl`: one choice from a few short options, built on native radios. `fullWidth`, icons and disabled options.
  - `BottomNav`, `BottomNavItem`, `BottomNavSpacer`: the phone tab bar. Fixed and clear of the home indicator, with `aria-current` and an optional badge whose count is part of the accessible name. Hidden from tablet (or desktop) up.
  - `Breadcrumbs`: `nav` + `ol` with `aria-current="page"`. Below tablet width it collapses to a back link to the parent.
  - `@mohirlab/themes` exports `safeArea` (`env(safe-area-inset-*)` with 0 fallbacks) and `withSafeArea()`. Dialog sheets, toasts and the bottom nav use them.

### Patch Changes

- Updated dependencies [ef2c0d2]
  - @mohirlab/themes@0.4.0
  - @mohirlab/motion@0.1.3
  - @mohirlab/sprinkles@0.1.4

## 0.4.0

### Minor Changes

- 883df49: Form controls on native elements, styled in the Mohirlab look:

  - `Checkbox` (with `indeterminate`), `Switch` (`role="switch"`), and `RadioGroup` + `Radio` (a fieldset with a legend; arrow keys work natively). Each has a `label` and an optional `description`, linked with `aria-describedby` and kept out of the accessible name. Rows are at least 44px tall on touch screens.
  - `Select`: the native `<select>` styled like `Input`, with a `placeholder`. Phones get the system picker.
  - `Textarea`: grows with its content up to `maxRows` where CSS `field-sizing` is supported; elsewhere it is resizable.
  - `Slider`: a native range input with a filled track, `format` for `aria-valuetext`, and `SliderValue` for showing the value.
  - `Select`, `Textarea` and `Slider` pick up `Field` (label, hint, error, required, disabled) like `Input` does.
  - Fix: `<select>` no longer picks up the read-only input style.

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
