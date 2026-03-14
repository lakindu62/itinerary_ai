import { test, expect } from '@playwright/test';

// Opt into authenticated state for all tests in this file
test.use({ storageState: '.auth/user.json' });

test.describe('My Trips Tests', () => {

    test('view an existing itinerary from My Trips', async ({ page }) => {
        await page.goto('/');

        // Click the user menu to open the Clerk dropdown
        await page.getByRole('button', { name: 'Open user menu' }).click();

        // Navigate to My Trips
        await page.getByRole('menuitem', { name: 'My Trips' }).click();

        // Wait for the My Trips page to load
        await expect(page).toHaveURL(/\/my-trips/);

        // Click on the first itinerary card
        // Note: Playwright codegen used `.w-full.h-48`, but we should preferably use something more stable later.
        await page.locator('.w-full.h-48').first().click();

        // Ensure that the itinerary title becomes visible, indicating we are on the itinerary detail page
        await expect(page.getByRole('heading', { name: 'Adventure in Kandy' })).toBeVisible();
    });

});
