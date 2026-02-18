import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export enum LinkOption {
    REGISTER = 'Register',
    LOG_IN = 'Log in',
    LOG_UT = 'Log out',
    SHOPPING_CART = 'Shopping cart',
    WISHLIST = 'Wishlist'
}

export enum MenuTabOption {
    BOOKS = 'Books',
    COMPUTERS = 'Computers',
    ELECTRONICS = 'Electronics',
    APPAREL_SHOES = 'Apparel & Shoes',
    DIGITAL_DOWNLOADS = 'Digital downloads',
    JEWELRY = 'Jewelry',
    GIFT_CARDS = 'Gift Cards'
}

export enum SubMenuOption {
    DESKTOPS = 'Desktops',
    NOTEBOOKS = 'Notebooks',
    ACCESSORIES = 'Accessories',
    CAMERA_PHOTO = 'Camera, photo',
    CELL_PHONES = 'Cell phones'
}

export class Header extends BasePage {
    private readonly headerContainer: Locator;
    private readonly logo: Locator;
    private readonly links: Locator;
    private readonly searchBox: Locator;
    private readonly menuTabs: Locator;
    private readonly searchInput: Locator;
    private readonly searchSuggestions: Locator;

    private readonly cartQuantity: Locator;

    constructor(page: Page) {
        super(page)

        this.headerContainer = page.locator('[class="header"]');
        this.logo = this.headerContainer.locator('.header-logo');
        this.links = this.headerContainer.locator('.header-links');
        this.searchBox = this.headerContainer.locator('.search-box');
        this.searchInput = this.searchBox.locator('#small-searchterms');
        this.searchSuggestions = page.locator('.ui-autocomplete .ui-menu-item');

        this.menuTabs = page.locator('.header-menu li');

        this.cartQuantity = page.locator('.cart-qty')

    }

    async goToSelectedLink(linkOption: LinkOption) {
        await this.links.getByRole('link', { name: linkOption }).click();
    }

    async verifyUserIsLoggedIn(email: string) {
        await expect(this.links.getByRole('link', { name: email })).toBeVisible();
    }

    async goToSelectedMenuTab(menuTabOption: MenuTabOption, subMenuOption?: SubMenuOption) {
        if (menuTabOption == MenuTabOption.COMPUTERS || menuTabOption == MenuTabOption.ELECTRONICS) {
            await this.menuTabs.getByRole('link', { name: menuTabOption }).hover();
            if (subMenuOption) {
                await this.menuTabs.getByRole('link', { name: subMenuOption }).click();
            }
        } else {
            await this.menuTabs.getByRole('link', { name: menuTabOption }).click();
        }
    }

    async searchForProduct(productName: string) {
        await this.searchInput.fill(productName);
        await this.searchSuggestions.first().click();
    }

    async verifyCartQuantity(quantity: number) {
        await expect(this.cartQuantity).toContainText(`(${quantity})`);
    }
}