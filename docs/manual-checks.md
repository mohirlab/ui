# Manual checks: a real phone and a screen reader

Automated tests cover a lot: unit tests for roles and keyboard handling, and screenshots in
Chromium, Firefox and WebKit. They can't tell you what a screen reader actually says, how
a real phone's keyboard and safe areas behave, or whether something feels right under a
thumb. This checklist covers those gaps. One pass takes about an hour.

Do a pass before a minor release that adds or changes components, and whenever a change
touches focus, keyboard handling, overlays or the mobile layout.

**Where:** everything runs on the deployed Storybook and example sites:

- Storybook: <https://mohirlab.github.io/ui/>
- Example sites: <https://mohirlab.github.io/ui/examples/> (Daftar has the most components)

**Reporting:** open an issue named "Manual check, <date>" listing the setup (device, OS,
browser, screen reader and versions). For every check that fails, write what you did, what
you expected and what happened. A single line per check is enough.

---

## Part 1: screen reader on a computer (about 30 minutes)

### Setup

Windows: install **NVDA** (free) from nvaccess.org and use Chrome or Firefox. macOS:
**VoiceOver** is built in (Cmd+F5) and works best with Safari.

The keys you need in NVDA ("NVDA" means Insert, or Caps Lock if you chose that):

| Key             | Does                                           |
| --------------- | ---------------------------------------------- |
| Tab / Shift+Tab | Next / previous control                        |
| Down arrow      | Read the next line (browse mode)               |
| NVDA+Space      | Switch between browse mode and focus mode      |
| H / Shift+H     | Next / previous heading                        |
| D               | Next landmark (navigation, main…)              |
| T               | Next table; Ctrl+Alt+arrows move between cells |
| Ctrl            | Stop speaking                                  |
| NVDA+F7         | List of links, headings and landmarks          |

Turn the monitor off or look away for some checks: the point is to find out whether the
page makes sense **by ear alone**.

### Checks

Each line: **do** → **expect**.

**Buttons and forms** (Storybook: Components / Button, Forms, Form controls)

- [ ] Tab to a loading Button → it's announced as busy or unavailable, and Enter does
      nothing.
- [ ] Tab into an Input inside a Field with a hint → the label is read, then the hint.
- [ ] Same with an error → "invalid" (or "invalid entry") and the error text are read.
- [ ] Checkbox with a description → the name is only the label; the description is read
      after it, not as part of the name.
- [ ] Indeterminate checkbox → announced as "half checked" or "mixed".
- [ ] RadioGroup → the group name is read on entry; arrows move and select;
      "1 of 3" style position is read.
- [ ] Switch → announced as a switch (or toggle button) with on/off; Space toggles it.
- [ ] Slider → the value is read; arrows change it and each new value is read.
- [ ] Select → the system list opens; the chosen option is read.

**Overlays** (Components / Overlays, Popover & Tooltip, Menu & Combobox)

- [ ] Open a Dialog → its title is read; focus is inside it; Tab can't leave it; Escape
      closes it and focus returns to the button that opened it.
- [ ] Open a Popover → the trigger is announced as expanded; focus can reach the controls
      inside; Escape closes it.
- [ ] Focus a button with a Tooltip → the tooltip text is read as its description.
- [ ] Toast (Overlays story) → the message is read without moving focus.
- [ ] Menu: focus the trigger → announced as a menu button / "has popup". Press Enter or
      Down → "menu" and the first item are read. Arrows move. Typing "d" jumps to
      "Duplicate". A disabled item is read as unavailable. Escape closes it and focus is
      back on the trigger.
- [ ] Combobox: focus it → announced as a combo box (or editable combo box) with its
      label, collapsed. Type "eng" → expanded, and the active option is read as you press
      Down ("Jerome Bell, Engineering"). Enter chooses it and the field reads the new
      value. Type "zzz" → "No matches" is read.

**Navigation and structure** (Components / Navigation, Accordion & Table, Loading, empty & pages)

