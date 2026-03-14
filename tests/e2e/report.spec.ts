import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { SignInPage } from '../page-objects/sign-in.page';
import credentials from '../test-data/credentials.json';

// ✅ TC01 — Sign in page loads correctly
test('TC01 - Sign in page should load with all required elements',
  { tag: ['@smoke', '@high-priority'] },
  async ({ page }) => {

  test.info().annotations.push({ type: 'Description', description: 'Verifies the sign in page loads with all required elements visible' });
  test.info().annotations.push({ type: 'Priority', description: 'High' });
  test.info().annotations.push({ type: 'Category', description: 'Smoke Test' });

  allure.label('severity', 'critical');
  allure.label('feature', 'Authentication');
  allure.label('story', 'Sign In Page Load');
  allure.description('This test verifies that the sign in page loads successfully with all required elements.');
  allure.owner('Rismy');

  const signInPage = new SignInPage(page);

  await test.step('Navigate to sign in page', async () => {
    await signInPage.goto();
    await page.waitForTimeout(2000);
  });

  await test.step('Verify page URL is sign-in', async () => {
    await expect(page).toHaveURL(/\/sign-in/);
  });

  await test.step('Verify email input is visible', async () => {
    await expect.soft(signInPage.emailInput).toBeVisible();
  });

  await test.step('Verify continue button is visible', async () => {
    await expect.soft(signInPage.continueButton).toBeVisible();
  });
});

// ✅ TC02 — Email field accepts input correctly
test('TC02 - Email field should accept and display typed input',
  { tag: ['@smoke', '@high-priority'] },
  async ({ page }) => {

  test.info().annotations.push({ type: 'Description', description: 'Verifies that the email input field correctly accepts and displays typed input' });
  test.info().annotations.push({ type: 'Priority', description: 'High' });
  test.info().annotations.push({ type: 'Category', description: 'Smoke Test' });

  allure.label('severity', 'critical');
  allure.label('feature', 'Authentication');
  allure.label('story', 'Email Input');
  allure.description('This test verifies that the email field accepts user input correctly.');
  allure.owner('Rismy');

  const signInPage = new SignInPage(page);

  await test.step('Navigate to sign in page', async () => {
    await signInPage.goto();
    await page.waitForTimeout(2000);
  });

  await test.step('Verify email input is visible and enabled', async () => {
    await expect.soft(signInPage.emailInput).toBeVisible();
    await expect.soft(signInPage.emailInput).toBeEnabled();
  });

  await test.step('Type email into input field', async () => {
    await signInPage.emailInput.fill(credentials.validUser.email);
  });

  await test.step('Verify email input contains typed value', async () => {
    await expect(signInPage.emailInput).toHaveValue(credentials.validUser.email);
  });
});

// TC03 — Login with invalid email shows error
test('TC03 - Login with invalid email should show error',
  { tag: ['@validation', '@high-priority'] },
  async ({ page }) => {

  test.info().annotations.push({ type: 'Description', description: 'Verifies that login with an invalid email address shows an error message' });
  test.info().annotations.push({ type: 'Priority', description: 'High' });
  test.info().annotations.push({ type: 'Category', description: 'Validation Test' });

  allure.label('severity', 'critical');
  allure.label('feature', 'Authentication');
  allure.label('story', 'Invalid Email');
  allure.description('This test verifies that entering an invalid email shows Could not find your account error.');
  allure.owner('Rismy');

  const signInPage = new SignInPage(page);

  await test.step('Navigate to sign in page', async () => {
    await signInPage.goto();
    await page.waitForTimeout(2000);
  });

  await test.step('Fill in invalid email', async () => {
    await signInPage.emailInput.fill('name@gmail.com');
  });

  await test.step('Click continue button', async () => {
    await signInPage.continueButton.click();
    await page.waitForTimeout(2000);
  });

  await test.step('Verify could not find account error is shown', async () => {
    await expect(page.getByText("Couldn't find your account.")).toBeVisible();
  });

  await test.step('Verify user stays on sign in page', async () => {
    await expect.soft(page).toHaveURL(/sign-in/);
  });
});

