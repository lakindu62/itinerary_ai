import { test as setup, expect } from '@playwright/test';
import { HomePage } from '../page-objects/home.page';
import credentials from '../test-data/credentials.json';

const authFile = '.auth/user.json';

setup('authenticate', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Check if we are already logged in to avoid redundant logins (optional check)
    // We can also just run the login steps and let Playwright save the state
    await homePage.loginFromHome(
        credentials.validUser.email,
        credentials.validUser.password
    );

    // Wait for successful login via URL structure
    await page.waitForURL((url) => !url.pathname.includes('/sign-in') && !url.hash, { timeout: 15000 });

    // Wait for the UI to be fully authorized
    await expect(page.locator('text=My Trips')).toBeVisible({ timeout: 15000 });

    // End of authentication steps.
    await page.context().storageState({ path: authFile });
});
