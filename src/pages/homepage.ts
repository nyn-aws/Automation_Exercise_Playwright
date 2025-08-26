import { Page, Locator } from "@playwright/test";

export interface DateSelection {
  day: string;
  month: string;
  year: string;
}

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
  password: string; // Add password to the interface
}

export class Homepage {
  private page: Page;
  public locators: Record<string, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.locators = this.initLocators();
  }

  async goto(url: string = "") {
    this.page.goto("");
    this.page.waitForLoadState("networkidle");
  }

  async navigateToSignup() {
    await this.locators.login_signup_button.click();
    await this.page.waitForLoadState("networkidle");
  }

  async input_signup_details(name_value: string, email_value: string) {
    await this.locators.sign_up_name_field.fill(name_value);
    await this.locators.sign_up_email_field.fill(email_value);
    await this.locators.sign_up_button.click();
  }

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

  async submitRegistrationForm() {
    await this.locators.create_account_button.click();
  }

  async continueToHomepage() {
    await this.locators.continue_button.click();
  }

  async deleteAccount() {
    await this.locators.delete_account_button.click();
  }

  private initLocators(): Record<string, Locator> {
    const sign_up_form = this.page.locator(".signup-form");
    const registration_form = this.page.locator(".login-form");

    return {
      website_logo: this.page.getByAltText("Website for automation practice"),
      login_signup_button: this.page.getByRole("link", {
        name: " Signup / Login",
      }),
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
    };
  }
}
