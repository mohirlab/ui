---
'@mohirlab/react': minor
'@mohirlab/themes': minor
---

Navigation, plus safe-area values:

- `Tabs`, `TabList`, `Tab`, `TabPanel`: the WAI-ARIA tabs pattern. Roving tabindex; arrow keys (right-to-left aware), Home and End with automatic activation; disabled tabs are skipped; panels are linked both ways. The tab list scrolls sideways on phones.
- `SegmentedControl`: one choice from a few short options, built on native radios. `fullWidth`, icons and disabled options.
- `BottomNav`, `BottomNavItem`, `BottomNavSpacer`: the phone tab bar. Fixed and clear of the home indicator, with `aria-current` and an optional badge whose count is part of the accessible name. Hidden from tablet (or desktop) up.
- `Breadcrumbs`: `nav` + `ol` with `aria-current="page"`. Below tablet width it collapses to a back link to the parent.
- `@mohirlab/themes` exports `safeArea` (`env(safe-area-inset-*)` with 0 fallbacks) and `withSafeArea()`. Dialog sheets, toasts and the bottom nav use them.
