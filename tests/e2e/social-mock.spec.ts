import { test, expect } from './fixtures';
import { SignInPage } from '../page-objects/sign-in.page';
import { SocialPage } from '../page-objects/social.page';
import credentials from '../test-data/credentials.json';
import mockPosts from '../test-data/posts.json';

// API Mocking: Intercept the backend posts request and return controlled stub data.
// This makes the tests independent of real database state.
//
// The frontend calls: GET http://localhost:3000/api/social/posts (via RTK Query)
// We intercept that request and fulfil it with our own JSON without hitting the backend.

test.describe('Social Page — API Mocking', () => {

    // We remove the beforeEach block entirely and inject `authenticatedPage` into each test.
    // `authenticatedPage` is already logged in, allowing us to setup `page.route` BEFORE navigating to `/social`.

    // Happy path: the frontend renders content from the stubbed response.
    test('should display mocked post in the feed', async ({ authenticatedPage: page }) => {
        await page.route('**/api/social/posts', (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockPosts),
            });
        });

        const socialPage = new SocialPage(page);
        await socialPage.goto();

        await expect(page.getByText('This is a mocked post from the Playwright API stub.')).toBeVisible();
    });

    // Empty state: returning an empty array causes the UI to render its empty state message.
    test('should show empty state when API returns no posts', async ({ authenticatedPage: page }) => {
        await page.route('**/api/social/posts', (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([]),
            });
        });

        const socialPage = new SocialPage(page);
        await socialPage.goto();

        await expect(page.getByText('No posts found.')).toBeVisible();
    });

    // Error handling: a 500 response should not crash the page.
    test('should handle API error gracefully', async ({ authenticatedPage: page }) => {
        await page.route('**/api/social/posts', (route) => {
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Internal Server Error' }),
            });
        });

        const socialPage = new SocialPage(page);
        await socialPage.goto();

        // The page itself must still load, confirming no unhandled crash.
        await expect(socialPage.postTextarea).toBeVisible();
    });

});
