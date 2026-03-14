# Auth Fixtures talking points

- **Goal**: To reuse authentication across multiple tests without duplicating login code while keeping tests isolated.
- **Problem with normal login**: Running full UI login steps (typing email/password) before _every_ test in an `e2e` suite makes the tests incredibly slow, prone to timeouts, and brittle if UI elements change.
- **The `authenticatedPage` Fixture**:
  - We extended Playwright's base `test` fixture to create an `authenticatedPage`.
  - This fixture navigates to the login page, runs the UI login steps (via Page Object), waits for Clerk's redirect to complete, and then "hands off" the authenticated page object.
  - Once the test finishes, a teardown step clears cookies ensuring the next test gets a clean slate.
- **Specialized Fixtures (Fixture Chaining)**:
  - Used Plawright's ability to chain fixtures by creating `authenticatedSocialPage`.
  - Instead of rewriting login logic, `authenticatedSocialPage` _depends_ on `authenticatedPage`. It takes the already authenticated page, navigates to the `/social` route, asserts the page is loaded, and then hands off the `SocialPage` object.
  - This allows testing specific complex routes instantly with full type-safety and Page Object integration.
- **Why it's good**: Makes test files much smaller and easier to read. Any test that needs to be logged in just requests `{ authenticatedPage }` as an argument and starts immediately in the logged-in state.
