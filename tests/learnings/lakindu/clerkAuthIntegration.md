# Clerk Global Auth Integration in Playwright talking points

- **Goal**: Completely bypass UI login steps for every single test by saving the browser state (Cookies/LocalStorage) after a single login event.
- **The Global Setup Script**:
  - Created `tests/setup/auth.setup.ts`.
  - This script runs the login process via UI (typing email/password in Clerk's modal) _exactly once_.
  - After the successful login, it calls `page.context().storageState({ path: '.auth/user.json' })`.
  - This saves the Clerk Session Cookie (`__session`) and all LocalStorage into a JSON file on disk.
- **Updating `playwright.config.ts`**:
  - Created a discrete project called `setup` that only runs the `auth.setup.ts` file.
  - Configured the main `chromium` testing project to `depend` on `setup`, ensuring `.auth/user.json` is generated before any real tests run.
  - Intentionally chose _not_ to force `storageState` globally. This ensures testing public/logged-out routes is still easily possible.
- **Per-File Opt-In**:
  - Instead of configuring it globally, we use `test.use({ storageState: '.auth/user.json' })` at the top of specific test files (like `my-trips.spec.ts`).
  - When `test.use()` sees the `.auth/user.json` file, it immediately injects the `__session` cookie into the new browser context.
  - When the page loads `http://localhost:5173/`, Clerk instantly reads the cookie, recognizes the user, and bypasses the Sign-In screen entirely.
- **Benefits to the workflow**:
  - Speeds up E2E runs exponentially since the browser skips rendering login fields and waiting for Clerk network events.
  - Prevents "flaky" tests caused by intermittent network or layout issues during login.
  - Lets developers quickly generate new authenticated E2E tests using `npx playwright codegen --load-storage=.auth/user.json`.
