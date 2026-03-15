import { test, expect } from '../fixtures/social.fixtures';
import { SignInPage } from '../page-objects/sign-in.page';
import { SocialPage } from '../page-objects/social.page';
import credentials from '../test-data/credentials.json';
import mockPosts from '../test-data/posts.json';
import mockFriends from '../test-data/friends.json';

// API Mocking: Intercept the backend posts request and return controlled stub data.
// This decouples the tests from the real database state.

test.describe('Social Page — API Mocking', () => {

    // Conditionally log a message to assist with debugging if a mock test fails
    test.afterEach(async ({ authenticatedPage: page }, testInfo) => {
        if (testInfo.status !== testInfo.expectedStatus) {
            console.log(`Mock Test [${testInfo.title}] Failed! Intercepting network logs for debugging.`);
        }
    });

    // Group tests that share the same mocked response to centralize network interception
    test.describe('Happy Path with Mocked Posts', () => {

        test.beforeEach(async ({ authenticatedPage: page }) => {
            // Intercept requests to the posts API and fulfill them with stubbed data
            await page.route('**/api/social/posts', async route => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockPosts),
                });
            });
        });

        test('should display mocked post in the feed', async ({ authenticatedPage: page }) => {
            const socialPage = new SocialPage(page);
            await socialPage.goto();
            await expect(page.getByText('This is a mocked post from the Playwright API stub.')).toBeVisible();
        });

        test('should render the correct amount of mocked posts', async ({ authenticatedPage: page }) => {
            const socialPage = new SocialPage(page);
            await socialPage.goto();
            // Verify that the UI renders the exact number of posts provided in the mock data
            await expect(socialPage.postFeed.locator('> div')).toHaveCount(mockPosts.length);
        });
    });

    test('should show empty state when API returns no posts', async ({ authenticatedPage: page }) => {
        // Intercept the API and return an empty array to simulate having no posts
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

    test('should handle API error gracefully', async ({ authenticatedPage: page }) => {
        // Intercept the API and return a 500 Internal Server Error status
        await page.route('**/api/social/posts', (route) => {
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Internal Server Error' }),
            });
        });

        const socialPage = new SocialPage(page);
        await socialPage.goto();

        // Ensure the layout still renders properly despite the API error
        await expect(socialPage.postTextarea).toBeVisible();
    });

    test.describe('Friendships API Mocking', () => {
        test('should render mocked friends in the friends list', async ({ authenticatedPage: page }) => {
            // Mock the friendships list endpoint
            await page.route('**/api/social/friendships', async route => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockFriends),
                });
            });

            // Make sure posts are also mocked so the page doesn't hang pending real requests
            await page.route('**/api/social/posts', async route => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockPosts),
                });
            });

            const socialPage = new SocialPage(page);
            await socialPage.goto();

            // We assert the mocked friend's name becomes visible in the UI
            await expect(page.getByText('Playwright MockUser')).toBeVisible();
        });
    });

});
