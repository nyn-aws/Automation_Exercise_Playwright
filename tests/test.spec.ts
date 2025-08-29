import { test, expect, Page } from "@playwright/test";
import { PageObjectManager } from "../src/pages/PageObjectManager";
import { DateSelection, RegistrationFormData } from "../src/pages/authPage";
import { CommonUtils } from "../src/utils/commonUtils";
import fs from "fs";

// Test data and reusable variables
let name_value: string = "AutomationUser1";
const address_data: string =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const dateSelection: DateSelection = {
  day: "15",
  month: "January",
  year: "2000",
};
let random_password: string = CommonUtils.generateRandomPassword();
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

let pageObjectManager: PageObjectManager;
let email_value: string;
let homepage: ReturnType<PageObjectManager["getHomePage"]>;
let authPage: ReturnType<PageObjectManager["getAuthPage"]>;
let productsPage: ReturnType<PageObjectManager["getProductsPage"]>;
let cartPage: ReturnType<PageObjectManager["getCartPage"]>;
let checkoutPage: ReturnType<PageObjectManager["getCheckoutPage"]>;

// Test suite: General Automation Exercise tests
test.describe("Automation Exercise", () => {
  test.beforeAll(async () => {
    // Suite setup if needed
  });

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);
    // Initialize page objects and navigate to homepage before each test
    pageObjectManager = new PageObjectManager(page);
    homepage = pageObjectManager.getHomePage();
    authPage = pageObjectManager.getAuthPage();
    productsPage = pageObjectManager.getProductsPage();
    cartPage = pageObjectManager.getCartPage();
    checkoutPage = pageObjectManager.getCheckoutPage();
    await homepage.goto();
    await expect(page).toHaveURL("https://www.automationexercise.com/");
    await expect(page).toHaveTitle("Automation Exercise");
    await expect(homepage.locators.website_logo).toBeVisible();
    email_value = CommonUtils.generateRandomEmail();
  });

  test.afterAll(async () => {
    // Suite teardown if needed
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Log test title,status and time taken in one log
    console.log(
      `Finished test: ${testInfo.title} with status: ${testInfo.status} in ${testInfo.duration}ms`
    );
  });

  test("Test Case 6: Contact Us Form", async ({ page }) => {
    // Verify Contact Us form fields and submit the form
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
    // Accept alert dialog after form submission
    page.on("dialog", (dialog) => {
      dialog.accept();
    });
    await homepage.submit_contact_form();
    await expect(homepage.locators.contact_us_success_message).toBeVisible();
  });

  test("Test Case 7: Verify Test Cases Page", async ({ page }) => {
    // Verify navigation to Test Cases page
    await homepage.navigateToTestCases();
    await expect(homepage.locators.test_cases_heading).toBeVisible();
  });

  test("Test Case 8: Verify All Products and product detail page", async ({
    page,
  }) => {
    // Verify product listing and product detail page
    await productsPage.navigateToProducts();
    await expect(productsPage.locators.products_heading).toBeVisible();
    const all_products = await productsPage.listAllProducts();
    const product_name = "Men Tshirt";
    await productsPage.view_product(product_name);
    // Verify product details are visible
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
    // Search for a product and verify results
    const product_name_value = "Tshirt";
    await productsPage.navigateToProducts();
    await productsPage.searchProducts(product_name_value);
    const searched_products = await productsPage.listAllProducts();
    const isProductFound = searched_products.some((product) =>
      product.name.includes(product_name_value)
    );
    await expect(isProductFound).toBe(true);
    await page.waitForTimeout(2000);
  });

  test("Test Case 10: Verify Subscription in home page", async ({ page }) => {
    // Verify subscription section on home page
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
    // Verify subscription section on cart page
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
    // Add two products to cart and verify
    test.slow();
    await productsPage.navigateToProducts();
    const all_products_data = await productsPage.listAllProducts();
    const first_product = all_products_data[0];
    const second_product = all_products_data[1];
    await productsPage.add_product_to_cart(first_product.name);
    await productsPage.locators.continue_shopping_button.click();
    await page.waitForLoadState("networkidle");
    await productsPage.add_product_to_cart(second_product.name);
    await productsPage.locators.view_cart_button.click();
    await page.waitForLoadState("networkidle");
    const cart_products_data = await cartPage.listAllProductsInCart();
    expect(cart_products_data.length).toBe(2);
    await page.waitForTimeout(2000);
    // Validate both products are in cart
    [first_product.name, second_product.name].forEach((name) => {
      const containsProduct = cart_products_data.some((product) =>
        product.name.includes(name)
      );
      expect(containsProduct).toBe(true);
    });
  });

  test("Test Case 13: Verify Product quantity in Cart", async ({ page }) => {
    // Add product with increased quantity and verify in cart
    test.slow();
    await productsPage.navigateToProducts();
    const all_products_data = await productsPage.listAllProducts();
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

  test("Test Case 17: Remove Products From Cart", async ({ page }) => {
    await addProductToCartAndNavigateToCart(page, 0);
    await removeProductFromCart(page, "Blue Top");
  });

  test("Test Case 18: View Category Products", async ({ page }) => {
    await homepage.navigateToProducts();
    await productsPage.locators.women_category.click();
    await page.locator("#Women").getByRole("link", { name: "Dress" }).click();
    await expect(
      page.getByRole("heading", { name: "Women -  Dress Products" })
    ).toBeVisible();
    // List all products and verify that at least one has "Dress" in its name
    const all_dress_products = await productsPage.listAllProducts();
    const hasDress = all_dress_products.some((product) =>
      product.name.includes("Dress")
    );
    expect(hasDress).toBe(true);
    await productsPage.locators.men_category.click();
    await page.getByRole("link", { name: "Tshirts" }).click();
    await expect(
      page.getByRole("heading", { name: "Men - Tshirts Products" })
    ).toBeVisible();

    // List all products and verify that at least one has "Tshirt" in its name
    const all_shirt_products = await productsPage.listAllProducts();
    const hasTshirt = all_shirt_products.some((product) =>
      product.name.includes("Tshirt")
    );
    expect(hasTshirt).toBe(true);
  });

  test("Test Case 19: View & Cart Brand Products", async ({ page }) => {
    await homepage.navigateToProducts();
    const brandLocators = [
      productsPage.locators.polo_brand,
      productsPage.locators.h_and_m_brand,
      productsPage.locators.madame_brand,
      productsPage.locators.mast_and_harbour_brand,
      productsPage.locators.babyhug_brand,
      productsPage.locators.allen_solly_junior_brand,
      productsPage.locators.kookie_kids_brand,
      productsPage.locators.biba_brand,
    ];
    const brandNames = [
      "POLO",
      "H&M",
      "Madame",
      "Mast & Harbour",
      "Babyhug",
      "Allen Solly Junior",
      "Kookie Kids",
      "Biba",
    ];
    for (const locator of brandLocators) {
      await expect(locator).toBeVisible();
    }

    for (let i = 0; i < brandLocators.length; i++) {
      await brandLocators[i].click();
      await expect(
        page.getByRole("heading", { name: `Brand - ${brandNames[i]} Products` })
      ).toBeVisible();
      // await page.goBack();
    }
  });

  test("Test Case 21: Add review on product", async ({ page }) => {
    const product_name = "Blue Top";
    await homepage.navigateToProducts();
    await productsPage.view_product(product_name);
    await expect(
      page.getByRole("list").filter({ hasText: "Write Your Review" })
    ).toBeVisible();
    // review form
    await page.getByRole("textbox", { name: "Your Name" }).fill(name_value);
    await page
      .getByRole("textbox", { name: "Email Address", exact: true })
      .fill(email_value);
    await page
      .getByRole("textbox", { name: "Add Review Here!" })
      .fill(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      );
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("Thank you for your review.")).toBeVisible();
  });
});

