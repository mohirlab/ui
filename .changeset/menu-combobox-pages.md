---
'@mohirlab/react': minor
---

New components real apps need:

- `Menu`, `MenuItem`, `MenuSeparator`, `MenuGroup`: actions behind a button, on the Popover API, with the WAI-ARIA menu button keyboard (arrows, Home, End, type-to-find; Escape and choosing return focus to the trigger).
- `Combobox`: a select you can type into, following the WAI-ARIA combobox pattern. Case-, accent- and apostrophe-insensitive filtering ("o'zb" finds "Oʻzbekiston"), match highlighting, optional descriptions, works inside `Field` and submits the chosen value with `name`.
- `Pagination` (and `pageRange`): a fixed number of slots so controls never shift; buttons or links (`href`); collapses to "Page 3 of 12" on phones; translatable labels.
- `Skeleton`: text lines, circles and blocks with a slow breathing pulse (still under reduced motion), hidden from assistive technology.
- `EmptyState`: icon seal, title, description and actions; `framed` for drop zones.
- `VisuallyHidden`: text for screen readers only, with `focusable` for skip links.
