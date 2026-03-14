import { test, expect } from './fixtures';

test.describe('Social Page — Assertions & Fixtures', () => {

    test('should display social page layout after login', async ({ authenticatedSocialPage }) => {
        // Assert the compose textarea is present
        await expect(authenticatedSocialPage.postTextarea).toBeVisible();

        // Assert the Media upload toggle button is present
        await expect(authenticatedSocialPage.mediaButton).toBeVisible();

        // Assert the Post submit button is present
        await expect(authenticatedSocialPage.postButton).toBeVisible();

        // Assert the archive toggle switch is present
        await expect(authenticatedSocialPage.archiveToggle).toBeVisible();

        // Assert the Friend Requests panel heading is visible in the right column
        await expect(authenticatedSocialPage.friendRequestsList).toBeVisible();
    });

    test('should have Post button disabled when textarea is empty', async ({ authenticatedSocialPage }) => {
        // Textarea starts empty, so the Post button must be disabled
        await expect(authenticatedSocialPage.postButton).toBeDisabled();
    });

    test('should enable Post button when content is entered', async ({ authenticatedSocialPage }) => {
        // Type content into the compose textarea
        await authenticatedSocialPage.typePost('Testing Playwright assertions on the social page');

        // Post button must now be enabled
        await expect(authenticatedSocialPage.postButton).toBeEnabled();
    });

    test('should show archive hint text when archive toggle is switched on', async ({ authenticatedSocialPage }) => {
        // Hint must not be visible before the toggle is enabled
        await expect(authenticatedSocialPage.archiveHintText).not.toBeVisible();

        // Enable the archive toggle
        await authenticatedSocialPage.toggleArchive();

        // Hint must now appear below the toggle
        await expect(authenticatedSocialPage.archiveHintText).toBeVisible();
    });

});
