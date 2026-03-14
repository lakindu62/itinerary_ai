import { expect } from '@playwright/test';
import { test } from '../fixtures/home-auth.fixture';

test('create itinerary via home page prompt', async ({ authenticatedHomePage }) => {
    const page = authenticatedHomePage.page;

    // Use the prompt from the user's codegen
    const promptText = 'I want to travel to kandy for a 2 day trip on  startDate "2025-10-16" endDate "2025-10-19" with 2 people for adventure';

    // Enter prompt and click plan my trip
    await authenticatedHomePage.enterPromptAndSubmit(promptText);

    // After clicking plan my trip, it should navigate to the chat page
    // Wait for the chat page header to be visible (increased timeout as it might take time to load or redirect)
    await expect(page.getByRole('heading', { name: 'Chat with AI Assistant' })).toBeVisible({ timeout: 30000 });
});
