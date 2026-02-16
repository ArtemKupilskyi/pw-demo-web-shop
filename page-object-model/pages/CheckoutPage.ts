import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class CheckoutPage extends BasePage {
    private readonly checkoutStepsContainers: Locator;
    private readonly continueButton: Locator;
    private readonly confirmButton: Locator;

    private readonly billingAddressStepContainer: Locator;

    private readonly shippingAddressStepContainer: Locator;

    private readonly shippingMethodStepContainer: Locator;

    private readonly paymentMethodStepContainer: Locator;

    private readonly paymentInformationStepContainer: Locator;

    private readonly confirmOrderStepContainer: Locator;

    private readonly orderCompletedContainer: Locator;
    private readonly orderCompletedTitle: Locator;

    constructor(page: Page) {
        super(page);

        this.checkoutStepsContainers = page.locator('#checkout-steps').getByRole('listitem');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.confirmButton = page.getByRole('button', { name: 'Confirm' });


        this.billingAddressStepContainer = page.locator('#opc-billing');

        this.shippingAddressStepContainer = page.locator('#opc-shipping');

        this.shippingMethodStepContainer = page.locator('#opc-shipping_method');

        this.paymentMethodStepContainer = page.locator('#opc-payment_method');

        this.paymentInformationStepContainer = page.locator('#opc-payment_info');

        this.confirmOrderStepContainer = page.locator('#opc-confirm_order');

        this.orderCompletedContainer = page.locator('.order-completed');
        this.orderCompletedTitle = this.orderCompletedContainer.locator('.title');
    }


    async goThroughAllStepsWithDefaultValues() {
        await this.checkoutStepsContainers.first().waitFor();
        const count = await this.checkoutStepsContainers.count();

        console.log(count)
        for (let i = 0; i < count - 1; i++) {
            const step = this.checkoutStepsContainers.nth(i);
            await expect(step).toHaveClass(/active/);
            await this.continueButton.click();
        }
        await this.confirmButton.click();
    }

    async verifyCheckoutCompleted() {
        await expect(this.page).toHaveURL('/checkout/completed/');
        await expect(this.orderCompletedTitle).toHaveText('Your order has been successfully processed!');
    }
}