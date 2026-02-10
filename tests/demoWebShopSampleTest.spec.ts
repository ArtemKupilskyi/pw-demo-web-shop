import { expect } from "@playwright/test";
import { test } from "../page-object-model/PomFixtures";
import { LinkOption, MenuTabOption, SubMenuOption } from "../page-object-model/components/Header";
import { SortByOption } from "../page-object-model/pages/ProductsPage";

test.beforeEach(async ({ page, homePage }) => {
  await page.goto('https://demowebshop.tricentis.com/');
  await homePage.verifyHomePageIsDisplayed();
});

test('Verify Login with correct credentials', async ({ page, header, loginPage }) => {
  await header.goToSelectedLink(LinkOption.LOG_IN);
  await expect(page.locator('h1')).toHaveText('Welcome, Please Sign In!');
  await loginPage.login('test@emil.com', 'Testpassword');
  await header.verifyUserIsLoggedIn('test@emil.com');
});

test('Verify Login with wrong credentials', async ({ page, header, loginPage }) => {
  await header.goToSelectedLink(LinkOption.LOG_IN);
  await expect(page.locator('h1')).toHaveText('Welcome, Please Sign In!');
  await loginPage.login('test@emil.com', 'WrongPassword');
  await loginPage.verifyLoginErrorMessage();
});

test('Verify navigation to Computers - Notebooks', async ({ page, header }) => {
  await header.goToSelectedMenuTab(MenuTabOption.COMPUTERS, SubMenuOption.NOTEBOOKS);
  await expect(page.locator('h1')).toHaveText('Notebooks');
});

test('Verify navigation Electronics - Camera & photo', async ({ page, header }) => {
  await header.goToSelectedMenuTab(MenuTabOption.ELECTRONICS, SubMenuOption.CAMERA_PHOTO);
  await expect(page.locator('h1')).toHaveText('Camera, photo');
});

test('Verify display filter on Products page', async ({ header, productsPage }) => {
  await header.goToSelectedMenuTab(MenuTabOption.COMPUTERS, SubMenuOption.DESKTOPS);
  await productsPage.verifyProductsPerPage(6);
  await productsPage.setProductsPerPage(4);
  await productsPage.verifyProductsPerPage(4);
});

test('Verify Sort By price on Products page', async ({ header, productsPage }) => {
  await header.goToSelectedMenuTab(MenuTabOption.COMPUTERS, SubMenuOption.DESKTOPS);
  await productsPage.setSortByOption(SortByOption.PRICE_ASC);
  await productsPage.verifyProductsSortedByPrice(SortByOption.PRICE_ASC);
  await productsPage.setSortByOption(SortByOption.PRICE_DESC);
  await productsPage.verifyProductsSortedByPrice(SortByOption.PRICE_DESC);
});

test('Verify Filter is applied on Products page', async ({ header, productsPage }) => {
  await header.goToSelectedMenuTab(MenuTabOption.COMPUTERS, SubMenuOption.DESKTOPS);
  await productsPage.selectFilter('Under 1000.00');
  await productsPage.verifyFilterIsApplied('Under 1000.00');
  await productsPage.verifyFilterByPriceRange('Under');
});

test('Verify search for product and redirect to product details page', async ({ header, productDetailsPage }) => {
  await header.searchForProduct('Build your own expensive');
  await productDetailsPage.verifyCorrectTitle('Build your own expensive');
})