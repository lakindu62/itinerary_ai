import { test as base, expect } from '@playwright/test';
import { HomePage } from '../page-objects/home.page';
import credentials from '../test-data/credentials.json';

type HomeFixtures = {
    authenticatedHomePage: HomePage;
};

export const test = base.extend<HomeFixtures>({
    authenticatedHomePage: async ({ page }, use) => {
        // Setup: Navigate to home page and log in
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.loginFromHome(
            credentials.validUser.email,
            credentials.validUser.password
        );

        // Wait for Clerk to finish its post-login processing
        // Clerk might redirect and update auth paths, ensure we are back on a stable page
        await page.waitForURL((url) => !url.pathname.includes('/sign-in') && !url.hash, { timeout: 15000 });

        // Wait to verify successful authentication state is reflected on home page
        // (e.g. "My Trips" button becomes visible from Clerk components)
        // Adjust this if you use another locator to verify standard login on the home page.
        await page.waitForSelector('text=My Trips', { state: 'visible', timeout: 15000 }).catch(() => { });

        // Hand off to test
        await use(homePage);

        // Teardown: Clear auth state
        await page.context().clearCookies();
    },
});

export { expect };
