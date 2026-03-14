import { test, expect } from './fixtures';

test.describe('Social Page — Assertions', () => {

    test('should display social page layout after login', async ({ authenticatedSocialPage }) => {
        await expect(authenticatedSocialPage.postTextarea).toBeVisible();
        await expect(authenticatedSocialPage.mediaButton).toBeVisible();
        await expect(authenticatedSocialPage.postButton).toBeVisible();
        await expect(authenticatedSocialPage.archiveToggle).toBeVisible();
    });

    // Post button is disabled when textarea is empty: enforced via disabled={!content.trim() && selectedFiles.length === 0}
    test('should have Post button disabled when textarea is empty', async ({ authenticatedSocialPage }) => {
        await expect(authenticatedSocialPage.postButton).toBeDisabled();
    });

    test('should enable Post button when content is entered', async ({ authenticatedSocialPage }) => {
        await authenticatedSocialPage.typePost('Testing Playwright assertions on the social page');
        await expect(authenticatedSocialPage.postButton).toBeEnabled();
    });

    // "Only you can see this post" is conditionally rendered only when the archive toggle is on
    test('should show archive hint text when archive toggle is switched on', async ({ authenticatedSocialPage }) => {
        await expect(authenticatedSocialPage.archiveHintText).not.toBeVisible();
        await authenticatedSocialPage.toggleArchive();
        await expect(authenticatedSocialPage.archiveHintText).toBeVisible();
    });

});
