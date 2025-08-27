import { Page, Locator } from "@playwright/test";

/**
 * @interface DateSelection
 * @description Defines the structure for selecting a date (day, month, year) during registration.
 */
export interface DateSelection {
  day: string;
  month: string;
  year: string;
}

/**
 * @interface RegistrationFormData
 * @description Defines the structure for the user registration form data.
 */
export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
  password: string;
}

/**
 * @interface AuthPageLocators
 * @description Defines the locators used within the AuthPage for interacting with authentication-related elements.
 */
interface AuthPageLocators {
  login_signup_button: Locator;
  login_form: Locator;
  login_form_email: Locator;
  login_form_password: Locator;
  login_form_button: Locator;
  new_user_sign_up: Locator;
  sign_up_form: Locator;
  sign_up_name_field: Locator;
  sign_up_email_field: Locator;
  sign_up_button: Locator;
  enter_account_info_heading: Locator;
  registration_form: Locator;
  radio_button_mr: Locator;
  radio_button_mrs: Locator;
  registration_form_name: Locator;
  registration_form_email: Locator;
  registration_form_password: Locator;
  day_dropdown: Locator;
  month_dropdown: Locator;
  year_dropdown: Locator;
  newsletter_checkbox: Locator;
  receive_offers_checkbox: Locator;
  address_information_heading: Locator;
  first_name_field: Locator;
  last_name_field: Locator;
  company_field: Locator;
  address1_field: Locator;
  address2_field: Locator;
  country_dropdown: Locator;
  state_field: Locator;
  city_field: Locator;
  zipcode_field: Locator;
  mobile_number_field: Locator;
  create_account_button: Locator;
  account_created_heading: Locator;
  continue_button: Locator;
  delete_account_button: Locator;
  account_deleted_heading: Locator;
  account_deleted_info: Locator;
  logout: Locator;
  incorrect_email_or_password_warning: Locator;
  email_already_exists_warning: Locator;
  logged_in_as_user: (name_value: string) => Locator;
}

/**
 * @class AuthPage
 * @description Represents the Authentication page, containing methods and locators for user registration, login, and account management.
 */
export class AuthPage {
  private page: Page;
  public locators: AuthPageLocators;

  /**
   * @constructor
   * @param {Page} page - Playwright's Page object.
   */
  constructor(page: Page) {
    this.page = page;
    this.locators = this.initLocators();
  }

  /**
   * @method navigateToSignup
   * @description Navigates to the signup/login page by clicking the 'Signup / Login' button.
   */
  async navigateToSignup() {
    await this.locators.login_signup_button.click();
    // await this.page.waitForLoadState("networkidle");
  }

  /**
   * @method continueToHomepage
   * @description Clicks the 'Continue' button to navigate to the homepage.
   */
  async continueToHomepage() {
    await this.locators.continue_button.click();
  }

  /**
   * @method deleteAccount
   * @description Clicks the 'Delete Account' button to initiate account deletion.
   */
  async deleteAccount() {
    await this.locators.delete_account_button.click();
  }

  /**
   * @method input_login_details
   * @description Fills in the login form with the provided email and password, then clicks the login button.
   * @param {string} email_value - The user's email address.
   * @param {string} password_value - The user's password.
   */
  async input_login_details(email_value: string, password_value: string) {
    await this.locators.login_form_email.fill(email_value);
    await this.locators.login_form_password.fill(password_value);
    await this.locators.login_form_button.click();
  }

  /**
   * @method input_signup_details
   * @description Fills in the signup form with the provided name and email, then clicks the signup button.
   * @param {string} name_value - The user's name.
   * @param {string} email_value - The user's email address.
   */
  async input_signup_details(name_value: string, email_value: string) {
    await this.locators.sign_up_name_field.fill(name_value);
    await this.locators.sign_up_email_field.fill(email_value);
    await this.locators.sign_up_button.click();
  }

  /**
   * @method input_registration_form_details
   * @description Fills in the full registration form with date selection and user data.
   * @param {DateSelection} dateSelection - Object containing day, month, and year for date of birth.
   * @param {RegistrationFormData} formData - Object containing all other registration form data.
   */
  async input_registration_form_details(
    dateSelection: DateSelection,
    formData: RegistrationFormData
  ) {
    await this.locators.radio_button_mr.check();
    await this.locators.registration_form_password.fill(formData.password);
    await this.locators.day_dropdown.selectOption(dateSelection.day);
    await this.locators.month_dropdown.selectOption(dateSelection.month);
    await this.locators.year_dropdown.selectOption(dateSelection.year);
    await this.locators.newsletter_checkbox.check();
    await this.locators.receive_offers_checkbox.check();
    await this.locators.receive_offers_checkbox.uncheck();
    await this.locators.first_name_field.fill(formData.firstName);
    await this.locators.last_name_field.fill(formData.lastName);
    await this.locators.company_field.fill(formData.company);
    await this.locators.address1_field.fill(formData.address1);
    await this.locators.address2_field.fill(formData.address2);
    await this.locators.country_dropdown.selectOption(formData.country);
    await this.locators.state_field.fill(formData.state);
    await this.locators.city_field.fill(formData.city);
    await this.locators.zipcode_field.fill(formData.zipcode);
    await this.locators.mobile_number_field.fill(formData.mobileNumber);
  }