- [ ] Tabs → "tab, 1 of 4, selected"; arrows move between tabs; Tab moves into the panel.
- [ ] SegmentedControl → read as a radio group with its name.
- [ ] Breadcrumbs → a navigation landmark named "Breadcrumb"; the last item is read as the
      current page.
- [ ] Accordion → each item is a button that's expanded or collapsed; Enter toggles it.
- [ ] Table → T jumps to it, the caption is read; moving between cells reads the column
      header.
- [ ] Pagination → a navigation landmark named "Pagination"; the current page is read as
      current; "Previous" on page 1 is read as unavailable.
- [ ] EmptyState → its title is a heading (H finds it).
- [ ] Skeleton (Loading story) → the placeholders are **not** read one by one.

**Example site** (examples / Daftar)

- [ ] NVDA+F7 → headings and landmarks give an outline of the page that makes sense.
- [ ] Invoice table → the last column header is read as "Actions"; each "…" button is read
      as "Actions for #2041" and so on, not just "button".
- [ ] Change page with Pagination → nothing confusing happens: focus stays on the page
      button you pressed.

---

## Part 2: a real phone (about 30 minutes)

Use the phone you have. If you can, do the run once on iPhone (Safari) and once on Android
(Chrome). Open the example sites on the phone, not an emulator.

### Touch and layout

- [ ] Karvon: the bottom navigation sits **above** the home indicator / gesture bar, never
      under it. Rotate the phone to landscape: the content clears the notch on both sides.
- [ ] All tap targets are easy to hit with a thumb: bottom nav items, Tabs, Pagination,
      menu items, Checkbox, Switch, the "…" row buttons in Daftar.
- [ ] Buttons press in slightly when tapped and nothing flickers.
- [ ] Daftar's invoice table scrolls sideways with the invoice number column staying put.
- [ ] Pagination shows "Page 1 of 9" between Previous and Next.
- [ ] Breadcrumbs (Storybook, Navigation) show a single "← Parent" link.
- [ ] No page scrolls sideways as a whole (the table should be the only thing that does).

### Keyboard, overlays and safe areas

- [ ] Tap an Input: the page zooms **not at all** (iOS zooms into fields with text below
      16px) and the field isn't hidden behind the keyboard.
- [ ] Combobox (Daftar settings, Country): tap, type "o'z" with the phone keyboard's own
      apostrophe → Uzbekistan is offered; tap it to choose; the list closes and the keyboard
      can be dismissed.
- [ ] Dialog on a phone opens as a bottom sheet; its buttons clear the home indicator;
      swiping or tapping outside behaves as expected; the page behind doesn't scroll.
- [ ] Toasts appear above the home indicator, not under it.
- [ ] Menu ("…" in the Daftar table): opens next to the button, fully on screen (it flips
      above when near the bottom); tapping outside closes it.
- [ ] Popover near the screen edge stays fully on screen.
- [ ] Select opens the phone's own picker.

### Phone screen reader (10 minutes, optional but valuable)

VoiceOver (iPhone: Settings › Accessibility › VoiceOver, or triple-click the side button
if set up) or TalkBack (Android: Settings › Accessibility). Swipe right/left moves between
items, double-tap activates.

- [ ] Karvon bottom nav: each item is read with its name; the current one is read as
      selected or current; the badge count is part of the name ("Alerts, 3").
- [ ] Open and close a Dialog sheet; focus starts inside it and returns afterwards.
- [ ] Use the Combobox and a Menu with swipes and double-taps only.

### Settings that change things

- [ ] Turn on **Reduce motion** (iOS: Accessibility › Motion; Android: Remove animations)
      → overlays fade instead of sliding; skeletons stop pulsing.
- [ ] Turn on **dark mode** → everything follows (the example sites start in the system
      mode), text stays readable, nothing is lost against the dark background.
- [ ] Turn on **larger text** (the largest size short of the accessibility sizes) → text
      grows; nothing overlaps or gets cut off; buttons grow with their labels.

---

## After the pass

File the report issue. Bugs found get their own issues (label `bug`) linked from the
report, so they can be fixed and verified one by one. If a check turned out to be wrong or
unclear, fix this file in the same pull request as the bug fix.
