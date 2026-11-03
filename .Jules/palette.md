## 2024-05-24 - Accessibility improvements for icon-only buttons
**Learning:** Found a pattern of missing ARIA labels on icon-only buttons in NoteCard and TodoCard components, affecting screen reader users.
**Action:** Always verify icon-only buttons have descriptive `aria-label` attributes.
## 2026-11-03 - Form Accessibility (CreatePage.jsx)
**Learning:** Found an accessibility issue where form labels (Title and Content) were not programmatically associated with their input fields due to missing `htmlFor` and `id` attributes, and dynamically generated task inputs lacked `aria-label`.
**Action:** When auditing forms, verify all `<label>` elements are properly linked to inputs, and dynamically generated inputs have descriptive `aria-label` attributes.
