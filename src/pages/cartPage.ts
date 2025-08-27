import { Page, Locator } from "@playwright/test";

/**
 * @interface CartProduct
 * @description Defines the structure for a product displayed in the cart, including its name, price, quantity, and total.
 */
interface CartProduct {
  name: string;
  price: string;
  quantity: string;
  total: string;
}

interface CartPageLocators {
  cart_link: Locator;
}

/**
 * @class CartPage
 * @description Represents the Cart page, containing methods and locators for interacting with the shopping cart.
 */
export class CartPage {
  private page: Page;
  public locators: CartPageLocators;

  /**
   * @constructor
   * @param {Page} page - Playwright's Page object.
   */
  constructor(page: Page) {
    this.page = page;
    this.locators = this.initLocators();
  }

  /**
   * @method navigateToCart
   * @description Navigates to the shopping cart page.
   */
  async navigateToCart() {
    await this.locators.cart_link.click();
  }

  /**
   * @method listAllProductsInCart
   * @description Retrieves a list of all products currently in the cart with their details.
   * @returns {Promise<CartProduct[]>} A promise that resolves to an array of CartProduct objects.
   */
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

  /**
   * @method initLocators
   * @description Initializes and returns a collection of locators for the CartPage.
   * @returns {CartPageLocators} A record of named Playwright Locator objects.
   */
  private initLocators(): CartPageLocators {
    return {
      cart_link: this.page.getByRole("link", { name: "Cart" }),
    };
  }
}
