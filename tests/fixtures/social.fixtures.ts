import { test as base, expect } from '@playwright/test';
import { SignInPage } from '../page-objects/sign-in.page';
import { SocialPage } from '../page-objects/social.page';
import credentials from '../test-data/credentials.json';

type MyFixtures = {
    authenticatedPage: import('@playwright/test').Page;
    authenticatedSocialPage: SocialPage;
};

// Define and export the custom fixture so it can be used across multiple test files
export const test = base.extend<MyFixtures>({
    // 1. Base Auth Fixture: Just logs in and waits for the redirect.
    authenticatedPage: async ({ page }, use) => {
        const signInPage = new SignInPage(page);
        await signInPage.goto();
        await signInPage.signIn(
            credentials.validUser.email,
            credentials.validUser.password
        );
        // Wait for Clerk to finish its post-login redirect
        await page.waitForURL((url) => !url.pathname.includes('/sign-in'), { timeout: 15000 });
        
        // Hand off the authenticated page to the test
        await use(page);
        
        // Teardown: Clear auth state
        await page.context().clearCookies();
    },

    // Specialized Fixture: Uses authenticatedPage, then navigates to social
    authenticatedSocialPage: async ({ authenticatedPage }, use) => {
        const socialPage = new SocialPage(authenticatedPage);
        await socialPage.goto();
        await expect(socialPage.postTextarea).toBeVisible();

        // Hand off to test
        await use(socialPage);
    },
});

export { expect };
