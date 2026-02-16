import { expect } from "@playwright/test";
import { test } from "../page-object-model/PomFixtures";
import { LinkOption } from "../page-object-model/components/Header";
import { LinkOptions } from "../page-object-model/components/AccountNavigation";
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ page, homePage, header, loginPage }) => {
    await page.goto('/');
    await homePage.verifyHomePageIsDisplayed();
    await header.goToSelectedLink(LinkOption.LOG_IN);
    await loginPage.login('test@emil.com', 'Testpassword');
    await header.verifyUserIsLoggedIn('test@emil.com');
});

test('Verify navigation links redirect to page', async ({ page, accountNavigation }) => {
    await page.goto('/customer/info');

    await accountNavigation.goToAccountSubPage(LinkOptions.ADDRESSES);
    await expect(page).toHaveURL(/addresses/);

    await accountNavigation.goToAccountSubPage(LinkOptions.ORDERS);
    await expect(page).toHaveURL(/orders/);

    // await accountNavigation.goToAccountSubPage(LinkOptions.DOWNLOADABLE_PRODUCTS);
    // await expect(page).toHaveURL(/downloadableproducts/);

    await accountNavigation.goToAccountSubPage(LinkOptions.BACK_IN_STOCK_SUBSCRIPTIONS);
    await expect(page).toHaveURL(/backinstocksubscriptions/);

    await accountNavigation.goToAccountSubPage(LinkOptions.REWARD_POINTS);
    await expect(page).toHaveURL(/rewardpoints/);

    await accountNavigation.goToAccountSubPage(LinkOptions.CHANGE_PASSWORD);
    await expect(page).toHaveURL(/changepassword/);

    await accountNavigation.goToAccountSubPage(LinkOptions.CUSTOMER_INFO);
    await expect(page).toHaveURL(/info/);

});

test.describe('Verify user can change personal details', () => {

    test('Verify user can change first name, last name, gender', async ({ page, infoPage }) => {
        const newFirstName = faker.person.firstName();
        const newLastName = faker.person.lastName();
        const newGender = faker.helpers.arrayElement(['Male', 'Female']);

        await page.goto('/customer/info');

        await infoPage.fillNewPersonalDetails(newGender, newFirstName, newLastName);
        await infoPage.saveNewPersonalDetails();
        await page.reload();
        await infoPage.verifyPersonalDetails(newGender, newFirstName, newLastName);
    });

    test('Verify user cannot set empty first name, last name and email', async ({ page, infoPage }) => {
        await page.goto('/customer/info');
        await infoPage.clearAllPersonalDetails();
        await infoPage.saveNewPersonalDetails();
        await infoPage.verifyErrorMessage();
    });
});

test.describe('Verify user can manage addresses', () => {

    test('Verify user can add new address', async ({ page, addressesPage }) => {
        const addressData = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            country: faker.location.country(),
            city: faker.location.city(),
            address1: faker.location.streetAddress(),
            zipPostalCode: faker.location.zipCode(),
            phoneNumber: faker.phone.number(),
        };

        await page.goto('/customer/addresses');

        await addressesPage.goToAddNewAddressPage();
        await addressesPage.fillAddressForm(addressData);
        await addressesPage.saveAddress();
        await addressesPage.verifyAddressPresent(addressData);

    });

    test('Verify user can delete address', async ({ page, addressesPage }) => {
        const addressData = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            country: faker.location.country(),
            city: faker.location.city(),
            address1: faker.location.streetAddress(),
            zipPostalCode: faker.location.zipCode(),
            phoneNumber: faker.phone.number(),
        };

        await page.goto('/customer/addresses');

        await addressesPage.goToAddNewAddressPage();
        await addressesPage.fillAddressForm(addressData);
        await addressesPage.saveAddress();
        await addressesPage.verifyAddressPresent(addressData);
        await addressesPage.deleteAddress(addressData);
        await addressesPage.verifyAddressNotPresent(addressData);
    });

});