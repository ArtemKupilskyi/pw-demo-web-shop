import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class ProductDetailsPage extends BasePage {
    private readonly productOverviewContainer: Locator;
    private readonly productTitle: Locator;
    private readonly addToCompareListButton: Locator;

    private readonly productAttributesContainer: Locator;

    private readonly updateButton: Locator;
    private readonly addToCartButton: Locator;
    private readonly quantityInput: Locator;

    private readonly successMessage: Locator;

    constructor(page: Page) {
        super(page)

        this.productOverviewContainer = page.locator('.overview')
        this.productTitle = this.productOverviewContainer.getByRole('heading');
        this.addToCompareListButton = this.productOverviewContainer.getByRole('button', { name: 'Add to compare list' });

        this.productAttributesContainer = page.locator('.attributes');

        this.addToCartButton = this.productOverviewContainer.getByRole('button', { name: 'Add to cart' });
        this.updateButton = this.productOverviewContainer.getByRole('button', { name: 'Update' });
        this.quantityInput = page.getByRole('textbox', { name: 'Qty:' });

        this.successMessage = page.locator('.content');
    }

    async verifyCorrectTitle(productName: string) {
        await expect(this.productTitle).toContainText(productName);
    }

    async addToCompareList() {
        await this.addToCompareListButton.click();
    }

    async selectOptionFromGroup(groupName: string, optionLabel: string) {
        const group = this.productAttributesContainer.locator('dl').filter({ hasText: groupName });
        await group.getByLabel(optionLabel).click();
    }

    async changeQuantity(quantity: number) {
        await this.quantityInput.fill(`${quantity}`);
    }

    async addProductToCart() {
        await this.addToCartButton.click();
    }

    async updateProduct() {
        await this.updateButton.click();
    }

    async verifySuccessMessageIsDisplayed() {
        await expect(this.successMessage).toBeVisible();
        await expect(this.successMessage).toContainText('The product has been added to your ');
    }
}