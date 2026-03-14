import { test, expect } from '../fixtures/social.fixtures';

test.describe('Social Page — Assertions', () => {

    // Conditionally log local storage to assist with debugging if a test fails
    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== testInfo.expectedStatus) {
            console.log(`Test [${testInfo.title}] Failed! Dumping local storage for debugging:`, await page.evaluate(() => localStorage));
        }
    });

    test('should display social page layout after login', async ({ authenticatedSocialPage }) => {
        await expect(authenticatedSocialPage.postTextarea).toBeVisible();
        await expect(authenticatedSocialPage.mediaButton).toBeVisible();
        await expect(authenticatedSocialPage.postButton).toBeVisible();
        await expect(authenticatedSocialPage.archiveToggle).toBeVisible();
        await expect(authenticatedSocialPage.friendsList).toBeVisible();
    });

    // The Post button should be disabled when the textarea is empty or contains only whitespace
    test('should have Post button disabled when textarea is empty', async ({ authenticatedSocialPage }) => {
        await expect(authenticatedSocialPage.postButton).toBeDisabled();
    });

    test('should enable Post button when content is entered', async ({ authenticatedSocialPage }) => {
        await authenticatedSocialPage.typePost('Testing Playwright assertions on the social page');
        await expect(authenticatedSocialPage.postButton).toBeEnabled();
    });

    // The archive hint text is conditionally rendered only when the archive toggle is switched on
    test('should show archive hint text when archive toggle is switched on', async ({ authenticatedSocialPage }) => {
        await expect(authenticatedSocialPage.archiveHintText).not.toBeVisible();
        await authenticatedSocialPage.toggleArchive();
        await expect(authenticatedSocialPage.archiveHintText).toBeVisible();
    });

    test('should show media upload inputs when media button is clicked', async ({ authenticatedSocialPage }) => {
        await expect(authenticatedSocialPage.mediaFileInput).not.toBeVisible();
        await authenticatedSocialPage.openMediaUpload();
        await expect(authenticatedSocialPage.mediaFileInput).toBeVisible();
    });

    // Group tests that require interacting with the comments section of a post
    test.describe('Post Card Interactions (Comments Section)', () => {
        
        test.beforeEach(async ({ authenticatedSocialPage }) => {
            // Ensure the feed is loaded to avoid race conditions, then open the comments modal
            await authenticatedSocialPage.postFeed.waitFor({ state: 'visible' });
            await authenticatedSocialPage.openCommentsOnFirstPost();
        });

        test('should see the comment textarea after toggling comments', async ({ authenticatedSocialPage }) => {
            await expect(authenticatedSocialPage.commentTextarea).toBeVisible();
        });

        test('should be able to type a comment', async ({ authenticatedSocialPage }) => {
            const testComment = 'This is a test comment from Playwright!';
            await authenticatedSocialPage.submitComment(testComment);
            // Verify that the comment textarea is reset after submission
            await expect(authenticatedSocialPage.commentTextarea).toHaveValue('');
        });
    });

});
