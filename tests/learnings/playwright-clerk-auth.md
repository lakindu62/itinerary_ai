# Playwright Global Authentication with Clerk

This document explains the step-by-step process we used to configure Playwright for global authentication in this project, specifically using Clerk for session management.

## 1. The Goal

When running end-to-end (E2E) tests, you typically don't want every single test to repeat the manual process of typing in an email and password to log in. It's slow and brittle. Instead, we want to log in **once** before any tests run, save the session state, and reuse that state across all tests.

## 2. Setting Up the Global Setup Script

We created a dedicated setup script at `tests/setup/auth.setup.ts`.

```typescript
// setup/auth.setup.ts
import { test as setup, expect } from "@playwright/test";
import { HomePage } from "../page-objects/home.page";
import credentials from "../test-data/credentials.json";

const authFile = ".auth/user.json";

setup("authenticate", async ({ page }) => {
  // 1. Navigate to the login page (or trigger the login modal)
  const homePage = new HomePage(page);
  await homePage.goto();

  // 2. Perform the actual UI login steps using credentials
  await homePage.loginFromHome(credentials.validUser.email, credentials.validUser.password);

  // 3. Wait for the application to be fully loaded in its authenticated state
  // Important: Wait for elements that prove login was successful!
  await page.waitForURL((url) => !url.pathname.includes("/sign-in") && !url.hash);
  await expect(page.locator("text=My Trips")).toBeVisible();

  // 4. Save the storage state (Cookies and LocalStorage) to a JSON file
  await page.context().storageState({ path: authFile });
});
```

### Why this matters

Playwright's `storageState` command captures all current cookies, session storage, and local storage from the browser.

Since Clerk relies heavily on HTTP-only cookies like `__session` to recognize users, saving this state effectively "captures" the logged-in session.

## 3. Configuring `playwright.config.ts`

We then updated the main Playwright configuration file to utilize this setup.

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  projects: [
    // Define the setup project
    {
      name: "setup",
      testDir: "./setup",
      testMatch: /.*\.setup\.ts/,
    },

    // Define the main testing project (e.g., chromium)
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // We DO NOT set storageState globally here so that
        // tests can choose whether they want to be authenticated or not.
      },
      // Ensure the setup project completely finishes before ANY chromium test runs
      dependencies: ["setup"],
    },
  ],
});
```

### How `dependencies` work

By making `chromium` depend on `setup`, Playwright guarantees that `auth.setup.ts` will run to completion _before_ it spins up the first worker for your actual tests.

## 4. Writing Tests: Opting into Authentication

Because we didn't force the `storageState` globally for the entire project, your tests will start **logged out** by default.

When you want a test file to be fully authenticated automatically, you simply opt-in by adding a `test.use()` block at the top of the file:

```typescript
// my-trips.spec.ts
import { test, expect } from "@playwright/test";

// Opt into the authenticated state for all tests in this file
test.use({ storageState: ".auth/user.json" });

test("view my trips", async ({ page }) => {
  // Bam! Automatically authenticated.
  await page.goto("/");

  // Proceed directly to authenticated actions
  await page.getByRole("button", { name: "Open user menu" }).click();
  await page.getByRole("menuitem", { name: "My Trips" }).click();

  await expect(page).toHaveURL(/\/my-trips/);
});
```

## 5. Using Codegen (Recording Actions) with Auth

If you want to use the Playwright Inspector Codegen to record your actions, you can start it with the _already loaded state_ so you don't have to record the login process yourself.

Assuming the `.auth/user.json` file has been generated (by running your test suite once), you pass the `--load-storage` flag:

```bash
# Important! Run this from the same directory where `.auth/user.json` exists
cd tests
npx playwright codegen --load-storage=.auth/user.json http://localhost:5173/
```

This will launch a new Chrome browser already logged into your application, allowing you to instantly start recording authenticated flows!
