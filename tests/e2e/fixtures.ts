import { test as base, expect } from '@playwright/test';
import { SignInPage } from '../page-objects/sign-in.page';
import { SocialPage } from '../page-objects/social.page';
import credentials from '../test-data/credentials.json';

type MyFixtures = {
    authenticatedSocialPage: SocialPage;
};

// Define and export the custom fixture so it can be used across multiple test files
export const test = base.extend<MyFixtures>({
    authenticatedSocialPage: async ({ page }, use) => {
        // Setup: Log in and navigate to social page
        const signInPage = new SignInPage(page);
        await signInPage.goto();
        await signInPage.signIn(
            credentials.validUser.email,
            credentials.validUser.password
        );

        // Wait for Clerk to finish its post-login redirect before navigating.
        // Without this, goto('/social') can run before the auth cookie is applied.
        await page.waitForURL((url) => !url.pathname.includes('/sign-in'), { timeout: 15000 });

        const socialPage = new SocialPage(page);
        await socialPage.goto();
        await expect(socialPage.postTextarea).toBeVisible();

        // Hand off to test
        await use(socialPage);

        // Teardown: Clear auth state
        await page.context().clearCookies();
    },
});

export { expect };
