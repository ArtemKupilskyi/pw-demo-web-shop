import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class ComparePage extends BasePage {
    private readonly compareProductTable: Locator;
    private readonly titleCells: Locator;
    private readonly overviewCells: Locator;

    private readonly clearListLink: Locator;

    constructor(page: Page) {
        super(page);

        this.compareProductTable = page.getByRole('table');
        this.titleCells = this.compareProductTable.locator('.product-name');
        this.overviewCells = this.compareProductTable.locator('.overview');

        this.clearListLink = page.getByRole('link', { name: 'Clear list' });
    }

    async verifyProductTitlePresent(productTitle: string) {
        await expect(this.titleCells.filter({ hasText: productTitle })).toBeVisible();
    }

    async verifyProductTitleNotPresent(productTitle: string) {
        await expect(this.titleCells.filter({ hasText: productTitle })).not.toBeVisible();
    }

    async verifyNoList() {
        await expect(this.page.getByText('You have no items to compare.')).toBeVisible();
    }

    async removeProductFromList(productNumber: number) {
        await this.overviewCells.getByRole('button').nth(productNumber).click();
    }

    async clearCompareProductsList() {
        await this.clearListLink.click();
    }

    async goToProductDetails(productTitle: string) {
        await this.titleCells.filter({ hasText: productTitle }).click();
    }
}