  /**
   * @method submitRegistrationForm
   * @description Clicks the 'Create Account' button to submit the registration form.
   */
  async submitRegistrationForm() {
    await this.locators.create_account_button.click();
  }

  /**
   * @method initLocators
   * @description Initializes and returns a collection of locators for the AuthPage.
   * @returns {AuthPageLocators} A record of named Playwright Locator objects.
   */
  private initLocators(): AuthPageLocators {
    const sign_up_form = this.page.locator(".signup-form");
    const registration_form = this.page.locator(".login-form");
    const login_form = this.page.locator(".login-form");

    return {
      login_signup_button: this.page.getByRole("link", {
        name: " Signup / Login",
      }),
      login_form: login_form,
      login_form_email: login_form.getByPlaceholder("Email Address"),
      login_form_password: login_form.getByPlaceholder("Password"),
      login_form_button: login_form.getByRole("button"),
      new_user_sign_up: this.page.getByText("New User Signup!"),
      sign_up_form: sign_up_form,
      sign_up_name_field: sign_up_form.getByPlaceholder("Name"),
      sign_up_email_field: sign_up_form.getByPlaceholder("Email Address"),
      sign_up_button: sign_up_form.getByRole("button"),
      enter_account_info_heading: this.page.getByRole("heading", {
        name: "Enter Account Information",
      }),
      registration_form: registration_form,
      radio_button_mr: registration_form.getByRole("radio", { name: "Mr." }),
      radio_button_mrs: registration_form.getByRole("radio", { name: "Mrs." }),
      registration_form_name: registration_form.getByRole("textbox", {
        name: "Name *",
        exact: true,
      }),
      registration_form_email: registration_form.getByRole("textbox", {
        name: "Email *",
        exact: true,
      }),
      registration_form_password: registration_form.getByRole("textbox", {
        name: "Password *",
      }),
      day_dropdown: registration_form.locator("#days"),
      month_dropdown: registration_form.locator("#months"),
      year_dropdown: registration_form.locator("#years"),
      newsletter_checkbox: registration_form.getByRole("checkbox", {
        name: "Sign up for our newsletter!",
      }),
      receive_offers_checkbox: registration_form.getByRole("checkbox", {
        name: "Receive special offers from",
      }),
      address_information_heading: registration_form.getByText(
        "Address Information"
      ),
      first_name_field: registration_form.getByRole("textbox", {
        name: "First name *",
      }),
      last_name_field: registration_form.getByRole("textbox", {
        name: "Last name *",
      }),
      company_field: registration_form.getByRole("textbox", {
        name: "Company",
        exact: true,
      }),
      address1_field: registration_form.getByRole("textbox", {
        name: "Address * (Street address, P.",
      }),
      address2_field: registration_form.getByRole("textbox", {
        name: "Address 2",
      }),
      country_dropdown: registration_form.getByLabel("Country *"),
      state_field: registration_form.getByRole("textbox", { name: "State *" }),
      city_field: registration_form.getByRole("textbox", { name: "City *" }),
      zipcode_field: registration_form.locator("#zipcode"),
      mobile_number_field: registration_form.getByRole("textbox", {
        name: "Mobile Number *",
      }),
      create_account_button: registration_form.getByRole("button", {
        name: "Create Account",
      }),
      account_created_heading: this.page.getByText("Account Created!"),
      continue_button: this.page.getByRole("link", { name: "Continue" }),
      delete_account_button: this.page.getByRole("link", {
        name: "Delete Account",
      }),
      account_deleted_heading: this.page.getByText("Account Deleted!"),
      account_deleted_info: this.page.getByText(
        "Your account has been permanently deleted!"
      ),
      logout: this.page.getByRole("link", { name: "Logout" }),
      incorrect_email_or_password_warning: this.page.getByText(
        "Your email or password is incorrect!"
      ),
      email_already_exists_warning: this.page.getByText(
        "Email Address already exist!"
      ),
      logged_in_as_user: (name_value: string) =>
        this.page.getByText(`Logged in as ${name_value}`),
    };
  }
}
