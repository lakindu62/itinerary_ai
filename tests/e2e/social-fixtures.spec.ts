import { test, expect } from './fixtures';

test.describe('Social Page — Fixtures Setup & Teardown', () => {

    test.beforeEach(async () => {
        console.log('Setup: Preparing for social module test...');
    });

    test.afterEach(async () => {
        console.log('Teardown: Cleaning up after social test...');
    });

    // Uses the authenticatedSocialPage fixture defined in fixtures.ts
    // The fixture handles the login setup before this block, and cookie teardown after it.
    test('should land on social page automatically using auth fixture', async ({ authenticatedSocialPage }) => {
        await expect(authenticatedSocialPage.postTextarea).toBeVisible();
        await expect(authenticatedSocialPage.friendsList).toBeVisible();
    });

    // The setup runs fresh again for this test
    test('should show media upload inputs when media button is clicked', async ({ authenticatedSocialPage }) => {
        await expect(authenticatedSocialPage.mediaFileInput).not.toBeVisible();
        await authenticatedSocialPage.openMediaUpload();
        await expect(authenticatedSocialPage.mediaFileInput).toBeVisible();
    });

});
