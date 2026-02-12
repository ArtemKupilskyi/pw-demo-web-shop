import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../../BasePage";

export type AddressData = {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    city: string;
    address1: string;
    zipPostalCode: string;
    phoneNumber: string;
};

export class AddressesPage extends BasePage {
    private readonly addNewAddressButton: Locator;

    private readonly editAddressContainer: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator
    private readonly emailInput: Locator;

    private readonly countrySelect: Locator;

    private readonly cityInput: Locator;
    private readonly address1Input: Locator;
    private readonly zipPostalCodeInput: Locator;
    private readonly phoneNumberInput: Locator;

    private readonly saveButton: Locator;

    private readonly addressContainers: Locator;
    private readonly addressTitle: Locator;
    private readonly addressDeleteButton: Locator;


    constructor(page: Page) {
        super(page);

        this.addNewAddressButton = page.getByRole('button', { name: 'Add new' });

        this.editAddressContainer = page.locator('.address-edit-page');
        this.firstNameInput = this.editAddressContainer.locator('#Address_FirstName');
        this.lastNameInput = this.editAddressContainer.locator('#Address_LastName');
        this.emailInput = this.editAddressContainer.locator('#Address_Email');

        this.countrySelect = this.editAddressContainer.locator('#Address_CountryId');

        this.cityInput = this.editAddressContainer.locator('#Address_City');
        this.address1Input = this.editAddressContainer.locator('#Address_Address1');
        this.zipPostalCodeInput = this.editAddressContainer.locator('#Address_ZipPostalCode');
        this.phoneNumberInput = this.editAddressContainer.locator('#Address_PhoneNumber');

        this.saveButton = this.editAddressContainer.getByRole('button', { name: 'Save' });

        this.addressContainers = page.locator('.address-item');
        this.addressTitle = this.addressContainers.locator('.title');
        this.addressDeleteButton = this.addressContainers.getByRole('button', { name: 'Delete' });
    }

    async goToAddNewAddressPage() {
        await this.addNewAddressButton.click();
    }

    async fillAddressForm(addressData: AddressData) {
        await this.firstNameInput.fill(addressData.firstName);
        await this.lastNameInput.fill(addressData.lastName);
        await this.emailInput.fill(addressData.email);

        await this.countrySelect.selectOption({ label: addressData.country });

        await this.cityInput.fill(addressData.city);
        await this.address1Input.fill(addressData.address1);
        await this.zipPostalCodeInput.fill(addressData.zipPostalCode);
        await this.phoneNumberInput.fill(addressData.phoneNumber);
    }

    async saveAddress() {
        await this.saveButton.click();
    }

    async verifyAddressPresent(addressData: AddressData) {
        const fullName = `${addressData.firstName} ${addressData.lastName}`;
        await expect(this.addressTitle.filter({ hasText: fullName })).toBeVisible();
    }

    async verifyAddressNotPresent(addressData: AddressData) {
        const fullName = `${addressData.firstName} ${addressData.lastName}`;
        await expect(this.addressTitle.filter({ hasText: fullName })).not.toBeVisible();
    }

    async deleteAddress(addressData: AddressData) {
        const fullName = `${addressData.firstName} ${addressData.lastName}`;
        this.page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Are you sure?')
            dialog.accept()
        })
        await this.addressDeleteButton.last().click();
    }
}