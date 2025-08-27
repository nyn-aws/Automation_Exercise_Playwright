import { test, expect, Locator } from "@playwright/test";
import {
  Homepage,
  DateSelection,
  RegistrationFormData,
} from "../src/pages/homepage";
import { CommonUtils } from "../src/utils/commonUtils";

//  Variables
const name_value: string = "AutomationUser1";
const address_data: string =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const dateSelection: DateSelection = {
  day: "15",
  month: "January",
  year: "2000",
};
const random_password: string = CommonUtils.generateRandomPassword();
const registrationFormData: RegistrationFormData = {
  firstName: "Automation",
  lastName: "Automation",
  company: "Automation",
  address1: address_data,
  address2: address_data,
  country: "United States",
  state: "California",
  city: "Los Angeles",
  zipcode: "90001",
  mobileNumber: "1234567890",
  password: random_password,
};

// Testcases
test.describe("Automation Exercise", () => {
  let homepage: Homepage;
  let email_value: string;

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);
    homepage = new Homepage(page);
    await homepage.goto();
    // Page Title and URL assertions
    await expect(page).toHaveURL("https://www.automationexercise.com/");
    await expect(page).toHaveTitle("Automation Exercise");
    await expect(homepage.locators.website_logo).toBeVisible();

    email_value = CommonUtils.generateRandomEmail();
  });
  test.afterEach(async ({ page }, testInfo) => {
    // Log test title,status and time taken in one log
    console.log(
      `Finished test: ${testInfo.title} with status: ${testInfo.status} in ${testInfo.duration}ms`
    );
  });

  test("Test Case 1: Register User", async ({ page }) => {
    test.slow();

    await homepage.navigateToSignup();
    await expect(homepage.locators.login_signup_button).toBeVisible();
    await expect(homepage.locators.new_user_sign_up).toBeVisible();
    await homepage.input_signup_details(name_value, email_value);

    // Assertions for Enter Account Information page
    await expect
      .soft(homepage.locators.enter_account_info_heading)
      .toBeVisible();
    await expect(homepage.locators.registration_form_name).toHaveValue(
      name_value
    );
    await expect(homepage.locators.registration_form_email).toHaveValue(
      email_value
    );

    await homepage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );

    // Assertions for registration form inputs
    await expect(homepage.locators.radio_button_mr).toBeChecked();
    await expect(homepage.locators.radio_button_mrs).not.toBeChecked();
    await expect(homepage.locators.registration_form_password).toHaveValue(
      random_password
    );
    await expect(homepage.locators.day_dropdown).toHaveValue("15");
    await expect(homepage.locators.month_dropdown).toHaveValue("1"); // Month 'January' has value '1'
    await expect(homepage.locators.year_dropdown).toHaveValue("2000");
    await expect(homepage.locators.newsletter_checkbox).toBeChecked();
    await expect(homepage.locators.receive_offers_checkbox).not.toBeChecked();
    await expect(homepage.locators.first_name_field).toHaveValue("Automation");
    await expect(homepage.locators.last_name_field).toHaveValue("Automation");
    await expect(homepage.locators.company_field).toHaveValue("Automation");
    await expect(homepage.locators.address1_field).toHaveValue(address_data);
    await expect(homepage.locators.address2_field).toHaveValue(address_data);
    await expect(homepage.locators.country_dropdown).toHaveValue(
      "United States"
    );
    await expect(homepage.locators.state_field).toHaveValue("California");
    await expect(homepage.locators.city_field).toHaveValue("Los Angeles");
    await expect(homepage.locators.zipcode_field).toHaveValue("90001");
    await expect(homepage.locators.mobile_number_field).toHaveValue(
      "1234567890"
    );

    await homepage.submitRegistrationForm();
    console.log("Account creation successful");

    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);

    // Assertions for Account Created page
    await expect(homepage.locators.account_created_heading).toBeVisible();
    await expect(homepage.locators.continue_button).toBeVisible();
    await homepage.continueToHomepage();

    // Assertions for Delete Account
    await homepage.deleteAccount();
    await expect(homepage.locators.account_deleted_heading).toBeVisible();
    await expect(homepage.locators.account_deleted_info).toBeVisible();

    await homepage.continueToHomepage();
    console.log("Account deletion successful");
  });

  test("Test Case 2: Login User with correct email and password", async ({
    page,
  }) => {
    // Creating a new account for this testcase
    await homepage.navigateToSignup();
    await homepage.input_signup_details(name_value, email_value);
    await homepage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );
    await homepage.submitRegistrationForm();
    console.log("Account creation successful");
    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);
    await homepage.continueToHomepage();

    await expect(page.getByText("Logged in as AutomationUser1")).toBeVisible();
    // Logout
    await homepage.locators.logout.click();
    await expect(homepage.locators.login_signup_button).toBeVisible();
    await homepage.input_login_details(email_value, random_password);
    await expect(page.getByText("Logged in as AutomationUser1")).toBeVisible();
    // await homepage.locators.logout.click();
    await homepage.deleteAccount();

    await expect(homepage.locators.account_deleted_heading).toBeVisible();
    await expect(homepage.locators.account_deleted_info).toBeVisible();

    await homepage.continueToHomepage();
    console.log("Account deletion successful");
  });

  test("Test Case 3: Login User with incorrect email and password", async ({
    page,
  }) => {
    await homepage.navigateToSignup();
    await homepage.input_signup_details(name_value, email_value);
    await homepage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );
    await homepage.submitRegistrationForm();
    console.log("Account creation successful");
    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);
    await homepage.continueToHomepage();

    await expect(page.getByText("Logged in as AutomationUser1")).toBeVisible();
    // Logout
    await homepage.locators.logout.click();
    await expect(homepage.locators.login_signup_button).toBeVisible();
    await homepage.input_login_details(
      email_value,
      random_password + "incorrect"
    );
    await expect(
      homepage.locators.incorrect_email_or_password_warning
    ).toBeVisible();
    await homepage.input_login_details(email_value, random_password);

    await expect(page.getByText("Logged in as AutomationUser1")).toBeVisible();
    // await homepage.locators.logout.click();
    await homepage.deleteAccount();

    await expect(homepage.locators.account_deleted_heading).toBeVisible();
    await expect(homepage.locators.account_deleted_info).toBeVisible();

    await homepage.continueToHomepage();
    console.log("Account deletion successful");
  });

  test("Test Case 4: Logout User", async ({ page }) => {
    // Creating a new account for this testcase
    await homepage.navigateToSignup();
    await homepage.input_signup_details(name_value, email_value);
    await homepage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );
    await homepage.submitRegistrationForm();
    console.log("Account creation successful");
    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);
    await homepage.continueToHomepage();

    await expect(page.getByText("Logged in as AutomationUser1")).toBeVisible();
    // Logout
    await homepage.locators.logout.click();
    await expect(homepage.locators.login_signup_button).toBeVisible();
    await homepage.input_login_details(email_value, random_password);
    await expect(page.getByText("Logged in as AutomationUser1")).toBeVisible();
    // await homepage.locators.logout.click();
    await homepage.deleteAccount();

    await expect(homepage.locators.account_deleted_heading).toBeVisible();
    await expect(homepage.locators.account_deleted_info).toBeVisible();

    await homepage.continueToHomepage();
    console.log("Account deletion successful");
  });

  test("Test Case 5: Register User with existing email", async ({ page }) => {
    // Creating a new account for this testcase
    await homepage.navigateToSignup();
    await homepage.input_signup_details(name_value, email_value);
    await homepage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );
    await homepage.submitRegistrationForm();
    console.log("Account creation successful");
    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);
    await homepage.continueToHomepage();

    await expect(page.getByText("Logged in as AutomationUser1")).toBeVisible();
    // Logout
    await homepage.locators.logout.click();
    await homepage.input_signup_details(name_value, email_value);
    await expect
      .soft(homepage.locators.email_already_exists_warning)
      .toBeVisible();
    await homepage.input_login_details(email_value, random_password);
    await expect(page.getByText("Logged in as AutomationUser1")).toBeVisible();
    // await homepage.locators.logout.click();
    await homepage.deleteAccount();

    await expect(homepage.locators.account_deleted_heading).toBeVisible();
    await expect(homepage.locators.account_deleted_info).toBeVisible();

    await homepage.continueToHomepage();
    console.log("Account deletion successful");
  });

  test("Test Case 6: Contact Us Form", async ({ page }) => {
    await homepage.navigate_to_contact_us();
    await expect(homepage.locators.contact_us_name_field).toBeVisible();
    await expect(homepage.locators.contact_us_email_field).toBeVisible();
    await expect(homepage.locators.contact_us_subject_field).toBeVisible();
    await expect(homepage.locators.contact_us_message_field).toBeVisible();
    await expect(homepage.locators.contact_us_submit_button).toBeVisible();

    await homepage.input_contact_form(
      name_value,
      email_value,
      CommonUtils.generateRandomString(10),
      CommonUtils.generateRandomString(50)
    );
    await page.waitForTimeout(2000);
    page.on("dialog", (dialog) => {
      console.log(dialog.message());
      console.log(dialog.type());

      dialog.accept();
    });
    await homepage.submit_contact_form();
    await expect(homepage.locators.contact_us_success_message).toBeVisible();
  });

  test("Test Case 7: Verify Test Cases Page", async ({ page }) => {
    await homepage.navigateToTestCases();
    await expect(homepage.locators.test_cases_heading).toBeVisible();
  });

  test("Test Case 8: Verify All Products and product detail page", async ({
    page,
  }) => {
    await homepage.navigateToProducts();
    await expect(homepage.locators.products_heading).toBeVisible();
    await homepage.listAllProducts();
    const product_name = "Men Tshirt";
    await homepage.view_product(product_name);

    // 9. Verify that detail is visible:
    // product name, category, price, availability, condition, brand
    await expect(
      page.getByRole("heading", { name: product_name })
    ).toBeVisible();
    await expect(homepage.locators.product_price_info).toBeVisible();
    await expect(homepage.locators.product_availability_info).toBeVisible();
    await expect(homepage.locators.product_condition_info).toBeVisible();
    await expect(homepage.locators.product_brand_info).toBeVisible();
  });

  test("Test Case 9: Search Product", async ({ page }) => {
    const product_name_value = "Tshirt";
    await homepage.navigateToProducts();
    await homepage.searchProducts(product_name_value);
    const searched_products = await homepage.listAllProducts();
    // validate whether the product name is present in the searched products
    const isProductFound = searched_products.some((product) =>
      product.name.includes(product_name_value)
    );
    // The some() method tests whether at least one element in the array passes the test implemented by the provided function.
    // In this case, it checks if the product name includes the searched product name.

    // const isProductFound = searched_products.every((product) =>
    //   product.name.includes(product_name_value)
    // );
    // The every() method tests whether all elements in the array pass the test implemented by the provided function.
    // In this case, it checks if the product name includes the searched product name.
    await expect(isProductFound).toBe(true);
    await page.waitForTimeout(2000);
  });

  test("Test Case 10: Verify Subscription in home page", async ({ page }) => {
    // subscription related locators assertions
    await expect(homepage.locators.subscription_heading).toBeVisible();
    await expect(homepage.locators.subscription_email_field).toBeVisible();
    await expect(homepage.locators.subscription_button).toBeVisible();

    await homepage.locators.subscription_email_field.fill(email_value);
    await expect(homepage.locators.subscription_email_field).toHaveValue(
      email_value
    );
    await homepage.locators.subscription_button.click();
    await expect(homepage.locators.subscription_success_message).toBeVisible();
  });

  test("Test Case 11: Verify Subscription in Cart page", async ({ page }) => {
    await homepage.navigateToCart();
    await expect(homepage.locators.subscription_heading).toBeVisible();
    await expect(homepage.locators.subscription_email_field).toBeVisible();
    await expect(homepage.locators.subscription_button).toBeVisible();

    await homepage.locators.subscription_email_field.fill(email_value);
    await expect(homepage.locators.subscription_email_field).toHaveValue(
      email_value
    );
    await homepage.locators.subscription_button.click();
    await expect(homepage.locators.subscription_success_message).toBeVisible();
  });

  test("Test Case 12: Add Products in Cart", async ({ page }) => {
    test.slow();
    await homepage.navigateToProducts();
    const all_products_data = await homepage.listAllProducts();
    // console.log(all_products_data);

    // Adding First two Products to cart
    const first_product = all_products_data[0];
    const second_product = all_products_data[1];
    console.log(first_product);
    console.log(second_product);

    await homepage.add_product_to_cart(first_product.name);
    await page.getByRole("button", { name: "Continue Shopping" }).click();
    await page.waitForLoadState("networkidle");
    await homepage.add_product_to_cart(second_product.name);
    await page.getByRole("link", { name: "View Cart" }).click();
    await page.waitForLoadState("networkidle");
    const cart_products_data = await homepage.listAllProductsInCart();
    expect(cart_products_data.length).toBe(2);

    await page.waitForTimeout(2000);

    // Validating product details in cart
    [first_product.name, second_product.name].forEach((name) => {
      const containsProduct = cart_products_data.some((product) =>
        product.name.includes(name)
      );
      expect(containsProduct).toBe(true);
    });
  });

  test("Test Case 13: Verify Product quantity in Cart", async ({ page }) => {
    test.slow();
    await homepage.navigateToProducts();
    const all_products_data = await homepage.listAllProducts();
    // console.log(all_products_data);

    // Adding First two Products to cart
    const first_product = all_products_data[0];
    await homepage.view_product(first_product.name);
    for (let index = 0; index < 3; index++) {
      await page.locator("#quantity").press("ArrowUp");
    }
    await page.getByRole("button", { name: " Add to cart" }).click();

    await page.getByRole("link", { name: "View Cart" }).click();
    await page.waitForLoadState("networkidle");
    const cart_products_data = await homepage.listAllProductsInCart();
    await page.waitForTimeout(2000);
    expect(cart_products_data.length).toBe(1);
    expect(cart_products_data[0].quantity).toBe("4");
  });

  test("Test Case 14: Place Order: Register while Checkout", async ({
    page,
  }) => {
    test.slow();
    await homepage.navigateToProducts();
    const all_products_data = await homepage.listAllProducts();
    const first_product = all_products_data[0];
    console.log(first_product);
    await homepage.add_product_to_cart(first_product.name);
    await page.getByRole("link", { name: "View Cart" }).click();
    await page.waitForLoadState("networkidle");
    const cart_products_data = await homepage.listAllProductsInCart();
    expect(cart_products_data.length).toBe(1);
    await page.waitForTimeout(2000);
    await homepage.navigateToCart();
    await homepage.locators.proceed_to_checkout_button.click();
    await expect(homepage.locators.continue_on_cart_button).toBeVisible();
    await homepage.locators.register_login_link.click();
    await expect(homepage.locators.login_signup_button).toBeVisible();
    await expect(homepage.locators.new_user_sign_up).toBeVisible();
    await homepage.input_signup_details(name_value, email_value);

    // Assertions for Enter Account Information page
    await expect
      .soft(homepage.locators.enter_account_info_heading)
      .toBeVisible();
    await expect(homepage.locators.registration_form_name).toHaveValue(
      name_value
    );
    await expect(homepage.locators.registration_form_email).toHaveValue(
      email_value
    );

    await homepage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );

    // Assertions for registration form inputs
    await expect(homepage.locators.radio_button_mr).toBeChecked();
    await expect(homepage.locators.radio_button_mrs).not.toBeChecked();
    await expect(homepage.locators.registration_form_password).toHaveValue(
      random_password
    );
    await expect(homepage.locators.day_dropdown).toHaveValue("15");
    await expect(homepage.locators.month_dropdown).toHaveValue("1"); // Month 'January' has value '1'
    await expect(homepage.locators.year_dropdown).toHaveValue("2000");
    await expect(homepage.locators.newsletter_checkbox).toBeChecked();
    await expect(homepage.locators.receive_offers_checkbox).not.toBeChecked();
    await expect(homepage.locators.first_name_field).toHaveValue("Automation");
    await expect(homepage.locators.last_name_field).toHaveValue("Automation");
    await expect(homepage.locators.company_field).toHaveValue("Automation");
    await expect(homepage.locators.address1_field).toHaveValue(address_data);
    await expect(homepage.locators.address2_field).toHaveValue(address_data);
    await expect(homepage.locators.country_dropdown).toHaveValue(
      "United States"
    );
    await expect(homepage.locators.state_field).toHaveValue("California");
    await expect(homepage.locators.city_field).toHaveValue("Los Angeles");
    await expect(homepage.locators.zipcode_field).toHaveValue("90001");
    await expect(homepage.locators.mobile_number_field).toHaveValue(
      "1234567890"
    );

    await homepage.submitRegistrationForm();
    console.log("Account creation successful");

    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);

    // Assertions for Account Created page
    await expect(homepage.locators.account_created_heading).toBeVisible();
    await expect(homepage.locators.continue_button).toBeVisible();
    await homepage.continueToHomepage();

    await homepage.navigateToCart();
    await homepage.locators.proceed_to_checkout_button.click();

    // 14. Verify Address Details and Review Your Order
    await expect(homepage.locators.delivery_address_heading).toBeVisible();
    await expect(homepage.locators.billing_address_heading).toBeVisible();

    // 15. Enter description in comment text area and click 'Place Order'
    await homepage.locators.comment_text_area.fill(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    );

    await homepage.locators.place_order_link.click();
    // 16. Enter payment details: Name on Card, Card Number, CVC, Expiration date
    await homepage.locators.name_on_card_field.fill(name_value);
    await homepage.locators.card_number_field.fill("1234 5678 9123 4567");
    await homepage.locators.cvc_field.fill("123");
    await homepage.locators.expiration_month_field.fill("12");
    await homepage.locators.expiration_year_field.fill("34");

    // 17. Click 'Pay and Confirm Order' button
    await homepage.locators.pay_and_confirm_order_button.click();

    // 18. Verify success message 'Your order has been placed successfully!'

    await expect(homepage.locators.order_placed_success_message).toBeVisible();

    // Assertions for Delete Account
    await homepage.deleteAccount();
    await expect(homepage.locators.account_deleted_heading).toBeVisible();
    await expect(homepage.locators.account_deleted_info).toBeVisible();

    await homepage.continueToHomepage();
    console.log("Account deletion successful");
  });

  test("Test Case 15: Place Order: Register before Checkout", async ({
    page,
  }) => {
    test.slow();

    await homepage.navigateToSignup();
    await expect(homepage.locators.login_signup_button).toBeVisible();
    await expect(homepage.locators.new_user_sign_up).toBeVisible();
    await homepage.input_signup_details(name_value, email_value);

    // Assertions for Enter Account Information page
    await expect
      .soft(homepage.locators.enter_account_info_heading)
      .toBeVisible();
    await expect(homepage.locators.registration_form_name).toHaveValue(
      name_value
    );
    await expect(homepage.locators.registration_form_email).toHaveValue(
      email_value
    );

    await homepage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );

    // Assertions for registration form inputs
    await expect(homepage.locators.radio_button_mr).toBeChecked();
    await expect(homepage.locators.radio_button_mrs).not.toBeChecked();
    await expect(homepage.locators.registration_form_password).toHaveValue(
      random_password
    );
    await expect(homepage.locators.day_dropdown).toHaveValue("15");
    await expect(homepage.locators.month_dropdown).toHaveValue("1"); // Month 'January' has value '1'
    await expect(homepage.locators.year_dropdown).toHaveValue("2000");
    await expect(homepage.locators.newsletter_checkbox).toBeChecked();
    await expect(homepage.locators.receive_offers_checkbox).not.toBeChecked();
    await expect(homepage.locators.first_name_field).toHaveValue("Automation");
    await expect(homepage.locators.last_name_field).toHaveValue("Automation");
    await expect(homepage.locators.company_field).toHaveValue("Automation");
    await expect(homepage.locators.address1_field).toHaveValue(address_data);
    await expect(homepage.locators.address2_field).toHaveValue(address_data);
    await expect(homepage.locators.country_dropdown).toHaveValue(
      "United States"
    );
    await expect(homepage.locators.state_field).toHaveValue("California");
    await expect(homepage.locators.city_field).toHaveValue("Los Angeles");
    await expect(homepage.locators.zipcode_field).toHaveValue("90001");
    await expect(homepage.locators.mobile_number_field).toHaveValue(
      "1234567890"
    );

    await homepage.submitRegistrationForm();
    console.log("Account creation successful");

    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);

    // Assertions for Account Created page
    await expect(homepage.locators.account_created_heading).toBeVisible();
    await expect(homepage.locators.continue_button).toBeVisible();
    await homepage.continueToHomepage();

    await homepage.navigateToProducts();
    const all_products_data = await homepage.listAllProducts();
    const first_product = all_products_data[0];
    console.log(first_product);
    await homepage.add_product_to_cart(first_product.name);
    await page.getByRole("link", { name: "View Cart" }).click();
    await page.waitForLoadState("networkidle");
    const cart_products_data = await homepage.listAllProductsInCart();
    expect(cart_products_data.length).toBe(1);
    await page.waitForTimeout(2000);
    await homepage.navigateToCart();

    await homepage.locators.proceed_to_checkout_button.click();

    // 14. Verify Address Details and Review Your Order
    await expect(homepage.locators.delivery_address_heading).toBeVisible();
    await expect(homepage.locators.billing_address_heading).toBeVisible();

    // 15. Enter description in comment text area and click 'Place Order'
    await homepage.locators.comment_text_area.fill(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    );

    await homepage.locators.place_order_link.click();
    // 16. Enter payment details: Name on Card, Card Number, CVC, Expiration date
    await homepage.locators.name_on_card_field.fill(name_value);
    await homepage.locators.card_number_field.fill("1234 5678 9123 4567");
    await homepage.locators.cvc_field.fill("123");
    await homepage.locators.expiration_month_field.fill("12");
    await homepage.locators.expiration_year_field.fill("34");

    // 17. Click 'Pay and Confirm Order' button
    await homepage.locators.pay_and_confirm_order_button.click();

    // 18. Verify success message 'Your order has been placed successfully!'

    await expect(homepage.locators.order_placed_success_message).toBeVisible();

    // Assertions for Delete Account
    await homepage.deleteAccount();
    await expect(homepage.locators.account_deleted_heading).toBeVisible();
    await expect(homepage.locators.account_deleted_info).toBeVisible();

    await homepage.continueToHomepage();
    console.log("Account deletion successful");
  });

  test("Test Case 16: Place Order: Login before Checkout", async ({ page }) => {
    // Create Account
    test.slow();
    await homepage.navigateToSignup();
    await expect(homepage.locators.login_signup_button).toBeVisible();
    await expect(homepage.locators.new_user_sign_up).toBeVisible();
    await homepage.input_signup_details(name_value, email_value);

    // Assertions for Enter Account Information page
    await expect
      .soft(homepage.locators.enter_account_info_heading)
      .toBeVisible();
    await expect(homepage.locators.registration_form_name).toHaveValue(
      name_value
    );
    await expect(homepage.locators.registration_form_email).toHaveValue(
      email_value
    );

    await homepage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );

    // Assertions for registration form inputs
    await expect(homepage.locators.radio_button_mr).toBeChecked();
    await expect(homepage.locators.radio_button_mrs).not.toBeChecked();
    await expect(homepage.locators.registration_form_password).toHaveValue(
      random_password
    );
    await expect(homepage.locators.day_dropdown).toHaveValue("15");
    await expect(homepage.locators.month_dropdown).toHaveValue("1"); // Month 'January' has value '1'
    await expect(homepage.locators.year_dropdown).toHaveValue("2000");
    await expect(homepage.locators.newsletter_checkbox).toBeChecked();
    await expect(homepage.locators.receive_offers_checkbox).not.toBeChecked();
    await expect(homepage.locators.first_name_field).toHaveValue("Automation");
    await expect(homepage.locators.last_name_field).toHaveValue("Automation");
    await expect(homepage.locators.company_field).toHaveValue("Automation");
    await expect(homepage.locators.address1_field).toHaveValue(address_data);
    await expect(homepage.locators.address2_field).toHaveValue(address_data);
    await expect(homepage.locators.country_dropdown).toHaveValue(
      "United States"
    );
    await expect(homepage.locators.state_field).toHaveValue("California");
    await expect(homepage.locators.city_field).toHaveValue("Los Angeles");
    await expect(homepage.locators.zipcode_field).toHaveValue("90001");
    await expect(homepage.locators.mobile_number_field).toHaveValue(
      "1234567890"
    );

    await homepage.submitRegistrationForm();
    console.log("Account creation successful");

    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);

    // Assertions for Account Created page
    await expect(homepage.locators.account_created_heading).toBeVisible();
    await expect(homepage.locators.continue_button).toBeVisible();
    await homepage.continueToHomepage();

    // Logout from account
    await homepage.locators.logout.click();
    await expect(homepage.locators.login_signup_button).toBeVisible();

    // Add product to cart
    await homepage.navigateToProducts();
    const all_products_data = await homepage.listAllProducts();
    const first_product = all_products_data[0];
    await homepage.add_product_to_cart(first_product.name);
    await page.getByRole("link", { name: "View Cart" }).click();
    await page.waitForLoadState("networkidle");
    const cart_products_data = await homepage.listAllProductsInCart();
    expect(cart_products_data.length).toBe(1);

    // proceed to checkout
    await homepage.navigateToCart();
    await homepage.locators.proceed_to_checkout_button.click();

    // login to account
    await homepage.locators.register_login_link.click();
    await homepage.input_login_details(email_value, random_password);
    // placeorder
    await homepage.navigateToCart();
    await homepage.locators.proceed_to_checkout_button.click();
    await expect(homepage.locators.delivery_address_heading).toBeVisible();
    await expect(homepage.locators.billing_address_heading).toBeVisible();

    await homepage.locators.comment_text_area.fill(
      "Order placed after login before checkout."
    );
    await homepage.locators.place_order_link.click();

    await homepage.locators.name_on_card_field.fill(name_value);
    await homepage.locators.card_number_field.fill("1234 5678 9123 4567");
    await homepage.locators.cvc_field.fill("123");
    await homepage.locators.expiration_month_field.fill("12");
    await homepage.locators.expiration_year_field.fill("34");
    await homepage.locators.pay_and_confirm_order_button.click();

    await expect(homepage.locators.order_placed_success_message).toBeVisible();

    // Delete Account
    await homepage.deleteAccount();
    await expect(homepage.locators.account_deleted_heading).toBeVisible();
    await expect(homepage.locators.account_deleted_info).toBeVisible();
    await homepage.continueToHomepage();
    //
  });
});
