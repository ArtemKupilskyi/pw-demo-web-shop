import { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export enum LinkOptions {
    CUSTOMER_INFO = 'Customer info',
    ADDRESSES = 'Addresses',
    ORDERS = 'Orders',
    DOWNLOADABLE_PRODUCTS = 'Downloadable products',
    BACK_IN_STOCK_SUBSCRIPTIONS = 'Back in stock subscriptions',
    REWARD_POINTS = 'Reward points',
    CHANGE_PASSWORD = 'Change password',
};

export class AccountNavigation extends BasePage {
    private readonly accountLinks: Locator;
    constructor(page: Page) {
        super(page);

        this.accountLinks = page.locator('.block-account-navigation li a');
    }

    async goToAccountSubPage(option: LinkOptions) {
        await this.accountLinks.filter({ hasText: option }).click();
    }
}