// Test suite: Tests that require account deletion after each test
test.describe("Tests with Account Deletion", () => {
  test.beforeAll(async () => {
    // Suite setup if needed
  });

  test.afterAll(async () => {
    // Suite teardown if needed
  });

  test.beforeEach(async ({ page }, testInfo) => {
    // Initialize page objects and navigate to homepage before each test
    pageObjectManager = new PageObjectManager(page);
    homepage = pageObjectManager.getHomePage();
    authPage = pageObjectManager.getAuthPage();
    productsPage = pageObjectManager.getProductsPage();
    cartPage = pageObjectManager.getCartPage();
    checkoutPage = pageObjectManager.getCheckoutPage();

    await homepage.goto();
    await expect(page).toHaveURL("https://www.automationexercise.com/");
    await expect(page).toHaveTitle("Automation Exercise");
    await expect(homepage.locators.website_logo).toBeVisible();

    email_value = CommonUtils.generateRandomEmail();
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Delete account after each test and verify deletion
    await authPage.deleteAccount();
    await expect(authPage.locators.account_deleted_heading).toBeVisible();
    await expect(authPage.locators.account_deleted_info).toBeVisible();
    await authPage.continueToHomepage();
  });

  test("Test Case 1: Register User", async ({ page }) => {
    // Register a new user and verify account creation
    test.slow();
    await registerUser(page);
    await expect(authPage.locators.account_created_heading).toBeVisible();
    await expect(authPage.locators.continue_button).toBeVisible();
    await authPage.continueToHomepage();
  });

  test("Test Case 2: Login User with correct email and password", async ({
    page,
  }) => {
    // Register and login with correct credentials
    await registerUser(page);
    await authPage.continueToHomepage();
    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
    await authPage.locators.logout.click();
    await expect(authPage.locators.login_signup_button).toBeVisible();
    await authPage.input_login_details(email_value, random_password);
    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
  });

  test("Test Case 3: Login User with incorrect email and password", async ({
    page,
  }) => {
    // Register and attempt login with incorrect credentials, then correct
    await registerUser(page);
    await authPage.continueToHomepage();
    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
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
  });

  test("Test Case 4: Logout User", async ({ page }) => {
    // Register, login, and logout user
    await registerUser(page);
    await authPage.continueToHomepage();
    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
    await authPage.locators.logout.click();
    await expect(authPage.locators.login_signup_button).toBeVisible();
    await authPage.input_login_details(email_value, random_password);
    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
  });

  test("Test Case 5: Register User with existing email", async ({ page }) => {
    // Attempt to register with an existing email and verify warning
    await registerUser(page);
    await authPage.continueToHomepage();
    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
    await authPage.locators.logout.click();
    await authPage.input_signup_details(name_value, email_value);
    await expect
      .soft(authPage.locators.email_already_exists_warning)
      .toBeVisible();
    await authPage.input_login_details(email_value, random_password);
    await expect(authPage.locators.logged_in_as_user(name_value)).toBeVisible();
  });

  test("Test Case 14: Place Order: Register while Checkout", async ({
    page,
  }) => {
    // Register during checkout and complete order
    test.slow();
    await addProductToCartAndNavigateToCart(page, 0);
    await cartPage.navigateToCart();
    await checkoutPage.proceedToCheckout();
    await expect(checkoutPage.locators.continue_on_cart_button).toBeVisible();
    await checkoutPage.clickRegisterLoginLink();
    await registerUser(page);
    await expect(authPage.locators.account_created_heading).toBeVisible();
    await expect(authPage.locators.continue_button).toBeVisible();
    await authPage.continueToHomepage();

    await CheckoutCart_and_Complete_Payment(page);
  });

  test("Test Case 15: Place Order: Register before Checkout", async ({
    page,
  }) => {
    // Register before checkout and complete order
    test.slow();
    await registerUser(page);
    await expect(authPage.locators.account_created_heading).toBeVisible();
    await expect(authPage.locators.continue_button).toBeVisible();
    await authPage.continueToHomepage();
    await addProductToCartAndNavigateToCart(page, 0);
    await CheckoutCart_and_Complete_Payment(page);
  });

  test("Test Case 16: Place Order: Login before Checkout", async ({ page }) => {
    // Register, logout, login before checkout, and complete order
    test.slow();
    await registerUser(page);
    await expect(authPage.locators.account_created_heading).toBeVisible();
    await expect(authPage.locators.continue_button).toBeVisible();
    await authPage.continueToHomepage();
    await authPage.locators.logout.click();
    await expect(authPage.locators.login_signup_button).toBeVisible();
    await addProductToCartAndNavigateToCart(page, 0);
    await cartPage.navigateToCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.clickRegisterLoginLink();
    await authPage.input_login_details(email_value, random_password);
    await CheckoutCart_and_Complete_Payment(page);
  });

  test("Test Case 20: Search Products and Verify Cart After Login", async ({
    page,
  }) => {
    const search_keyword = "Tshirt";
    await homepage.navigateToProducts();
    await productsPage.searchProducts(search_keyword);
    // await page.waitForLoadState("networkidle");
    const all_searched_results = await productsPage.listAllProducts();
    console.log(all_searched_results);

    const hasTshirt = all_searched_results.some((e) =>
      e.name.includes(search_keyword)
    );
    expect.soft(hasTshirt).toBe(true);

    for (const products of all_searched_results) {
      await productsPage.add_product_to_cart(products.name);
      await productsPage.locators.continue_shopping_button.click();
    }
    await cartPage.navigateToCart();
    const all_products_in_cart = await cartPage.listAllProductsInCart();
    expect(all_searched_results.length).toBe(all_products_in_cart.length);

    // Had to use this as the test case was failing due to some extra spaces
    function normalizeName(name: string): string {
      return name
        .replace(/\s+/g, " ") // collapse multiple spaces into one
        .trim() // remove leading/trailing spaces
        .toLowerCase(); // case-insensitive compare
    }

    for (const searchedProduct of all_searched_results) {
      const found = all_products_in_cart.some((cartProduct) =>
        normalizeName(cartProduct.name).includes(
          normalizeName(searchedProduct.name)
        )
      );

      // console.log(`Searched: ${searchedProduct.name}, Found: ${found}`);
      expect.soft(found).toBe(true);
    }

    await registerUser(page);
    await cartPage.navigateToCart();

    for (const searchedProduct of all_searched_results) {
      const found = all_products_in_cart.some((cartProduct) =>
        normalizeName(cartProduct.name).includes(
          normalizeName(searchedProduct.name)
        )
      );

      // console.log(`Searched: ${searchedProduct.name}, Found: ${found}`);
      expect.soft(found).toBe(true);
    }
  });

  test("Test Case 24: Download Invoice after purchase order", async ({
    page,
  }) => {
    await registerUser(page);
    await homepage.navigateToProducts();
    await addProductToCartAndNavigateToCart(page, 0);
    await CheckoutCart_and_Complete_Payment(page);
    await page.waitForLoadState("networkidle");

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("link", { name: "Download Invoice" }).click(),
    ]);
    // Download and save in present directory
    await download.saveAs("tests/test_data/" + download.suggestedFilename());

    // use fs to delete the file directory
    fs.rmSync("tests/test_data/", { recursive: true, force: true });
  });
});

