import { Page, Locator } from "@playwright/test";

/**
 * @interface Product
 * @description Defines the structure for a product with its name and price.
 */
interface Product {
  name: string;
  price: string;
}

/**
 * @interface ProductLocators
 * @description Defines the locators used within the ProductsPage for interacting with product-related elements.
 */
interface ProductLocators {
  products_link: Locator;
  products_heading: Locator;
  all_products: Locator;
  all_products_info: Locator;
  search_product_field: Locator;
  search_product_button: Locator;
  women_category: Locator;
  men_category: Locator;
  kids_category: Locator;
  polo_brand: Locator;
  h_and_m_brand: Locator;
  madame_brand: Locator;
  mast_and_harbour_brand: Locator;
  babyhug_brand: Locator;
  allen_solly_junior_brand: Locator;
  kookie_kids_brand: Locator;
  biba_brand: Locator;
  product_name_heading: Locator;
  product_price_info: Locator;
  product_availability_info: Locator;
  product_condition_info: Locator;
  product_brand_info: Locator;
  continue_shopping_button: Locator;
  view_cart_button: Locator;
  quantity_field: Locator;
  add_to_cart_button: Locator;
}

/**
 * @class ProductsPage
 * @description Represents the Products page, containing methods and locators for browsing, searching, and interacting with products.
 */
export class ProductsPage {
  private page: Page;
  public locators: ProductLocators;

  /**
   * @constructor
   * @param {Page} page - Playwright's Page object.
   */
  constructor(page: Page) {
    this.page = page;
    this.locators = this.initLocators();
  }

  /**
   * @method navigateToProducts
   * @description Navigates to the products page by clicking the 'Products' link.
   */
  async navigateToProducts() {
    await this.locators.products_link.click();
  }

  /**
   * @method searchProducts
   * @description Searches for a product by name.
   * @param {string} product_name - The name of the product to search for.
   */
  async searchProducts(product_name: string) {
    await this.locators.search_product_field.fill(product_name);
    await this.locators.search_product_button.click();
  }

  /**
   * @method getCountOfProducts
   * @description Retrieves the total count of products displayed on the page.
   * @returns {Promise<number>} A promise that resolves to the number of products.
   */
  async getCountOfProducts() {
    const count_of_product = await this.locators.all_products.count();
    console.log(`Count of products: ${count_of_product}`);
    return count_of_product;
  }

  /**
   * @method add_product_to_cart
   * @description Adds a specified product to the cart.
   * @param {string} product_name - The name of the product to add.
   */
  async add_product_to_cart(product_name: string) {
    const product = this.locators.all_products.filter({
      hasText: product_name,
    });
    await product.first().locator(".add-to-cart").first().click();
  }

  /**
   * @method view_product
   * @description Views the details of a specified product.
   * @param {string} product_name - The name of the product to view.
   */
  async view_product(product_name: string) {
    const product = this.locators.all_products.filter({
      hasText: product_name,
    });
    await product.getByText("View Product").click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * @method listAllProducts
   * @description Lists all products currently displayed on the page.
   * @returns {Promise<Product[]>} A promise that resolves to an array of Product objects.
   */
  async listAllProducts(): Promise<Product[]> {
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
    return products;
  }

  /**
   * @method filter_by_brand
   * @description Filters products by the specified brand name.
   * @param {"POLO" | "H&M" | "Madame" | "Mast & Harbour" | "Babyhug" | "Allen Solly Junior" | "Kookie Kids" | "Biba"} brand_name - The name of the brand to filter by.
   */
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

  /**
   * @method initLocators
   * @description Initializes and returns a collection of locators for the ProductsPage.
   * @returns {ProductLocators} A record of named Playwright Locator objects.
   */
  private initLocators(): ProductLocators {
    return {
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
      women_category: this.page.getByRole("link", { name: " Women" }),
      men_category: this.page.getByRole("link", { name: " Men" }),
      kids_category: this.page.getByRole("link", { name: " Kids" }),

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
      product_name_heading: this.page.locator(".product-details"),
      product_price_info: this.page.getByText("Rs."),
      product_availability_info: this.page.getByText("Availability:"),
      product_condition_info: this.page.getByText("Condition:"),
      product_brand_info: this.page.getByText("Brand:"),
      continue_shopping_button: this.page.getByRole("button", {
        name: "Continue Shopping",
      }),
      view_cart_button: this.page.getByRole("link", { name: "View Cart" }),
      quantity_field: this.page.locator("#quantity"),
      add_to_cart_button: this.page.getByRole("button", {
        name: " Add to cart",
      }),
    };
  }
}
