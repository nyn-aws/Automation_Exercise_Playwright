import { Page, Locator } from "@playwright/test";
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
