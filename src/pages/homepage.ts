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
  password: string;
}
interface CartProduct {
  name: string;
  price: string;
  quantity: string;
  total: string;
}

export class Homepage {
  private page: Page;
  public locators: Record<string, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.locators = this.initLocators();
  }

  // ---------------------------
  // Navigation Methods
  // ---------------------------

  async goto(url: string = "") {
    await this.page.goto(url);
    // await this.page.waitForLoadState("networkidle");
  }

  async navigateToSignup() {
    await this.locators.login_signup_button.click();
    // await this.page.waitForLoadState("networkidle");
  }

  async continueToHomepage() {
    await this.locators.continue_button.click();
  }

  async deleteAccount() {
    await this.locators.delete_account_button.click();
  }

  async navigate_to_contact_us() {
    await this.locators.contact_us_link.click();
  }

  async navigateToTestCases() {
    await this.locators.test_cases_link.click();
  }

  async navigateToProducts() {
    await this.locators.products_link.click();
  }
  async navigateToCart() {
    await this.locators.cart_link.click();
  }

  // ---------------------------
  // Authentication Methods
  // ---------------------------

  async input_login_details(email_value: string, password_value: string) {
    await this.locators.login_form_email.fill(email_value);
    await this.locators.login_form_password.fill(password_value);
    await this.locators.login_form_button.click();
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

  // ---------------------------
  // Contact Us Methods
  // ---------------------------

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

  async submit_contact_form() {
    await this.locators.contact_us_submit_button.click();
  }

  // ---------------------------
  // Product Methods
  // ---------------------------

  async searchProducts(product_name: string) {
    await this.locators.search_product_field.fill(product_name);
    await this.locators.search_product_button.click();
  }

  async getCountOfProducts() {
    const count_of_product = await this.locators.all_products.count();
    console.log(`Count of products: ${count_of_product}`);
    return count_of_product;
  }

  async add_product_to_cart(product_name: string) {
    const product = this.locators.all_products.filter({
      hasText: product_name,
    });
    await product.first().locator(".add-to-cart").first().click();
  }

  async view_product(product_name: string) {
    const product = this.locators.all_products.filter({
      hasText: product_name,
    });
    await product.getByText("View Product").click();
    await this.page.waitForLoadState("networkidle");
  }

  async listAllProducts() {
    const product_names = await this.locators.all_products
      .locator(".productinfo")
      .getByRole("paragraph")
      .allInnerTexts();
    const product_prices = await this.locators.all_products
      .locator(".productinfo")
      .getByRole("heading")
      .allInnerTexts();

    const products = product_names.map((name, index) => {
      return { name, price: product_prices[index] };
    });

    // console.log("List of all products:");
    // products.forEach((product) =>
    //   console.log(`Name: ${product.name}, Price: ${product.price}`)
    // );
    return products;
  }

  async listAllProductsInCart(): Promise<CartProduct[]> {
    const rows = this.page.locator("tbody tr");
    let rows_data: CartProduct[] = [];
    for (const row of await rows.all()) {
      const product_name = await row.locator(".cart_description a").innerText();
      const product_price = await row.locator(".cart_price").innerText();
      const product_quantity = await row.locator(".cart_quantity").innerText();
      const product_total = await row.locator(".cart_total_price").innerText();
      rows_data.push({
        name: product_name,
        price: product_price,
        quantity: product_quantity,
        total: product_total,
      });
    }

    console.log(rows_data);

    return rows_data;
  }

  async filter_by_brand(
    brand_name:
      | "POLO"
      | "H&M"
      | "Madame"
      | "Mast & Harbour"
      | "Babyhug"
      | "Allen Solly Junior"
      | "Kookie Kids"
      | "Biba"
  ) {
    const brand_locator = this.page.getByRole("link", { name: brand_name });
    await brand_locator.click();
    await this.page.waitForLoadState("networkidle");
  }

  // ---------------------------
  // Private Helper Methods
  // ---------------------------

  private initLocators(): Record<string, Locator> {
    const sign_up_form = this.page.locator(".signup-form");
    const registration_form = this.page.locator(".login-form");
    const login_form = this.page.locator(".login-form");
    const contact_form = this.page.locator(".contact-form");

    return {
      website_logo: this.page.getByAltText("Website for automation practice"),
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

      // products
      products_link: this.page.getByRole("link", { name: " Products" }),
      products_heading: this.page.getByRole("heading", {
        name: "All Products",
      }),
      all_products: this.page.locator(".col-sm-4"),
      all_products_info: this.page.locator(".productinfo .product-details"),
      search_product_field: this.page.getByRole("textbox", {
        name: "Search Product",
      }),
      search_product_button: this.page.getByRole("button", { name: "" }),

      // products category
      women_category: this.page.getByRole("heading", { name: " Women" }),
      men_category: this.page.getByRole("heading", { name: " Men" }),
      kids_category: this.page.getByRole("heading", { name: " Kids" }),

      // product brands
      polo_brand: this.page.getByRole("link", { name: /Polo$/ }),
      h_and_m_brand: this.page.getByRole("link", { name: /H&M$/ }),
      madame_brand: this.page.getByRole("link", { name: /Madame$/ }),
      mast_and_harbour_brand: this.page.getByRole("link", {
        name: /Mast & Harbour$/,
      }),
      babyhug_brand: this.page.getByRole("link", { name: /Babyhug$/ }),
      allen_solly_junior_brand: this.page.getByRole("link", {
        name: /Allen Solly Junior$/,
      }),
      kookie_kids_brand: this.page.getByRole("link", { name: /Kookie Kids$/ }),
      biba_brand: this.page.getByRole("link", { name: /Biba$/ }),

      // Product detail page
      product_price_info: this.page.getByText("Rs."),
      product_availability_info: this.page.getByText("Availability:"),
      product_condition_info: this.page.getByText("Condition:"),
      product_brand_info: this.page.getByText("Brand:"),

      // Subscription
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
      cart_link: this.page.getByRole("link", { name: "Cart" }),

      // Checkout process
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
