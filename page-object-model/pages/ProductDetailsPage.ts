import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class ProductDetailsPage extends BasePage {
    private readonly productOverviewContainer: Locator;
    private readonly productTitle: Locator;

    constructor(page: Page) {
        super(page)

        this.productOverviewContainer = page.locator('.overview')
        this.productTitle = this.productOverviewContainer.getByRole('heading');
    }

    async verifyCorrectTitle(productName: string) {
        await expect(this.productTitle).toContainText(productName);
    }

}