// ✅ TC04 — Login with wrong password shows error
test('TC04 - Login with wrong password should show error',
  { tag: ['@validation', '@high-priority'] },
  async ({ page }) => {

  test.info().annotations.push({ type: 'Description', description: 'Verifies that login with a wrong password shows an error message' });
  test.info().annotations.push({ type: 'Priority', description: 'High' });
  test.info().annotations.push({ type: 'Category', description: 'Validation Test' });

  allure.label('severity', 'critical');
  allure.label('feature', 'Authentication');
  allure.label('story', 'Wrong Password');
  allure.description('This test verifies that entering a wrong password shows an appropriate error message.');
  allure.owner('Rismy');

  const signInPage = new SignInPage(page);

  await test.step('Navigate to sign in page', async () => {
    await signInPage.goto();
    await page.waitForTimeout(2000);
  });

  await test.step('Fill in valid email', async () => {
    await signInPage.emailInput.fill(credentials.validUser.email);
  });

  await test.step('Click continue button', async () => {
    await signInPage.continueButton.click();
    await page.waitForTimeout(2000);
  });

  await test.step('Fill in wrong password', async () => {
    await signInPage.passwordInput.fill('WrongPassword123!');
  });

  await test.step('Click continue to login', async () => {
    await signInPage.continueButton.click();
    await page.waitForTimeout(2000);
  });

  await test.step('Verify error message is shown', async () => {
    await expect.soft(page.locator('body')).toContainText(/error|invalid|incorrect|password/i);
  });

  await test.step('Verify user stays on sign in page', async () => {
    await expect.soft(page).toHaveURL(/sign-in/);
  });
});

// ✅ TC05 — Valid login redirects successfully
test('TC05 - Login with valid credentials should redirect successfully',
  { tag: ['@smoke', '@high-priority'] },
  async ({ page }) => {

  test.info().annotations.push({ type: 'Description', description: 'Verifies that login with valid credentials redirects user away from sign in page' });
  test.info().annotations.push({ type: 'Priority', description: 'High' });
  test.info().annotations.push({ type: 'Category', description: 'Authentication Test' });

  allure.label('severity', 'critical');
  allure.label('feature', 'Authentication');
  allure.label('story', 'Valid Login');
  allure.description('This test verifies that a user can successfully login with valid credentials.');
  allure.owner('Rismy');

  const signInPage = new SignInPage(page);

  await test.step('Navigate to sign in page', async () => {
    await signInPage.goto();
    await page.waitForTimeout(2000);
  });

  await test.step('Fill in valid email', async () => {
    await signInPage.emailInput.fill(credentials.validUser.email);
  });

  await test.step('Click continue button', async () => {
    await signInPage.continueButton.click();
    await page.waitForTimeout(2000);
  });

  await test.step('Fill in valid password', async () => {
    await signInPage.passwordInput.fill(credentials.validUser.password);
  });

  await test.step('Click continue to login', async () => {
    await signInPage.continueButton.click();
    await page.waitForTimeout(3000);
  });

  await test.step('Verify user is redirected away from sign in page', async () => {
    await expect(page).not.toHaveURL(/\/sign-in/);
  });
});

// ❌ TC06 — Intentional fail to demonstrate error reporting
test('TC06 - Intentional fail to demonstrate HTML report error capture',
  { tag: ['@demo'] },
  async ({ page }) => {

  test.info().annotations.push({ type: 'Description', description: 'Intentional failure to showcase report error capture capabilities' });
  test.info().annotations.push({ type: 'Priority', description: 'Demo Only' });
  test.info().annotations.push({ type: 'Category', description: 'Demo Test' });

  allure.label('severity', 'minor');
  allure.label('feature', 'Authentication');
  allure.label('story', 'Error Capture Demo');
  allure.description('This is an intentional failure to demonstrate how Playwright and Allure capture and display errors.');
  allure.owner('Rismy');

  const signInPage = new SignInPage(page);

  await test.step('Navigate to sign in page', async () => {
    await signInPage.goto();
    await page.waitForTimeout(2000);
  });

  await test.step('Check for non existent element to trigger failure', async () => {
    await expect(
      page.getByText('This element does not exist on the page')
    ).toBeVisible();
  });
});