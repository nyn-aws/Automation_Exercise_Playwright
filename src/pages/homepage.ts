import { Page, Locator } from "@playwright/test";

interface HomepageLocators {
  website_logo: Locator;
  contact_us_link: Locator;
  contact_form: Locator;
  contact_us_heading: Locator;
  contact_us_name_field: Locator;
  contact_us_email_field: Locator;
  contact_us_subject_field: Locator;
  contact_us_message: Locator;
  contact_us_message_field: Locator;
  contact_us_submit_button: Locator;
  contact_us_success_message: Locator;
  test_cases_link: Locator;
  test_cases_heading: Locator;
  subscription_heading: Locator;
  subscription_email_field: Locator;
  subscription_button: Locator;
  subscription_success_message: Locator;
  products_link: Locator;
}

/**
 * @class Homepage
 * @description Represents the Homepage of the application, containing methods and locators for general navigation, contact form, and subscription features.
 */
export class Homepage {
  private page: Page;
  public locators: HomepageLocators;

  /**
   * @constructor
   * @param {Page} page - Playwright's Page object.
   */
  constructor(page: Page) {
    this.page = page;
    this.locators = this.initLocators();
  }

  // ---------------------------
  // Navigation Methods
  // ---------------------------

  /**
   * @method goto
   * @description Navigates the page to the specified URL. If no URL is provided, it navigates to the base URL.
   * @param {string} url - The URL to navigate to (optional).
   */
  async goto(url: string = "") {
    await this.page.goto(url);
    // await this.page.waitForLoadState("networkidle");
  }

  /**
   * @method navigate_to_contact_us
   * @description Navigates to the Contact Us page.
   */
  async navigate_to_contact_us() {
    await this.locators.contact_us_link.click();
  }

  /**
   * @method navigateToTestCases
   * @description Navigates to the Test Cases page.
   */
  async navigateToTestCases() {
    await this.locators.test_cases_link.click();
  }

  /**
   * @method navigateToProducts
   * @description Navigates to the Products page.
   */
  async navigateToProducts() {
    await this.locators.products_link.click();
  }

  // ---------------------------
  // Contact Us Methods
  // ---------------------------

  /**
   * @method input_contact_form
   * @description Fills in the Contact Us form fields.
   * @param {string} name - The name to enter.
   * @param {string} email - The email to enter.
   * @param {string} subject - The subject to enter.
   * @param {string} message - The message to enter.
   */
  async input_contact_form(
    name: string,
    email: string,
    subject: string,
    message: string
  ) {
    await this.locators.contact_us_name_field.fill(name);
    await this.locators.contact_us_email_field.fill(email);
    await this.locators.contact_us_subject_field.fill(subject);
    await this.locators.contact_us_message_field.fill(message);
  }

  /**
   * @method submit_contact_form
   * @description Submits the Contact Us form.
   */
  async submit_contact_form() {
    await this.locators.contact_us_submit_button.click();
  }

  // ---------------------------
  // Subscription Methods
  // ---------------------------
  /**
   * @method input_subscription_email
   * @description Fills in the subscription email field.
   * @param {string} email - The email address to subscribe with.
   */
  async input_subscription_email(email: string) {
    await this.locators.subscription_email_field.fill(email);
  }

  /**
   * @method click_subscription_button
   * @description Clicks the subscription button.
   */
  async click_subscription_button() {
    await this.locators.subscription_button.click();
  }

  // ---------------------------
  // Private Helper Methods
  // ---------------------------

  /**
   * @method initLocators
   * @description Initializes and returns a collection of locators for the Homepage.
   * @returns {HomepageLocators} A record of named Playwright Locator objects.
   */
  private initLocators(): HomepageLocators {
    const contact_form = this.page.locator(".contact-form");

    return {
      website_logo: this.page.getByAltText("Website for automation practice"),
      // contact us form
      contact_us_link: this.page.getByRole("link", { name: " Contact us" }),
      contact_form: contact_form,
      contact_us_heading: contact_form.getByRole("heading", {
        name: "Contact Us",
      }),
      contact_us_name_field: contact_form.getByPlaceholder("Name"),
      contact_us_email_field: contact_form.getByPlaceholder("Email"),
      contact_us_subject_field: contact_form.getByPlaceholder("Subject"),
      contact_us_message: contact_form.getByRole("textbox", {
        name: "Message",
      }),
      contact_us_message_field: contact_form.getByPlaceholder("Message"),
      contact_us_submit_button: contact_form.getByRole("button", {
        name: "Submit",
      }),
      contact_us_success_message: contact_form.getByText(
        "Success! Your details have been submitted successfully."
      ),
      test_cases_link: this.page.getByRole("link", { name: " Test Cases" }),
      test_cases_heading: this.page.locator("b", { hasText: "Test Cases" }),
      subscription_heading: this.page.getByRole("heading", {
        name: "Subscription",
      }),
      subscription_email_field: this.page.getByRole("textbox", {
        name: "Your email address",
      }),
      subscription_button: this.page.getByRole("button", { name: "" }),
      subscription_success_message: this.page.getByText(
        "You have been successfully subscribed!"
      ),
      products_link: this.page.getByRole("link", { name: " Products" }),
    };
  }
}
