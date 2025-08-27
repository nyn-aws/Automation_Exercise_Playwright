import { Page, Locator } from "@playwright/test";

interface CheckoutPageLocators {
  proceed_to_checkout_button: Locator;
  continue_on_cart_button: Locator;
  register_login_link: Locator;
  delivery_address_heading: Locator;
  billing_address_heading: Locator;
  comment_text_area: Locator;
  place_order_link: Locator;
  name_on_card_field: Locator;
  card_number_field: Locator;
  cvc_field: Locator;
  expiration_month_field: Locator;
  expiration_year_field: Locator;
  pay_and_confirm_order_button: Locator;
  order_placed_success_message: Locator;
}

/**
 * @class CheckoutPage
 * @description Represents the Checkout page, containing methods and locators for the checkout process.
 */
export class CheckoutPage {
  private page: Page;
  public locators: CheckoutPageLocators;

  /**
   * @constructor
   * @param {Page} page - Playwright's Page object.
   */
  constructor(page: Page) {
    this.page = page;
    this.locators = this.initLocators();
  }

  /**
   * @method proceedToCheckout
   * @description Clicks the 'Proceed To Checkout' button.
   */
  async proceedToCheckout() {
    await this.locators.proceed_to_checkout_button.click();
  }

  /**
   * @method clickRegisterLoginLink
   * @description Clicks the 'Register / Login' link during checkout.
   */
  async clickRegisterLoginLink() {
    await this.locators.register_login_link.click();
  }

  /**
   * @method fillCommentTextArea
   * @description Fills the comment text area with a message.
   * @param {string} message - The message to enter in the comment text area.
   */
  async fillCommentTextArea(message: string) {
    await this.locators.comment_text_area.fill(message);
  }

  /**
   * @method clickPlaceOrderLink
   * @description Clicks the 'Place Order' link.
   */
  async clickPlaceOrderLink() {
    await this.locators.place_order_link.click();
  }

  /**
   * @method fillPaymentDetails
   * @description Fills in the payment details form.
   * @param {string} nameOnCard - The name on the card.
   * @param {string} cardNumber - The card number.
   * @param {string} cvc - The CVC code.
   * @param {string} expirationMonth - The expiration month.
   * @param {string} expirationYear - The expiration year.
   */
  async fillPaymentDetails(
    nameOnCard: string,
    cardNumber: string,
    cvc: string,
    expirationMonth: string,
    expirationYear: string
  ) {
    await this.locators.name_on_card_field.fill(nameOnCard);
    await this.locators.card_number_field.fill(cardNumber);
    await this.locators.cvc_field.fill(cvc);
    await this.locators.expiration_month_field.fill(expirationMonth);
    await this.locators.expiration_year_field.fill(expirationYear);
  }

  /**
   * @method clickPayAndConfirmOrderButton
   * @description Clicks the 'Pay and Confirm Order' button.
   */
  async clickPayAndConfirmOrderButton() {
    await this.locators.pay_and_confirm_order_button.click();
  }

  /**
   * @method initLocators
   * @description Initializes and returns a collection of locators for the CheckoutPage.
   * @returns {CheckoutPageLocators} A record of named Playwright Locator objects.
   */
  private initLocators(): CheckoutPageLocators {
    return {
      proceed_to_checkout_button: this.page.getByText("Proceed To Checkout"),
      continue_on_cart_button: this.page.getByRole("button", {
        name: "Continue On Cart",
      }),
      register_login_link: this.page.getByRole("link", {
        name: "Register / Login",
      }),
      delivery_address_heading: this.page.getByRole("heading", {
        name: "Your delivery address",
      }),
      billing_address_heading: this.page.getByRole("heading", {
        name: "Your billing address",
      }),
      comment_text_area: this.page.locator('textarea[name="message"]'),
      place_order_link: this.page.getByRole("link", { name: "Place Order" }),
      name_on_card_field: this.page.locator('input[name="name_on_card"]'),
      card_number_field: this.page.locator('input[name="card_number"]'),
      cvc_field: this.page.getByRole("textbox", { name: "ex" }),
      expiration_month_field: this.page.getByRole("textbox", { name: "MM" }),
      expiration_year_field: this.page.getByRole("textbox", { name: "YY" }),
      pay_and_confirm_order_button: this.page.getByRole("button", {
        name: "Pay and Confirm Order",
      }),
      order_placed_success_message: this.page.getByText(
        "Congratulations! Your order"
      ),
    };
  }
}
