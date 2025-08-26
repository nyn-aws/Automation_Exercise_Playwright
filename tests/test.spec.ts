import { test, expect, Locator } from "@playwright/test";
import {
  Homepage,
  DateSelection,
  RegistrationFormData,
} from "../src/pages/homepage";
import { CommonUtils } from "../src/utils/commonUtils";

test.describe("Automation Exercise", () => {
  let homepage: Homepage;
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);

    homepage = new Homepage(page);
    await homepage.goto();
    // Page Title and URL assertions
    await expect(page).toHaveURL("https://www.automationexercise.com/");
    await expect(page).toHaveTitle("Automation Exercise");
    await expect(homepage.locators.website_logo).toBeVisible();
  });
  test.afterEach(async ({ page }, testInfo) => {
    // Log test title,status and time taken in one log
    console.log(
      `Finished test: ${testInfo.title} with status: ${testInfo.status} in ${testInfo.duration}ms`
    );
  });

  test("Test Case 1: Register User", async ({ page }) => {
    test.slow();

    const name_value = "AutomationUser1";
    const email_value = CommonUtils.generateRandomEmail();
    const random_password = CommonUtils.generateRandomPassword();
    const address_data =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

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

    const dateSelection: DateSelection = {
      day: "15",
      month: "January",
      year: "2000",
    };

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

  // test("Test Case 2: Login User with correct email and password", async ({
  //   page,
  // }) => {});
});
