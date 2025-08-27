import { test, expect } from "@playwright/test";
import { PageObjectManager } from "../src/pages/PageObjectManager";
import { DateSelection, RegistrationFormData } from "../src/pages/authPage";
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
  let pageObjectManager: PageObjectManager;
  let email_value: string;
  let homepage: ReturnType<PageObjectManager["getHomePage"]>;
  let authPage: ReturnType<PageObjectManager["getAuthPage"]>;
  let productsPage: ReturnType<PageObjectManager["getProductsPage"]>;
  let cartPage: ReturnType<PageObjectManager["getCartPage"]>;
  let checkoutPage: ReturnType<PageObjectManager["getCheckoutPage"]>;

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);
    pageObjectManager = new PageObjectManager(page);
    homepage = pageObjectManager.getHomePage();
    authPage = pageObjectManager.getAuthPage();
    productsPage = pageObjectManager.getProductsPage();
    cartPage = pageObjectManager.getCartPage();
    checkoutPage = pageObjectManager.getCheckoutPage();

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

    await authPage.navigateToSignup();
    await expect(authPage.locators.login_signup_button).toBeVisible();
    await expect(authPage.locators.new_user_sign_up).toBeVisible();
    await authPage.input_signup_details(name_value, email_value);

    // Assertions for Enter Account Information page
    await expect
      .soft(authPage.locators.enter_account_info_heading)
      .toBeVisible();
    await expect(authPage.locators.registration_form_name).toHaveValue(
      name_value
    );
    await expect(authPage.locators.registration_form_email).toHaveValue(
      email_value
    );

    await authPage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );

    // Assertions for registration form inputs
    await expect(authPage.locators.radio_button_mr).toBeChecked();
    await expect(authPage.locators.radio_button_mrs).not.toBeChecked();
    await expect(authPage.locators.registration_form_password).toHaveValue(
      random_password
    );
    await expect(authPage.locators.day_dropdown).toHaveValue("15");
    await expect(authPage.locators.month_dropdown).toHaveValue("1"); // Month 'January' has value '1'
    await expect(authPage.locators.year_dropdown).toHaveValue("2000");
    await expect(authPage.locators.newsletter_checkbox).toBeChecked();
    await expect(authPage.locators.receive_offers_checkbox).not.toBeChecked();
    await expect(authPage.locators.first_name_field).toHaveValue("Automation");
    await expect(authPage.locators.last_name_field).toHaveValue("Automation");
    await expect(authPage.locators.company_field).toHaveValue("Automation");
    await expect(authPage.locators.address1_field).toHaveValue(address_data);
    await expect(authPage.locators.address2_field).toHaveValue(address_data);
    await expect(authPage.locators.country_dropdown).toHaveValue(
      "United States"
    );
    await expect(authPage.locators.state_field).toHaveValue("California");
    await expect(authPage.locators.city_field).toHaveValue("Los Angeles");
    await expect(authPage.locators.zipcode_field).toHaveValue("90001");
    await expect(authPage.locators.mobile_number_field).toHaveValue(
      "1234567890"
    );

    await authPage.submitRegistrationForm();
    console.log("Account creation successful");

    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);

    // Assertions for Account Created page
    await expect(authPage.locators.account_created_heading).toBeVisible();
    await expect(authPage.locators.continue_button).toBeVisible();
    await authPage.continueToHomepage();

    // Assertions for Delete Account
    await authPage.deleteAccount();
    await expect(authPage.locators.account_deleted_heading).toBeVisible();
    await expect(authPage.locators.account_deleted_info).toBeVisible();

    await authPage.continueToHomepage();
  });

  test("Test Case 2: Login User with correct email and password", async ({
    page,
  }) => {
    // Creating a new account for this testcase
    await authPage.navigateToSignup();
    await authPage.input_signup_details(name_value, email_value);
    await authPage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );
    await authPage.submitRegistrationForm();
    console.log("Account creation successful");
    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);
    await authPage.continueToHomepage();

    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
    // Logout
    await authPage.locators.logout.click();
    await expect(authPage.locators.login_signup_button).toBeVisible();
    await authPage.input_login_details(email_value, random_password);
    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
    // await authPage.locators.logout.click();
    await authPage.deleteAccount();

    await expect(authPage.locators.account_deleted_heading).toBeVisible();
    await expect(authPage.locators.account_deleted_info).toBeVisible();

    await authPage.continueToHomepage();
  });

  test("Test Case 3: Login User with incorrect email and password", async ({
    page,
  }) => {
    await authPage.navigateToSignup();
    await authPage.input_signup_details(name_value, email_value);
    await authPage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );
    await authPage.submitRegistrationForm();
    console.log("Account creation successful");
    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);
    await authPage.continueToHomepage();

    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
    // Logout
    await authPage.locators.logout.click();
    await expect(authPage.locators.login_signup_button).toBeVisible();
    await authPage.input_login_details(
      email_value,
      random_password + "incorrect"
    );
    await expect(
      authPage.locators.incorrect_email_or_password_warning
    ).toBeVisible();
    await authPage.input_login_details(email_value, random_password);

    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
    // await authPage.locators.logout.click();
    await authPage.deleteAccount();

    await expect(authPage.locators.account_deleted_heading).toBeVisible();
    await expect(authPage.locators.account_deleted_info).toBeVisible();

    await authPage.continueToHomepage();
    console.log("Account deletion successful");
  });

  test("Test Case 4: Logout User", async ({ page }) => {
    // Creating a new account for this testcase
    await authPage.navigateToSignup();
    await authPage.input_signup_details(name_value, email_value);
    await authPage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );
    await authPage.submitRegistrationForm();
    console.log("Account creation successful");
    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);
    await authPage.continueToHomepage();

    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
    // Logout
    await authPage.locators.logout.click();
    await expect(authPage.locators.login_signup_button).toBeVisible();
    await authPage.input_login_details(email_value, random_password);
    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
    // await authPage.locators.logout.click();
    await authPage.deleteAccount();

    await expect(authPage.locators.account_deleted_heading).toBeVisible();
    await expect(authPage.locators.account_deleted_info).toBeVisible();

    await authPage.continueToHomepage();
    console.log("Account deletion successful");
  });

  test("Test Case 5: Register User with existing email", async ({ page }) => {
    // Creating a new account for this testcase
    await authPage.navigateToSignup();
    await authPage.input_signup_details(name_value, email_value);
    await authPage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );
    await authPage.submitRegistrationForm();
    console.log("Account creation successful");
    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);
    await authPage.continueToHomepage();

    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
    // Logout
    await authPage.locators.logout.click();
    await authPage.input_signup_details(name_value, email_value);
    await expect
      .soft(authPage.locators.email_already_exists_warning)
      .toBeVisible();
    await authPage.input_login_details(email_value, random_password);
    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
    // await authPage.locators.logout.click();
    await authPage.deleteAccount();

    await expect(authPage.locators.account_deleted_heading).toBeVisible();
    await expect(authPage.locators.account_deleted_info).toBeVisible();

    await authPage.continueToHomepage();
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
    await productsPage.navigateToProducts();
    await expect(productsPage.locators.products_heading).toBeVisible();
    const all_products = await productsPage.listAllProducts();
    const product_name = "Men Tshirt";
    await productsPage.view_product(product_name);

    // 9. Verify that detail is visible:
    // product name, category, price, availability, condition, brand
    await expect(
      productsPage.locators.product_name_heading.getByRole("heading", {
        name: product_name,
      })
    ).toBeVisible();
    await expect(productsPage.locators.product_price_info).toBeVisible();
    await expect(productsPage.locators.product_availability_info).toBeVisible();
    await expect(productsPage.locators.product_condition_info).toBeVisible();
    await expect(productsPage.locators.product_brand_info).toBeVisible();
  });

  test("Test Case 9: Search Product", async ({ page }) => {
    const product_name_value = "Tshirt";
    await productsPage.navigateToProducts();
    await productsPage.searchProducts(product_name_value);
    const searched_products = await productsPage.listAllProducts();
    // validate whether the product name is present in the searched products
    const isProductFound = searched_products.some((product) =>
      product.name.includes(product_name_value)
    );
    await expect(isProductFound).toBe(true);
    await page.waitForTimeout(2000);
  });

  test("Test Case 10: Verify Subscription in home page", async ({ page }) => {
    // subscription related locators assertions
    await expect(homepage.locators.subscription_heading).toBeVisible();
    await expect(homepage.locators.subscription_email_field).toBeVisible();
    await expect(homepage.locators.subscription_button).toBeVisible();

    await homepage.input_subscription_email(email_value);
    await expect(homepage.locators.subscription_email_field).toHaveValue(
      email_value
    );
    await homepage.click_subscription_button();
    await expect(homepage.locators.subscription_success_message).toBeVisible();
  });

  test("Test Case 11: Verify Subscription in Cart page", async ({ page }) => {
    await cartPage.navigateToCart();
    await expect(homepage.locators.subscription_heading).toBeVisible();
    await expect(homepage.locators.subscription_email_field).toBeVisible();
    await expect(homepage.locators.subscription_button).toBeVisible();

    await homepage.input_subscription_email(email_value);
    await expect(homepage.locators.subscription_email_field).toHaveValue(
      email_value
    );
    await homepage.click_subscription_button();
    await expect(homepage.locators.subscription_success_message).toBeVisible();
  });

  test("Test Case 12: Add Products in Cart", async ({ page }) => {
    test.slow();
    await productsPage.navigateToProducts();
    const all_products_data = await productsPage.listAllProducts();

    // Adding First two Products to cart
    const first_product = all_products_data[0];
    const second_product = all_products_data[1];
    console.log(first_product);
    console.log(second_product);

    await productsPage.add_product_to_cart(first_product.name);
    await productsPage.locators.continue_shopping_button.click();
    await page.waitForLoadState("networkidle");
    await productsPage.add_product_to_cart(second_product.name);
    await productsPage.locators.view_cart_button.click();
    await page.waitForLoadState("networkidle");
    const cart_products_data = await cartPage.listAllProductsInCart();
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
    await productsPage.navigateToProducts();
    const all_products_data = await productsPage.listAllProducts();

    // Adding First two Products to cart
    const first_product = all_products_data[0];
    await productsPage.view_product(first_product.name);
    for (let index = 0; index < 3; index++) {
      await productsPage.locators.quantity_field.press("ArrowUp");
    }
    await productsPage.locators.add_to_cart_button.click();

    await productsPage.locators.view_cart_button.click();
    await page.waitForLoadState("networkidle");
    const cart_products_data = await cartPage.listAllProductsInCart();
    await page.waitForTimeout(2000);
    expect(cart_products_data.length).toBe(1);
    expect(cart_products_data[0].quantity).toBe("4");
  });

  test("Test Case 14: Place Order: Register while Checkout", async ({
    page,
  }) => {
    test.slow();
    await productsPage.navigateToProducts();
    const all_products_data = await productsPage.listAllProducts();
    const first_product = all_products_data[0];
    console.log(first_product);
    await productsPage.add_product_to_cart(first_product.name);
    await productsPage.locators.view_cart_button.click();
    await page.waitForLoadState("networkidle");
    const cart_products_data = await cartPage.listAllProductsInCart();
    expect(cart_products_data.length).toBe(1);
    await page.waitForTimeout(2000);
    await cartPage.navigateToCart();
    await checkoutPage.proceedToCheckout();
    await expect(checkoutPage.locators.continue_on_cart_button).toBeVisible();
    await checkoutPage.clickRegisterLoginLink();
    await expect(authPage.locators.login_signup_button).toBeVisible();
    await expect(authPage.locators.new_user_sign_up).toBeVisible();
    await authPage.input_signup_details(name_value, email_value);

    // Assertions for Enter Account Information page
    await expect
      .soft(authPage.locators.enter_account_info_heading)
      .toBeVisible();
    await expect(authPage.locators.registration_form_name).toHaveValue(
      name_value
    );
    await expect(authPage.locators.registration_form_email).toHaveValue(
      email_value
    );

    await authPage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );

    // Assertions for registration form inputs
    await expect(authPage.locators.radio_button_mr).toBeChecked();
    await expect(authPage.locators.radio_button_mrs).not.toBeChecked();
    await expect(authPage.locators.registration_form_password).toHaveValue(
      random_password
    );
    await expect(authPage.locators.day_dropdown).toHaveValue("15");
    await expect(authPage.locators.month_dropdown).toHaveValue("1"); // Month 'January' has value '1'
    await expect(authPage.locators.year_dropdown).toHaveValue("2000");
    await expect(authPage.locators.newsletter_checkbox).toBeChecked();
    await expect(authPage.locators.receive_offers_checkbox).not.toBeChecked();
    await expect(authPage.locators.first_name_field).toHaveValue("Automation");
    await expect(authPage.locators.last_name_field).toHaveValue("Automation");
    await expect(authPage.locators.company_field).toHaveValue("Automation");
    await expect(authPage.locators.address1_field).toHaveValue(address_data);
    await expect(authPage.locators.address2_field).toHaveValue(address_data);
    await expect(authPage.locators.country_dropdown).toHaveValue(
      "United States"
    );
    await expect(authPage.locators.state_field).toHaveValue("California");
    await expect(authPage.locators.city_field).toHaveValue("Los Angeles");
    await expect(authPage.locators.zipcode_field).toHaveValue("90001");
    await expect(authPage.locators.mobile_number_field).toHaveValue(
      "1234567890"
    );

    await authPage.submitRegistrationForm();
    console.log("Account creation successful");

    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);

    // Assertions for Account Created page
    await expect(authPage.locators.account_created_heading).toBeVisible();
    await expect(authPage.locators.continue_button).toBeVisible();
    await authPage.continueToHomepage();

    await cartPage.navigateToCart();
    await checkoutPage.proceedToCheckout();

    // 14. Verify Address Details and Review Your Order
    await expect(checkoutPage.locators.delivery_address_heading).toBeVisible();
    await expect(checkoutPage.locators.billing_address_heading).toBeVisible();

    // 15. Enter description in comment text area and click 'Place Order'
    await checkoutPage.fillCommentTextArea(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    );

    await checkoutPage.clickPlaceOrderLink();
    // 16. Enter payment details: Name on Card, Card Number, CVC, Expiration date
    await checkoutPage.fillPaymentDetails(
      name_value,
      "1234 5678 9123 4567",
      "123",
      "12",
      "34"
    );

    // 17. Click 'Pay and Confirm Order' button
    await checkoutPage.clickPayAndConfirmOrderButton();

    // 18. Verify success message 'Your order has been placed successfully!'

    await expect(
      checkoutPage.locators.order_placed_success_message
    ).toBeVisible();

    // Assertions for Delete Account
    await authPage.deleteAccount();
    await expect(authPage.locators.account_deleted_heading).toBeVisible();
    await expect(authPage.locators.account_deleted_info).toBeVisible();

    await authPage.continueToHomepage();
    console.log("Account deletion successful");
  });

  test("Test Case 15: Place Order: Register before Checkout", async ({
    page,
  }) => {
    test.slow();

    await authPage.navigateToSignup();
    await expect(authPage.locators.login_signup_button).toBeVisible();
    await expect(authPage.locators.new_user_sign_up).toBeVisible();
    await authPage.input_signup_details(name_value, email_value);

    // Assertions for Enter Account Information page
    await expect
      .soft(authPage.locators.enter_account_info_heading)
      .toBeVisible();
    await expect(authPage.locators.registration_form_name).toHaveValue(
      name_value
    );
    await expect(authPage.locators.registration_form_email).toHaveValue(
      email_value
    );

    await authPage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );

    // Assertions for registration form inputs
    await expect(authPage.locators.radio_button_mr).toBeChecked();
    await expect(authPage.locators.radio_button_mrs).not.toBeChecked();
    await expect(authPage.locators.registration_form_password).toHaveValue(
      random_password
    );
    await expect(authPage.locators.day_dropdown).toHaveValue("15");
    await expect(authPage.locators.month_dropdown).toHaveValue("1"); // Month 'January' has value '1'
    await expect(authPage.locators.year_dropdown).toHaveValue("2000");
    await expect(authPage.locators.newsletter_checkbox).toBeChecked();
    await expect(authPage.locators.receive_offers_checkbox).not.toBeChecked();
    await expect(authPage.locators.first_name_field).toHaveValue("Automation");
    await expect(authPage.locators.last_name_field).toHaveValue("Automation");
    await expect(authPage.locators.company_field).toHaveValue("Automation");
    await expect(authPage.locators.address1_field).toHaveValue(address_data);
    await expect(authPage.locators.address2_field).toHaveValue(address_data);
    await expect(authPage.locators.country_dropdown).toHaveValue(
      "United States"
    );
    await expect(authPage.locators.state_field).toHaveValue("California");
    await expect(authPage.locators.city_field).toHaveValue("Los Angeles");
    await expect(authPage.locators.zipcode_field).toHaveValue("90001");
    await expect(authPage.locators.mobile_number_field).toHaveValue(
      "1234567890"
    );

    await authPage.submitRegistrationForm();
    console.log("Account creation successful");

    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);

    // Assertions for Account Created page
    await expect(authPage.locators.account_created_heading).toBeVisible();
    await expect(authPage.locators.continue_button).toBeVisible();
    await authPage.continueToHomepage();

    await productsPage.navigateToProducts();
    const all_products_data = await productsPage.listAllProducts();
    const first_product = all_products_data[0];
    console.log(first_product);
    await productsPage.add_product_to_cart(first_product.name);
    await productsPage.locators.view_cart_button.click();
    await page.waitForLoadState("networkidle");
    const cart_products_data = await cartPage.listAllProductsInCart();
    expect(cart_products_data.length).toBe(1);
    await page.waitForTimeout(2000);
    await cartPage.navigateToCart();

    await checkoutPage.proceedToCheckout();

    // 14. Verify Address Details and Review Your Order
    await expect(checkoutPage.locators.delivery_address_heading).toBeVisible();
    await expect(checkoutPage.locators.billing_address_heading).toBeVisible();

    // 15. Enter description in comment text area and click 'Place Order'
    await checkoutPage.fillCommentTextArea(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    );

    await checkoutPage.clickPlaceOrderLink();
    // 16. Enter payment details: Name on Card, Card Number, CVC, Expiration date
    await checkoutPage.fillPaymentDetails(
      name_value,
      "1234 5678 9123 4567",
      "123",
      "12",
      "34"
    );

    // 17. Click 'Pay and Confirm Order' button
    await checkoutPage.clickPayAndConfirmOrderButton();

    // 18. Verify success message 'Your order has been placed successfully!'

    await expect(
      checkoutPage.locators.order_placed_success_message
    ).toBeVisible();

    // Assertions for Delete Account
    await authPage.deleteAccount();
    await expect(authPage.locators.account_deleted_heading).toBeVisible();
    await expect(authPage.locators.account_deleted_info).toBeVisible();

    await authPage.continueToHomepage();
    console.log("Account deletion successful");
  });

  test("Test Case 16: Place Order: Login before Checkout", async ({ page }) => {
    // Create Account
    test.slow();
    await authPage.navigateToSignup();
    await expect(authPage.locators.login_signup_button).toBeVisible();
    await expect(authPage.locators.new_user_sign_up).toBeVisible();
    await authPage.input_signup_details(name_value, email_value);

    // Assertions for Enter Account Information page
    await expect
      .soft(authPage.locators.enter_account_info_heading)
      .toBeVisible();
    await expect(authPage.locators.registration_form_name).toHaveValue(
      name_value
    );
    await expect(authPage.locators.registration_form_email).toHaveValue(
      email_value
    );

    await authPage.input_registration_form_details(
      dateSelection,
      registrationFormData
    );

    // Assertions for registration form inputs
    await expect(authPage.locators.radio_button_mr).toBeChecked();
    await expect(authPage.locators.radio_button_mrs).not.toBeChecked();
    await expect(authPage.locators.registration_form_password).toHaveValue(
      random_password
    );
    await expect(authPage.locators.day_dropdown).toHaveValue("15");
    await expect(authPage.locators.month_dropdown).toHaveValue("1"); // Month 'January' has value '1'
    await expect(authPage.locators.year_dropdown).toHaveValue("2000");
    await expect(authPage.locators.newsletter_checkbox).toBeChecked();
    await expect(authPage.locators.receive_offers_checkbox).not.toBeChecked();
    await expect(authPage.locators.first_name_field).toHaveValue("Automation");
    await expect(authPage.locators.last_name_field).toHaveValue("Automation");
    await expect(authPage.locators.company_field).toHaveValue("Automation");
    await expect(authPage.locators.address1_field).toHaveValue(address_data);
    await expect(authPage.locators.address2_field).toHaveValue(address_data);
    await expect(authPage.locators.country_dropdown).toHaveValue(
      "United States"
    );
    await expect(authPage.locators.state_field).toHaveValue("California");
    await expect(authPage.locators.city_field).toHaveValue("Los Angeles");
    await expect(authPage.locators.zipcode_field).toHaveValue("90001");
    await expect(authPage.locators.mobile_number_field).toHaveValue(
      "1234567890"
    );

    await authPage.submitRegistrationForm();
    console.log("Account creation successful");

    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);

    // Assertions for Account Created page
    await expect(authPage.locators.account_created_heading).toBeVisible();
    await expect(authPage.locators.continue_button).toBeVisible();
    await authPage.continueToHomepage();

    // Logout from account
    await authPage.locators.logout.click();
    await expect(authPage.locators.login_signup_button).toBeVisible();

    // Add product to cart
    await productsPage.navigateToProducts();
    const all_products_data = await productsPage.listAllProducts();
    const first_product = all_products_data[0];
    await productsPage.add_product_to_cart(first_product.name);
    await productsPage.locators.view_cart_button.click();
    await page.waitForLoadState("networkidle");
    const cart_products_data = await cartPage.listAllProductsInCart();
    expect(cart_products_data.length).toBe(1);

    // proceed to checkout
    await cartPage.navigateToCart();
    await checkoutPage.proceedToCheckout();

    // login to account
    await checkoutPage.clickRegisterLoginLink();
    await authPage.input_login_details(email_value, random_password);
    // placeorder
    await cartPage.navigateToCart();
    await checkoutPage.proceedToCheckout();
    await expect(checkoutPage.locators.delivery_address_heading).toBeVisible();
    await expect(checkoutPage.locators.billing_address_heading).toBeVisible();

    await checkoutPage.fillCommentTextArea(
      "Order placed after login before checkout."
    );
    await checkoutPage.clickPlaceOrderLink();

    await checkoutPage.fillPaymentDetails(
      name_value,
      "1234 5678 9123 4567",
      "123",
      "12",
      "34"
    );
    await checkoutPage.clickPayAndConfirmOrderButton();

    await expect(
      checkoutPage.locators.order_placed_success_message
    ).toBeVisible();

    // Delete Account
    await authPage.deleteAccount();
    await expect(authPage.locators.account_deleted_heading).toBeVisible();
    await expect(authPage.locators.account_deleted_info).toBeVisible();
    await authPage.continueToHomepage();
  });
});
