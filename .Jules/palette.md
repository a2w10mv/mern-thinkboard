## 2024-05-24 - Accessibility improvements for icon-only buttons
**Learning:** Found a pattern of missing ARIA labels on icon-only buttons in NoteCard and TodoCard components, affecting screen reader users.
**Action:** Always verify icon-only buttons have descriptive `aria-label` attributes.

## 2026-11-02 - Responsive text hiding removes accessible name
**Learning:** When using Tailwind utility classes like `hidden sm:inline` to hide text on mobile devices (creating an icon-only button visually), the accessible name is also removed for screen readers. The `hidden` class applies `display: none`, making the text completely invisible to assistive technologies on smaller viewports.
**Action:** Whenever using responsive text hiding inside a button or link, ensure a fallback `aria-label` is provided on the parent interactive element so screen readers can always identify its purpose, regardless of the screen size.
