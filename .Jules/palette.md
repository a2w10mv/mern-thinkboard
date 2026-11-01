## 2024-05-24 - Accessibility improvements for icon-only buttons
**Learning:** Found a pattern of missing ARIA labels on icon-only buttons in NoteCard and TodoCard components, affecting screen reader users.
**Action:** Always verify icon-only buttons have descriptive `aria-label` attributes.

## 2026-11-01 - Accessible hidden text pattern for responsive designs
**Learning:** Responsive layouts often hide text labels on mobile devices (e.g., using Tailwind's `hidden sm:block` or `hidden sm:inline`), leaving screen reader users without context for interactive elements like links and buttons that still show an icon.
**Action:** Always add an `aria-label` attribute to elements where the descriptive text is hidden responsively, ensuring screen readers can still read the intended purpose of the element on smaller screens.
