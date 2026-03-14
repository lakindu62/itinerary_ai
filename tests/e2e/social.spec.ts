import { test, expect } from '@playwright/test';
import { SignInPage } from '../page-objects/sign-in.page';
import { SocialPage } from '../page-objects/social.page';
import credentials from '../test-data/credentials.json';

// Demonstrate Playwright assertions using the social page.
// Each test targets a distinct assertion type to show the breadth
// of the Playwright assertion API.
test.describe('Social Page — Assertions', () => {

    // Sign in before every test so the social page is accessible.
    // The social route requires authentication via Clerk.
    test.beforeEach(async ({ page }) => {
        const signInPage = new SignInPage(page);
        await signInPage.goto();
        await signInPage.signIn(
            credentials.validUser.email,
            credentials.validUser.password
        );
    });

    // Assertion type: toBeVisible
    // Verifies that the core CreatePost UI elements are rendered on screen
    // after a successful login and navigation to /social.
    test('should display social page layout after login', async ({ page }) => {
        const socialPage = new SocialPage(page);
        await socialPage.goto();

        // Assert the compose textarea is present
        await expect(socialPage.postTextarea).toBeVisible();

        // Assert the Media upload toggle button is present
        await expect(socialPage.mediaButton).toBeVisible();

        // Assert the Post submit button is present
        await expect(socialPage.postButton).toBeVisible();

        // Assert the archive toggle switch is present
        await expect(socialPage.archiveToggle).toBeVisible();

        // Assert the Friend Requests panel heading is visible in the right column
        await expect(socialPage.friendRequestsList).toBeVisible();
    });

    // Assertion type: toBeDisabled
    // Verifies the Post button is disabled when the compose textarea is empty.
    // The CreatePost component enforces this via: disabled={!content.trim() && selectedFiles.length === 0}
    test('should have Post button disabled when textarea is empty', async ({ page }) => {
        const socialPage = new SocialPage(page);
        await socialPage.goto();

        // Textarea starts empty, so the Post button must be disabled
        await expect(socialPage.postButton).toBeDisabled();
    });

    // Assertion type: toBeEnabled
    // Verifies the Post button becomes enabled once text is typed.
    test('should enable Post button when content is entered', async ({ page }) => {
        const socialPage = new SocialPage(page);
        await socialPage.goto();

        // Type content into the compose textarea
        await socialPage.typePost('Testing Playwright assertions on the social page');

        // Post button must now be enabled
        await expect(socialPage.postButton).toBeEnabled();
    });

    // Assertion type: toBeVisible (conditional render)
    // Verifies that toggling the Archive switch reveals a hint text message.
    // The hint "Only you can see this post" is conditionally rendered in CreatePost
    // only when the archive toggle is on.
    test('should show archive hint text when archive toggle is switched on', async ({ page }) => {
        const socialPage = new SocialPage(page);
        await socialPage.goto();

        // Hint must not be visible before the toggle is enabled
        await expect(socialPage.archiveHintText).not.toBeVisible();

        // Enable the archive toggle
        await socialPage.toggleArchive();

        // Hint must now appear below the toggle
        await expect(socialPage.archiveHintText).toBeVisible();
    });

});
