import { test as baseTest } from "@playwright/test";
import { Header } from "./components/Header";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { HomePage } from "./pages/HomePage";
import { ComparePage } from "./pages/ComparePage";
import { AccountNavigation } from "./components/AccountNavigation";
import { InfoPage } from "./pages/customer/InfoPage";
import { AddressesPage } from "./pages/customer/AddressesPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";

type MyFixtures = {
    header: Header;
    loginPage: LoginPage;
    productsPage: ProductsPage;
    productDetailsPage: ProductDetailsPage;
    homePage: HomePage;
    comparePage: ComparePage;
    accountNavigation: AccountNavigation;
    infoPage: InfoPage;
    addressesPage: AddressesPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
}

export const test = baseTest.extend<MyFixtures>({
    header: async ({ page }, use) => {
        await use(new Header(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    productsPage: async ({ page }, use) => {
        await use(new ProductsPage(page));
    },
    productDetailsPage: async ({ page }, use) => {
        await use(new ProductDetailsPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    comparePage: async ({ page }, use) => {
        await use(new ComparePage(page));
    },
    accountNavigation: async ({ page }, use) => {
        await use(new AccountNavigation(page));
    },
    infoPage: async ({ page }, use) => {
        await use(new InfoPage(page));
    },
    addressesPage: async ({ page }, use) => {
        await use(new AddressesPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
});
