import { test } from "../page-object-model/PomFixtures";

const PRODUCT_1 = 'Desktop PC with CDRW';
const PRODUCT_2 = 'Elite Desktop PC';

test.describe('Compare products', () => {

    test.beforeEach(async ({ page, homePage }) => {
        await page.goto('/');
        await homePage.verifyHomePageIsDisplayed();
    });

    test('Verify add products to compare list', async ({ header, productDetailsPage, comparePage }) => {
        await header.searchForProduct(PRODUCT_1);
        await productDetailsPage.addToCompareList();

        await header.searchForProduct(PRODUCT_2);
        await productDetailsPage.addToCompareList();

        await comparePage.verifyProductTitlePresent(PRODUCT_1);
        await comparePage.verifyProductTitlePresent(PRODUCT_2);
    });


    test('Verify remove product from compare list', async ({ header, productDetailsPage, comparePage }) => {
        await header.searchForProduct(PRODUCT_1);
        await productDetailsPage.addToCompareList();

        await header.searchForProduct(PRODUCT_2);
        await productDetailsPage.addToCompareList();

        await comparePage.removeProductFromList(1);
        await comparePage.verifyProductTitleNotPresent(PRODUCT_1);
    });


    test('Verify clear compare list', async ({ header, productDetailsPage, comparePage }) => {
        await header.searchForProduct(PRODUCT_1);
        await productDetailsPage.addToCompareList();

        await header.searchForProduct(PRODUCT_2);
        await productDetailsPage.addToCompareList();

        await comparePage.clearCompareProductsList();
        await comparePage.verifyNoList();
    });


    test('Verify product title redirects to correct product details page', async ({ header, productDetailsPage, comparePage }) => {
        await header.searchForProduct(PRODUCT_1);
        await productDetailsPage.addToCompareList();

        await comparePage.goToProductDetails(PRODUCT_1);
        await productDetailsPage.verifyCorrectTitle(PRODUCT_1);
    });

});