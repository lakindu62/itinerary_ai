import { Page, Locator, expect } from '@playwright/test';
import { SignInPage } from './sign-in.page';

export class HomePage {
    readonly page: Page;
    readonly userMenuButton: Locator;
    readonly signInMenuItem: Locator;
    readonly promptInput: Locator;
    readonly planMyTripButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // The user icon button in the header
        this.userMenuButton = page.locator('header button').filter({ has: page.locator('svg.lucide-user') }).first();
        // The Sign In button inside the popover
        this.signInMenuItem = page.getByRole('button', { name: 'Sign In' });
        this.promptInput = page.getByRole('textbox', { name: 'Tell me where you want to go' }); // Note: the codegen might match placeholders too, actually we can just use locator by placeholder
        // Fallback or more robust locators based on the user's codegen
        this.promptInput = page.getByRole('textbox', { name: 'Tell me where you want to go' });
        this.planMyTripButton = page.getByRole('button', { name: 'Plan my trip' });
    }

    async goto() {
        await this.page.goto('/');
    }

    async loginFromHome(email: string, password?: string) {
        await this.userMenuButton.click();
        // The Popover has an animation, use toBeVisible before clicking just in case
        await expect(this.signInMenuItem).toBeVisible();
        await this.signInMenuItem.click();

        // Wait for the modal (which mounts the Clerk SignIn component) to appear
        const signInPage = new SignInPage(this.page);
        await signInPage.expectVisible();

        // Fill out sign in
        await signInPage.signIn(email, password);
    }

    async enterPromptAndSubmit(prompt: string) {
        await this.promptInput.click();
        await this.promptInput.fill(prompt);
        await this.planMyTripButton.click();
    }
}
