import { test, expect, Locator } from "@playwright/test";
import { Homepage } from "../src/pages/homepage";
import { CommonUtils } from "../src/utils/commonUtils";

test.describe("Automation Exercise", () => {
  let homepage: Homepage;
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);

    homepage = new Homepage(page);
    await homepage.goto();
  });
  test.afterEach(async ({ page }, testInfo) => {
    // Log test title,status and time taken in one log
    console.log(
      `Finished test: ${testInfo.title} with status: ${testInfo.status} in ${testInfo.duration}ms`
    );
  });

  test("Test Case 1: Register User", async ({ page }) => {
    test.slow();

    await expect(page).toHaveURL("https://www.automationexercise.com/");
    await expect(page).toHaveTitle("Automation Exercise");
    await expect(homepage.locators.website_logo).toBeVisible();

    await expect(homepage.locators.login_signup_button).toBeVisible();
    await homepage.locators.login_signup_button.click();
    await page.waitForLoadState("networkidle");

    await expect(homepage.locators.new_user_sign_up).toBeVisible();
    const name_value = "AutomationUser1";
    const email_value = CommonUtils.generateRandomEmail();
    const random_password = CommonUtils.generateRandomPassword();
    const address_data =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    await homepage.locators.sign_up_name_field.fill(name_value);
    await homepage.locators.sign_up_email_field.fill(email_value);
    await homepage.locators.sign_up_button.click();

    await expect
      .soft(homepage.locators.enter_account_info_heading)
      .toBeVisible();

    //  Registration Form Fields

    await homepage.locators.radio_button_mr.check();

    await expect(homepage.locators.radio_button_mr).toBeChecked();
    await expect(homepage.locators.radio_button_mrs).not.toBeChecked();

    await expect(homepage.locators.registration_form_name).toBeVisible();
    await expect(homepage.locators.registration_form_name).toHaveValue(
      name_value
    );

    await expect(homepage.locators.registration_form_email).toBeVisible();
    await expect(homepage.locators.registration_form_email).toHaveValue(
      email_value
    );

    await expect(homepage.locators.registration_form_password).toBeVisible();
    await expect(homepage.locators.registration_form_password).toBeEnabled();

    await homepage.locators.registration_form_password.fill(random_password);
    await expect(homepage.locators.registration_form_password).toHaveValue(
      random_password
    );

    // date selection dropdowns

    await expect(homepage.locators.day_dropdown).toBeVisible();
    await expect(homepage.locators.month_dropdown).toBeVisible();
    await expect(homepage.locators.year_dropdown).toBeVisible();

    await homepage.locators.day_dropdown.selectOption("15");
    await homepage.locators.month_dropdown.selectOption("January");
    await homepage.locators.year_dropdown.selectOption("2000");

    await expect(homepage.locators.newsletter_checkbox).toBeVisible();
    await expect(homepage.locators.newsletter_checkbox).toBeEnabled();
    await homepage.locators.newsletter_checkbox.check();
    await expect(homepage.locators.newsletter_checkbox).toBeChecked();

    await expect(homepage.locators.receive_offers_checkbox).toBeVisible();
    await expect(homepage.locators.receive_offers_checkbox).toBeEnabled();
    await homepage.locators.receive_offers_checkbox.check();
    await expect(homepage.locators.receive_offers_checkbox).toBeChecked();
    await homepage.locators.receive_offers_checkbox.uncheck();
    await expect(homepage.locators.receive_offers_checkbox).not.toBeChecked();

    await expect(homepage.locators.address_information_heading).toBeVisible();

    await expect(homepage.locators.first_name_field).toBeVisible();

    await expect(homepage.locators.first_name_field).toBeEnabled();
    await homepage.locators.first_name_field.fill("Automation");
    await expect(homepage.locators.first_name_field).toHaveValue("Automation");

    await expect(homepage.locators.last_name_field).toBeVisible();
    await expect(homepage.locators.last_name_field).toBeEnabled();
    await homepage.locators.last_name_field.fill("Automation");
    await expect(homepage.locators.last_name_field).toHaveValue("Automation");

    await expect(homepage.locators.company_field).toBeVisible();
    await expect(homepage.locators.company_field).toBeEnabled();
    await homepage.locators.company_field.fill("Automation");
    await expect(homepage.locators.company_field).toHaveValue("Automation");

    await expect(homepage.locators.address1_field).toBeVisible();
    await expect(homepage.locators.address1_field).toBeEnabled();
    await homepage.locators.address1_field.fill(address_data);
    await expect(homepage.locators.address1_field).toHaveValue(address_data);

    await expect(homepage.locators.address2_field).toBeVisible();
    await expect(homepage.locators.address2_field).toBeEnabled();
    await homepage.locators.address2_field.fill(address_data);
    await expect(homepage.locators.address2_field).toHaveValue(address_data);

    await expect(homepage.locators.country_dropdown).toBeVisible();
    await expect(homepage.locators.country_dropdown).toBeEnabled();
    await expect(homepage.locators.country_dropdown).toHaveValue("India");
    await homepage.locators.country_dropdown.selectOption("United States");
    await expect(homepage.locators.country_dropdown).toHaveValue(
      "United States"
    );

    await expect(homepage.locators.state_field).toBeVisible();
    await expect(homepage.locators.state_field).toBeEnabled();
    await homepage.locators.state_field.fill("California");
    await expect(homepage.locators.state_field).toHaveValue("California");

    await expect(homepage.locators.city_field).toBeVisible();
    await expect(homepage.locators.city_field).toBeEnabled();
    await homepage.locators.city_field.fill("Los Angeles");
    await expect(homepage.locators.city_field).toHaveValue("Los Angeles");

    await expect(homepage.locators.zipcode_field).toBeVisible();
    await expect(homepage.locators.zipcode_field).toBeEnabled();
    await homepage.locators.zipcode_field.fill("90001");
    await expect(homepage.locators.zipcode_field).toHaveValue("90001");

    await expect(homepage.locators.mobile_number_field).toBeVisible();
    await expect(homepage.locators.mobile_number_field).toBeEnabled();
    await homepage.locators.mobile_number_field.fill("1234567890");
    await expect(homepage.locators.mobile_number_field).toHaveValue(
      "1234567890"
    );

    await expect(homepage.locators.create_account_button).toBeVisible();
    await expect(homepage.locators.create_account_button).toBeEnabled();
    await homepage.locators.create_account_button.click();

    console.log("Account creation successful");

    // Log Email and password details
    console.log("Email:", email_value);
    console.log("Password:", random_password);

    await expect(homepage.locators.account_created_heading).toBeVisible();
    await expect(homepage.locators.continue_button).toBeVisible();
    await homepage.locators.continue_button.click();

    await expect(homepage.locators.delete_account_button).toBeVisible();
    await expect(homepage.locators.delete_account_button).toBeEnabled();
    await homepage.locators.delete_account_button.click();

    await expect(homepage.locators.continue_button).toBeVisible();
    await expect(homepage.locators.account_deleted_heading).toBeVisible();
    await expect(homepage.locators.account_deleted_info).toBeVisible();

    await homepage.locators.continue_button.click();
    console.log("Account deletion successful");
  });

  test("Test Case 2: Login User with correct email and password", async ({
    page,
  }) => {});
});
