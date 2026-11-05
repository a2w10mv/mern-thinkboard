## 2024-05-24 - Accessibility improvements for icon-only buttons
**Learning:** Found a pattern of missing ARIA labels on icon-only buttons in NoteCard and TodoCard components, affecting screen reader users.
**Action:** Always verify icon-only buttons have descriptive `aria-label` attributes.

## 2024-05-24 - Accessibility improvements for form inputs
**Learning:** Found a pattern of missing `htmlFor` attributes on labels and `id` attributes on inputs (e.g. Title, Content fields) affecting screen reader users and making it harder for users to click the labels to focus the fields.
**Action:** Always ensure form inputs and textareas have explicit IDs bound to their labels using `htmlFor`.
