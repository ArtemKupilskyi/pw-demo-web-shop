import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class HomePage extends BasePage {
    private readonly title: Locator;

    private readonly recentlyViewedContainer: Locator;
    private readonly recentProductTitles: Locator;

    constructor(page: Page) {
        super(page);

        this.title = page.getByRole('heading', { name: 'Welcome to our store' });

        this.recentlyViewedContainer = page.locator('.block-recently-viewed-products');
        this.recentProductTitles = this.recentlyViewedContainer.locator('.product-name');
    }

    async goto() {
        await this.page.goto('/');
    }

    async verifyHomePageIsDisplayed() {
        await expect(this.title).toBeVisible();
    }

    async verifyFirstProductInRecentlyViewed(productTitle: string) {
        await expect(this.recentProductTitles.first()).toContainText(productTitle);
    }

}