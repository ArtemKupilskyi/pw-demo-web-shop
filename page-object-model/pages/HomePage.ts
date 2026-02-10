import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class HomePage extends BasePage {
    private readonly title: Locator;

    constructor(page: Page) {
        super(page);

        this.title = page.getByRole('heading', { name: 'Welcome to our store' });
    }

    async verifyHomePageIsDisplayed() {
        await expect(this.title).toBeVisible();
    }
}