import { Page, Locator, expect } from '@playwright/test';

export class SignInPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly continueButton: Locator;
    readonly userMenuButton: Locator;
    readonly manageAccountItem: Locator;

    constructor(page: Page) {
        this.page = page;
        // Updated to use roles and names from codegen
        this.emailInput = page.getByRole('textbox', { name: 'Email address' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.userMenuButton = page.getByRole('button', { name: 'Open user menu' });
        this.manageAccountItem = page.getByRole('menuitem', { name: 'Manage account' });
    }

    async goto() {
        await this.page.goto('/sign-in');
    }

    async signIn(email: string, password?: string) {
        await this.emailInput.fill(email);
        await this.continueButton.click();

        if (password) {
            await this.passwordInput.fill(password);
            await this.continueButton.click();
        }
    }

    async openUserMenu() {
        await this.userMenuButton.click();
    }

    async manageAccount() {
        await this.manageAccountItem.click();
    }

    async expectVisible() {
        await expect(this.emailInput).toBeVisible();
    }
}
