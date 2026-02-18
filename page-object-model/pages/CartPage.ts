import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class CartPage extends BasePage {
    private readonly cartTable: Locator;
    private readonly updateCartButton: Locator;

    private readonly termsOfServiceCheckbox: Locator;

    private readonly checkoutButton: Locator;

    constructor(page: Page) {
        super(page);

        this.cartTable = page.locator('.cart tbody')
        this.updateCartButton = page.getByRole('button', { name: 'Update shopping cart' });

        this.termsOfServiceCheckbox = page.locator('#termsofservice');

        this.checkoutButton = page.getByRole('button', { name: 'Checkout' })
    }

    private getRowByTitle(title: string): Locator {
        return this.cartTable.getByRole('row', { name: title });
    }

    async verifyRowWithProductTitle(title: string) {
        await expect(this.getRowByTitle(title)).toBeVisible();
    }

    async verifyNoRowWithProductTitle(title: string) {
        await expect(this.getRowByTitle(title)).not.toBeVisible();
    }

    async verifyExactProductAttributes(title: string, expectedAttributes: string) {
        const productAttributes = await this.getRowByTitle(title).locator('.attributes').textContent();
        expect(productAttributes).toBe(expectedAttributes)
    }

    async verifyProductAttributesInCart(title: string, expectedAttributes: { Processor?: string; RAM?: string; HDD?: string; Software?: string[]; Quantity?: number }) {
        const attributesText = await this.getRowByTitle(title).locator('.attributes').innerText();
        if (expectedAttributes.Processor) {
            expect(attributesText).toContain(`Processor: ${expectedAttributes.Processor}`)
        }
        if (expectedAttributes.RAM) {
            expect(attributesText).toContain(`RAM: ${expectedAttributes.RAM}`)
        }
        if (expectedAttributes.HDD) {
            expect(attributesText).toContain(`HDD: ${expectedAttributes.HDD}`)
        }
        if (expectedAttributes.Software) {
            for (const software of expectedAttributes.Software) {
                expect(attributesText).toContain(`Software: ${software}`)
            }
        }
        if (expectedAttributes.Quantity) {
            await expect(this.getRowByTitle(title).locator('.qty-input')).toHaveValue(`${expectedAttributes.Quantity}`);
        }
    }

    async selectProductToBeDeleted(title: string) {
        await this.getRowByTitle(title).locator('[name="removefromcart"]').click();
    }

    async updateProductCart() {
        await this.updateCartButton.click();
    }

    async changeQuantity(title: string, quantity: number) {
        await this.getRowByTitle(title).locator('.qty-input').fill(`${quantity}`);
    }

    async goToEditProduct(title: string) {
        await this.getRowByTitle(title).getByRole('link', { name: 'Edit' }).click();
    }

    async acceptTermsOfService() {
        await this.termsOfServiceCheckbox.check();
    }

    async goToCheckout() {
        await this.checkoutButton.click();
    }
}