# Missing Pages Analysis

## Objective
Replicate the structure and content of `laravelpizza.com` within the `Meetup` theme.

## Current Status
- **Home**: Implemented via `pages/index.blade.php`.
- **Events**: Implemented via `pages/[slug].blade.php` and `events.json`.
- **Contact**: Missing specific template. Likely handled by `[slug].blade.php` but needs specific form component.
- **Auth**:
  - Login: Missing in `pages/auth/`.
  - Register: Missing in `pages/auth/`.
  - Password Reset: Missing in `pages/auth/`.

## Action Plan
1.  **Contact Page**:
    -   Create `Themes/Meetup/resources/views/pages/contact.blade.php` (optional, or use slug).
    -   If using slug, ensure `contact.json` exists and uses a contact form block.
2.  **Auth Pages**:
    -   Create `Themes/Meetup/resources/views/pages/auth/login.blade.php`.
    -   Create `Themes/Meetup/resources/views/pages/auth/register.blade.php`.
    -   Create `Themes/Meetup/resources/views/pages/auth/forgot-password.blade.php`.
    -   Ensure these use `<x-layouts.guest>`.

## Layout Usage
-   **Public Pages** (Home, Events, Contact): Use `<x-layouts.app>`.
-   **Auth Pages** (Login, Register): Use `<x-layouts.guest>`.
