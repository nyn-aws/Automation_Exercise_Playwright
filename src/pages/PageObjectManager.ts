import { Page } from "@playwright/test";
import { Homepage } from "./homepage";
import { AuthPage } from "./authPage";
import { ProductsPage } from "./productsPage";
import { CartPage } from "./cartPage";
import { CheckoutPage } from "./checkoutPage";

/**
 * @class PageObjectManager
 * @description Manages the instantiation and access of all Page Object classes.
 * This centralizes the creation of page objects, making it easier to manage and use them across tests.
 */
export class PageObjectManager {
  private readonly page: Page;
  public readonly homepage: Homepage;
  public readonly authPage: AuthPage;
  public readonly productsPage: ProductsPage;
  public readonly cartPage: CartPage;
  public readonly checkoutPage: CheckoutPage;

  /**
   * @constructor
   * @param {Page} page - The Playwright Page object to be used by all page objects.
   */
  constructor(page: Page) {
    this.page = page;
    this.homepage = new Homepage(this.page);
    this.authPage = new AuthPage(this.page);
    this.productsPage = new ProductsPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.checkoutPage = new CheckoutPage(this.page);
  }

  /**
   * @method getHomePage
   * @description Returns the Homepage Page Object instance.
   * @returns {Homepage} The Homepage Page Object.
   */
  getHomePage(): Homepage {
    return this.homepage;
  }

  /**
   * @method getAuthPage
   * @description Returns the AuthPage Page Object instance.
   * @returns {AuthPage} The AuthPage Page Object.
   */
  getAuthPage(): AuthPage {
    return this.authPage;
  }

  /**
   * @method getProductsPage
   * @description Returns the ProductsPage Page Object instance.
   * @returns {ProductsPage} The ProductsPage Page Object.
   */
  getProductsPage(): ProductsPage {
    return this.productsPage;
  }

  /**
   * @method getCartPage
   * @description Returns the CartPage Page Object instance.
   * @returns {CartPage} The CartPage Page Object.
   */
  getCartPage(): CartPage {
    return this.cartPage;
  }

  /**
   * @method getCheckoutPage
   * @description Returns the CheckoutPage Page Object instance.
   * @returns {CheckoutPage} The CheckoutPage Page Object.
   */
  getCheckoutPage(): CheckoutPage {
    return this.checkoutPage;
  }
}
