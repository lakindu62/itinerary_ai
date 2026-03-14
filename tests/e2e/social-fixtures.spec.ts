import { test, expect } from './fixtures';

test.describe('Social Page — Fixtures & Setup/Teardown', () => {

    test.beforeEach(async () => {
        console.log('Setup: Preparing for social module test...');
    });

    test.afterEach(async () => {
        console.log('Teardown: Cleaning up after social test...');
    });

    test('should land on social page automatically using auth fixture', async ({ authenticatedSocialPage }) => {
        await expect(authenticatedSocialPage.postTextarea).toBeVisible();
        await expect(authenticatedSocialPage.friendsList).toBeVisible();
    });

    test('should show media upload inputs when media button is clicked', async ({ authenticatedSocialPage }) => {
        await expect(authenticatedSocialPage.mediaFileInput).not.toBeVisible();
        await authenticatedSocialPage.openMediaUpload();
        await expect(authenticatedSocialPage.mediaFileInput).toBeVisible();
    });

});

