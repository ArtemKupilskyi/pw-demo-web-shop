import { test as baseTest } from "@playwright/test";
import { Header } from "./components/Header";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { HomePage } from "./pages/HomePage";

type MyFixtures = {
    header: Header;
    loginPage: LoginPage;
    productsPage: ProductsPage;
    productDetailsPage: ProductDetailsPage;
    homePage: HomePage;
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
});