// Helper function: Assert registration form input values
async function assertRegistrationFromInputs() {
  await expect(authPage.locators.radio_button_mr).toBeChecked();
  await expect(authPage.locators.radio_button_mrs).not.toBeChecked();
  await expect(authPage.locators.registration_form_password).toHaveValue(
    random_password
  );
  await expect(authPage.locators.day_dropdown).toHaveValue("15");
  await expect(authPage.locators.month_dropdown).toHaveValue("1"); // January = 1
  await expect(authPage.locators.year_dropdown).toHaveValue("2000");
  await expect(authPage.locators.newsletter_checkbox).toBeChecked();
  await expect(authPage.locators.receive_offers_checkbox).not.toBeChecked();
  await expect(authPage.locators.first_name_field).toHaveValue("Automation");
  await expect(authPage.locators.last_name_field).toHaveValue("Automation");
  await expect(authPage.locators.company_field).toHaveValue("Automation");
  await expect(authPage.locators.address1_field).toHaveValue(address_data);
  await expect(authPage.locators.address2_field).toHaveValue(address_data);
  await expect(authPage.locators.country_dropdown).toHaveValue("United States");
  await expect(authPage.locators.state_field).toHaveValue("California");
  await expect(authPage.locators.city_field).toHaveValue("Los Angeles");
  await expect(authPage.locators.zipcode_field).toHaveValue("90001");
  await expect(authPage.locators.mobile_number_field).toHaveValue("1234567890");
}

