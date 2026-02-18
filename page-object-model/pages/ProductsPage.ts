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
    private readonly productGrid: Locator;
    private readonly productList: Locator;

    private readonly resultCountFilter: Locator;
    private readonly viewFilter: Locator;
    private readonly sortByFilter: Locator;

    private readonly productCards: Locator;
    private readonly price: Locator;
    private readonly title: Locator;

    private readonly filterContainer: Locator;
    private readonly filterLinks: Locator;

    constructor(page: Page) {
        super(page);

        this.productGrid = page.locator('.product-grid');
        this.productList = page.locator('.product-list');

        this.resultCountFilter = page.locator('#products-pagesize');
        this.viewFilter = page.locator('#products-viewmode');
        this.sortByFilter = page.locator('#products-orderby');

        this.productCards = page.locator('.item-box');
        this.price = this.productCards.locator('.actual-price');
        this.title = this.productCards.locator('.product-title');

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
        const copyNumericPrices = numericPrices.slice();

        const sortedPrices = copyNumericPrices.sort((a, b) => a - b);
        if (option === SortByOption.PRICE_DESC) {
            sortedPrices.reverse();
        }

        expect(numericPrices).toEqual(sortedPrices);
    }

    async verifyProductsSortedByName(option: SortByOption) {
        const titles = (await this.title.allTextContents()).map(t => t.trim());
        const copyTitles = titles.slice();

        const sortedTitles = copyTitles.sort();
        if (option === SortByOption.NAME_DESC) {
            sortedTitles.reverse();
        }
        expect(titles).toEqual(sortedTitles);
    }

    async setViewMode(viewMode: string) {
        await this.viewFilter.selectOption(viewMode);
    }

    async verifyViewMode(viewMode: string) {
        switch (viewMode) {
            case 'Grid':
                await expect(this.viewFilter.locator('option:checked')).toHaveText('Grid');
                await expect(this.productGrid).toBeVisible();
                break;
            case 'List':
                await expect(this.viewFilter.locator('option:checked')).toHaveText('List');
                await expect(this.productList).toBeVisible();
                break;
            default:
                throw new Error(`View mode verification not implemented for: ${viewMode}`);
        }
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