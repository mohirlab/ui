---
'@mohirlab/react': minor
---

Form controls on native elements, styled in the Mohirlab look:

- `Checkbox` (with `indeterminate`), `Switch` (`role="switch"`), and `RadioGroup` + `Radio` (a fieldset with a legend; arrow keys work natively). Each has a `label` and an optional `description`, linked with `aria-describedby` and kept out of the accessible name. Rows are at least 44px tall on touch screens.
- `Select`: the native `<select>` styled like `Input`, with a `placeholder`. Phones get the system picker.
- `Textarea`: grows with its content up to `maxRows` where CSS `field-sizing` is supported; elsewhere it is resizable.
- `Slider`: a native range input with a filled track, `format` for `aria-valuetext`, and `SliderValue` for showing the value.
- `Select`, `Textarea` and `Slider` pick up `Field` (label, hint, error, required, disabled) like `Input` does.
- Fix: `<select>` no longer picks up the read-only input style.
