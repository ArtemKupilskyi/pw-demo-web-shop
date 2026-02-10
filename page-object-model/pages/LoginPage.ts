import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class LoginPage extends BasePage {
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.emailInput = page.locator('#Email');
        this.passwordInput = page.locator('#Password');
        this.loginButton = page.getByRole('button', { name: 'Log in' });
        this.errorMessage = page.locator('.validation-summary-errors');
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyLoginErrorMessage() {
        await expect(this.errorMessage).toHaveText(/Login was unsuccessful/);
    }

}