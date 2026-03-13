import { test, expect } from '@playwright/test';
import { SignInPage } from '../page-objects/sign-in.page';
import credentials from '../test-data/credentials.json';

test.describe('Authentication', () => {
    test('should login and navigate to manage account', async ({ page }) => {
        const signInPage = new SignInPage(page);

        // 1. Navigate to sign-in
        await signInPage.goto();

        // 2. Perform sign-in with credentials from test-data
        await signInPage.signIn(
            credentials.validUser.email,
            credentials.validUser.password
        );

        // 3. Post-login actions from codegen
        await signInPage.openUserMenu();

        // Assert the "Manage account" item is visible after opening user menu
        await expect(signInPage.manageAccountItem).toBeVisible();

        await signInPage.manageAccount();
    });

    test('should show sign-in page elements', async ({ page }) => {
        const signInPage = new SignInPage(page);
        await signInPage.goto();
        await signInPage.expectVisible();
    });
});
