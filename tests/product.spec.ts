import { LinkOption } from "../page-object-model/components/Header";
import { test } from "../page-object-model/PomFixtures";

const productName = 'Build your own expensive';

test.beforeEach(async ({ page, homePage }) => {
    await page.goto('/');
    await homePage.verifyHomePageIsDisplayed();
});

test.describe('Add product to cart', () => {

    test('Verify adding product to cart and new value in shopping cart link', async ({ header, productDetailsPage }) => {
        await header.searchForProduct(productName);
        await productDetailsPage.addProductToCart();
        await productDetailsPage.verifySuccessMessageIsDisplayed();
        await header.verifyCartQuantity(1);
    });

    test('Verify correct product with correct parameters added to cart', async ({ header, productDetailsPage, cartPage }) => {
        await header.searchForProduct(productName);

        await productDetailsPage.selectOptionFromGroup('Processor', 'Fast');
        await productDetailsPage.selectOptionFromGroup('Ram', '8GB');
        await productDetailsPage.selectOptionFromGroup('HDD', '400 GB');
        await productDetailsPage.selectOptionFromGroup('Software', 'Image Viewer');
        await productDetailsPage.selectOptionFromGroup('Software', 'Other Office Suite');
        await productDetailsPage.changeQuantity(3);

        await productDetailsPage.addProductToCart();
        await productDetailsPage.verifySuccessMessageIsDisplayed();

        await header.goToSelectedLink(LinkOption.SHOPPING_CART);

        await cartPage.verifyRowWithProductTitle(productName);
        await cartPage.verifyProductAttributesInCart(productName, {
            Processor: 'Fast',
            RAM: '8GB',
            HDD: '400 GB',
            Software: ['Image Viewer', 'Other Office Suite'],
            Quantity: 3
        });
    });
});

test.describe('Cart management', () => {

    test('Verify removing product from cart', async ({ header, productDetailsPage, cartPage }) => {
        await header.searchForProduct(productName);
        await productDetailsPage.addProductToCart();
        await productDetailsPage.verifySuccessMessageIsDisplayed();

        await header.goToSelectedLink(LinkOption.SHOPPING_CART);

        await cartPage.selectProductToBeDeleted(productName);
        await cartPage.updateProductCart();
        await cartPage.verifyNoRowWithProductTitle(productName);
    });

    test('Verify changing quantity in cart', async ({ header, productDetailsPage, cartPage }) => {
        await header.searchForProduct(productName);
        await productDetailsPage.addProductToCart();
        await productDetailsPage.verifySuccessMessageIsDisplayed();

        await header.goToSelectedLink(LinkOption.SHOPPING_CART);

        await cartPage.changeQuantity(productName, 2);
        await cartPage.updateProductCart();
        await cartPage.verifyProductAttributesInCart(productName, {
            Quantity: 2
        });
    });

    test('Verify edit product attributes from cart', async ({ header, productDetailsPage, cartPage }) => {
        await header.searchForProduct(productName);
        await productDetailsPage.selectOptionFromGroup('Processor', 'Fast');
        await productDetailsPage.selectOptionFromGroup('Ram', '8GB');
        await productDetailsPage.addProductToCart();
        await productDetailsPage.verifySuccessMessageIsDisplayed();

        await header.goToSelectedLink(LinkOption.SHOPPING_CART);

        await cartPage.verifyProductAttributesInCart(productName, {
            Processor: 'Fast',
            RAM: '8GB'
        });

        await cartPage.goToEditProduct(productName);

        await productDetailsPage.selectOptionFromGroup('Processor', 'Slow');
        await productDetailsPage.selectOptionFromGroup('Ram', '4GB');
        await productDetailsPage.updateProduct();
        await productDetailsPage.verifySuccessMessageIsDisplayed();

        await header.goToSelectedLink(LinkOption.SHOPPING_CART);

        await cartPage.verifyProductAttributesInCart(productName, {
            Processor: 'Slow',
            RAM: '4GB'
        });
    });
});

test.describe('Checkout workflow', () => {

    test('Verify checkout workflow', async ({ header, loginPage, productDetailsPage, cartPage, checkoutPage }) => {
        await header.goToSelectedLink(LinkOption.LOG_IN);
        await loginPage.login('test@emil.com', 'Testpassword');
        await header.verifyUserIsLoggedIn('test@emil.com');

        await header.searchForProduct(productName);
        await productDetailsPage.addProductToCart();
        await header.goToSelectedLink(LinkOption.SHOPPING_CART);

        await cartPage.acceptTermsOfService();
        await cartPage.goToCheckout();

        await checkoutPage.goThroughAllStepsWithDefaultValues();
        await checkoutPage.verifyCheckoutCompleted();
    });
});

test.describe('Recently viewed products', () => {

    test('Verify after visiting product details product appears in recently viewed', async ({ header, homePage }) => {
        const secondProductName = 'Phone Cover';

        await header.searchForProduct(productName);
        await homePage.goto();
        await homePage.verifyFirstProductInRecentlyViewed(productName);

        await header.searchForProduct(secondProductName);
        await homePage.goto();
        await homePage.verifyFirstProductInRecentlyViewed(secondProductName);
    });
});