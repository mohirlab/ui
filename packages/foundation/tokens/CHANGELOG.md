# @mohirlab/tokens

## 0.2.0

### Minor Changes

- 5ebc147: Overlays and motion.

  - `Dialog` on the native `<dialog>` element: `placement` `auto` (bottom sheet on phones, centered from tablet up), `center` or `sheet`; drag a sheet down to dismiss; `role="alertdialog"` with `dismissible={false}` for decisions; `DialogBody` and `DialogActions`.
  - `ToastProvider` and `useToast()`: tones, an optional action, pause on hover and focus, polite announcements (danger interrupts), at most three on screen.
  - Hooks: `usePresence` (keep elements mounted until their exit animation ends) and `useDisclosure`.
  - New semantic token `color.scrim` (and `vars.color.scrim`) for the backdrop behind modals.
  - Requires `@mohirlab/motion` and its stylesheet: `import '@mohirlab/motion/styles.css'`.

## 0.1.1

### Patch Changes

- 3c2772d: First release published from GitHub Actions through npm trusted publishing, with provenance. `publishConfig` no longer sets `provenance`: trusted publishing adds it automatically.
