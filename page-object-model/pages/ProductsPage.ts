import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export enum SortByOption {
    POSITION = 'Position',
    NAME_ASC = 'Name: A to Z',
    NAME_DESC = 'Name: Z to A',
    PRICE_ASC = 'Price: Low to High',
    PRICE_DESC = 'Price: High to Low',
    CREATED_ASC = 'Created on',
}

export class ProductsPage extends BasePage {
    private readonly resultCountFilter: Locator;
    private readonly sortByFilter: Locator;

    private readonly productCards: Locator;
    private readonly price: Locator;

    private readonly filterContainer: Locator;
    private readonly filterLinks: Locator;

    constructor(page: Page) {
        super(page);

        this.resultCountFilter = page.locator('#products-pagesize');
        this.sortByFilter = page.locator('#products-orderby');

        this.productCards = page.locator('.item-box');
        this.price = this.productCards.locator('.actual-price');

        this.filterContainer = page.locator('.product-filters');
        this.filterLinks = this.filterContainer.locator('li');

    }

    async setProductsPerPage(count: number) {
        await this.resultCountFilter.selectOption(count.toString());
    }

    async verifyProductsPerPage(count: number) {
        await expect(this.productCards).toHaveCount(count);
    }

    async setSortByOption(option: SortByOption) {
        await this.sortByFilter.selectOption({ label: option });
        await this.productCards.first().waitFor();
    }

    async verifyProductsSortedByPrice(option: SortByOption) {
        const prices = await this.price.allTextContents();
        const numericPrices = prices.map(price => parseFloat(price));

        const sortedPrices = numericPrices.sort((a, b) => a - b);
        if (option === SortByOption.PRICE_DESC) {
            sortedPrices.reverse();
        }

        expect(numericPrices).toEqual(sortedPrices);
    }

    async selectFilter(filterName: string) {
        await this.filterLinks.getByRole('link', { name: filterName }).click();
        await this.productCards.first().waitFor();
    }

    async verifyFilterIsApplied(filterName: string) {
        await expect(this.filterContainer.locator('.selected-price-range')).toContainText(filterName);
    }

    async verifyFilterByPriceRange(priceFilter: string) {
        const pricesAbove = await this.price.allTextContents();
        const numericPrices = pricesAbove.map(price => parseFloat(price));
        switch (priceFilter) {
            case 'Under':
                const isUnder = numericPrices.every(price => price < 1000);
                expect(isUnder).toBeTruthy();
                break;
            case 'In range':
                const isInRange = numericPrices.every(price => price >= 1000 && price <= 2000);
                expect(isInRange).toBeTruthy();
                break;
            case 'Above':
                const isAbove = numericPrices.every(price => price > 2000);
                expect(isAbove).toBeTruthy();
                break;
            default:
                throw new Error(`Filter verification not implemented for: ${priceFilter}`);
        }
    }
}