import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export enum ShippingOption {
    GROUND = 'Ground',
    NEXT_DAY_AIR = 'Next Day Air',
    SECOND_DAY_AIR = '2nd Day Air',
}

export enum PaymentOption {
    CASH_ON_DELIVERY = 'Cash On Delivery (COD)',
    CHECK_MONEY_ORDER = 'Check / Money Order',
    CREDIT_CARD = 'Credit Card',
    PURCHASE_ORDER = 'Purchase Order',
}

export class CheckoutPage extends BasePage {
    private readonly checkoutStepsContainers: Locator;
    private readonly continueButton: Locator;
    private readonly confirmButton: Locator;

    private readonly billingAddressStepContainer: Locator;
    private readonly billingAddress: Locator;

    private readonly shippingAddressStepContainer: Locator;
    private readonly shippingAddress: Locator;

    private readonly shippingMethodStepContainer: Locator;
    private readonly shippingMethodsCheckboxes: Locator;

    private readonly paymentMethodStepContainer: Locator;
    private readonly paymentMethodsCheckboxes: Locator;

    private readonly paymentInformationStepContainer: Locator;
    private readonly creditCardTypeSelect: Locator;
    private readonly cardholderNameInput: Locator;
    private readonly cardNumberInput: Locator;
    private readonly expireMonthSelect: Locator;
    private readonly expireYearSelect: Locator;
    private readonly cardCodeInput: Locator;

    private readonly confirmOrderStepContainer: Locator;
    private readonly orderReviewContainer: Locator;
    private readonly paymentInformation: Locator;
    private readonly shippingInformation: Locator;

    private readonly orderCompletedContainer: Locator;
    private readonly orderCompletedTitle: Locator;


    constructor(page: Page) {
        super(page);

        this.checkoutStepsContainers = page.locator('#checkout-steps');
        this.continueButton = page.getByRole('button', { name: 'Continue', disabled: false });
        this.confirmButton = page.getByRole('button', { name: 'Confirm' });

        this.billingAddressStepContainer = page.locator('#opc-billing');
        this.billingAddress = this.billingAddressStepContainer.locator('#billing-address-select');

        this.shippingAddressStepContainer = page.locator('#opc-shipping');
        this.shippingAddress = this.shippingAddressStepContainer.locator('#shipping-address-select');

        this.shippingMethodStepContainer = page.locator('#opc-shipping_method');
        this.shippingMethodsCheckboxes = this.shippingMethodStepContainer.locator('.method-list li');

        this.paymentMethodStepContainer = page.locator('#opc-payment_method');
        this.paymentMethodsCheckboxes = this.paymentMethodStepContainer.locator('.method-list li');

        this.paymentInformationStepContainer = page.locator('#opc-payment_info');
        this.creditCardTypeSelect = this.paymentInformationStepContainer.locator('#CreditCardType');
        this.cardholderNameInput = this.paymentInformationStepContainer.locator('#CardholderName');
        this.cardNumberInput = this.paymentInformationStepContainer.locator('#CardNumber');
        this.expireMonthSelect = this.paymentInformationStepContainer.locator('#ExpireMonth');
        this.expireYearSelect = this.paymentInformationStepContainer.locator('#ExpireYear');
        this.cardCodeInput = this.paymentInformationStepContainer.locator('#CardCode');

        this.confirmOrderStepContainer = page.locator('#opc-confirm_order');
        this.orderReviewContainer = this.confirmOrderStepContainer.locator('.order-review-data');
        this.paymentInformation = this.orderReviewContainer.locator('.payment-method');
        this.shippingInformation = this.orderReviewContainer.locator('.shipping-method');

        this.orderCompletedContainer = page.locator('.order-completed');
        this.orderCompletedTitle = this.orderCompletedContainer.locator('.title');
    }


    async goThroughAllStepsWithDefaultValues() {
        const steps = this.checkoutStepsContainers.getByRole('listitem');
        await expect(steps.first()).toHaveClass(/active/);
        const count = await steps.count();

        for (let i = 0; i < count - 1; i++) {
            await expect(steps.nth(i)).toHaveClass(/active/);
            await this.goToTheNextStep();
        }
        await this.confirmOrder();
    }

    async verifyCheckoutCompleted() {
        await expect(this.page).toHaveURL('/checkout/completed/');
        await expect(this.orderCompletedTitle).toHaveText('Your order has been successfully processed!');
    }

    async goToTheNextStep() {
        await this.continueButton.click();
    }

    async confirmOrder() {
        await this.confirmButton.click();
    }

    async chooseShippingMethod(option: ShippingOption) {
        await this.shippingMethodsCheckboxes.getByRole('radio', { name: option }).check();
    }

    async choosePaymentMethod(option: PaymentOption) {
        await this.paymentMethodsCheckboxes.getByRole('radio', { name: option }).check();
    }

    async selectAddress() {
        if (await this.billingAddress.isVisible()) {
            await this.billingAddress.selectOption({});
        }
        if (await this.shippingAddress.isVisible()) {
            await this.shippingAddress.selectOption({});
        }
    }

    async fillPaymentInformation(cardType: string, cardholderName: string, cardNumber: string, expireMonth: number, expireYear: number, cardCode: string) {
        await this.creditCardTypeSelect.selectOption(cardType);
        await this.cardholderNameInput.fill(cardholderName);
        await this.cardNumberInput.fill(cardNumber);
        await this.expireMonthSelect.selectOption(expireMonth.toString());
        await this.expireYearSelect.selectOption(expireYear.toString());
        await this.cardCodeInput.fill(cardCode);
    }

    async verifyOrderReviewInformation(expected: { shipping?: ShippingOption; payment?: PaymentOption }) {
        if (expected.shipping) {
            await expect(this.orderReviewContainer).toContainText(expected.shipping);
        }
        if (expected.payment) {
            await expect(this.orderReviewContainer).toContainText(expected.payment);
        }
    }
}