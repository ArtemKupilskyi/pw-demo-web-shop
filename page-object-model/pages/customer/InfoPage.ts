import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../../BasePage";

export class InfoPage extends BasePage {
    private readonly personalDetailsContainer: Locator;
    private readonly genderRadioButtons: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly fieldValidationError: Locator;

    private readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);

        this.personalDetailsContainer = page.locator('.fieldset');
        this.genderRadioButtons = this.personalDetailsContainer.locator('.inputs .gender');
        this.firstNameInput = this.personalDetailsContainer.locator('#FirstName');
        this.lastNameInput = this.personalDetailsContainer.locator('#LastName');
        this.emailInput = this.personalDetailsContainer.locator('#Email');
        this.fieldValidationError = this.personalDetailsContainer.locator('.field-validation-error');

        this.saveButton = page.getByRole('button', { name: 'Save' })
    }

    async fillNewPersonalDetails(gender: string, firstName: string, lastName: string) {
        await this.genderRadioButtons.getByRole('radio', { name: gender, exact: true }).check();
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
    }

    async verifyPersonalDetails(gender: string, firstName: string, lastName: string) {
        await expect(this.genderRadioButtons.getByRole('radio', { name: gender, exact: true })).toBeChecked();
        await expect(this.firstNameInput).toHaveValue(firstName);
        await expect(this.lastNameInput).toHaveValue(lastName);
    }

    async saveNewPersonalDetails() {
        await this.saveButton.click();
    }

    async clearAllPersonalDetails() {
        await this.firstNameInput.clear();
        await this.lastNameInput.clear();
        await this.emailInput.clear();
    }

    async verifyErrorMessage() {
        await expect(this.fieldValidationError).toHaveCount(3);
        await expect(this.fieldValidationError.first()).toHaveText('First name is required.');
        await expect(this.fieldValidationError.nth(1)).toHaveText('Last name is required.');
        await expect(this.fieldValidationError.last()).toHaveText('Email is required.');
    }
}