// Helper function: Register a new user
async function registerUser(page: Page) {
  await authPage.navigateToSignup();
  await expect(authPage.locators.login_signup_button).toBeVisible();
  await expect(authPage.locators.new_user_sign_up).toBeVisible();
  await authPage.input_signup_details(name_value, email_value);
  await expect.soft(authPage.locators.enter_account_info_heading).toBeVisible();
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
  await assertRegistrationFromInputs();
  await authPage.submitRegistrationForm();
  console.log(
    `Registering user with email: ${email_value} and password: ${random_password}`
  );
}

// Helper function: Add a product to cart and navigate to cart
async function addProductToCartAndNavigateToCart(
  page: Page,
  productIndex: number
) {
  await productsPage.navigateToProducts();
  const all_products_data = await productsPage.listAllProducts();
  const product_to_add = all_products_data[productIndex];
  await productsPage.add_product_to_cart(product_to_add.name);
  await productsPage.locators.view_cart_button.click();
  await page.waitForLoadState("networkidle");
  const cart_products_data = await cartPage.listAllProductsInCart();
  expect(cart_products_data.length).toBe(1);
  await page.waitForTimeout(2000);
}

async function removeProductFromCart(page: Page, product_name: string) {
  await cartPage.navigateToCart();
  await page
    .locator("tbody tr")
    .filter({ hasText: product_name })
    .locator(".cart_delete a")
    .click();
  await page.waitForTimeout(2000);
  expect
    .soft(page.locator("tbody tr").filter({ hasText: product_name }))
    .not.toBeVisible();
}

// Helper function: Complete checkout and payment process
async function CheckoutCart_and_Complete_Payment(page: Page) {
  await cartPage.navigateToCart();
  await checkoutPage.proceedToCheckout();
  // Verify address details and review order
  await expect(checkoutPage.locators.delivery_address_heading).toBeVisible();
  await expect(checkoutPage.locators.billing_address_heading).toBeVisible();
  // Fill comment and place order
  await checkoutPage.fillCommentTextArea(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  );
  await checkoutPage.clickPlaceOrderLink();
  // Fill payment details and confirm order
  await checkoutPage.fillPaymentDetails(
    name_value,
    "1234 5678 9123 4567",
    "123",
    "12",
    "34"
  );
  await checkoutPage.clickPayAndConfirmOrderButton();
  // Verify order placed success message
  await expect(
    checkoutPage.locators.order_placed_success_message
  ).toBeVisible();
}
