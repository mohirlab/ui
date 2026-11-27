---
'@mohirlab/react': patch
---

Mobile fixes found while writing the manual check list:

- Fields no longer make iOS Safari zoom the page: on touch screens, `Input`, `Textarea`, `Select` (and `Combobox`) text is at least 16px. Mouse and keyboard users keep the smaller sizes.
- An open modal `Dialog` (and the phone bottom sheet) now stops the page behind it from scrolling; the scrollbar's space is kept so nothing shifts on desktop.
