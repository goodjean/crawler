import { Builder, By } from "selenium-webdriver";
import "chromedriver";
import lensMeConfig from "../config/lensMeConfig.js";

export default class LensMeCrawler {
  async goMainPage() {
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get(lensMeConfig.url);
    return driver;
  }
  async getCategories(driver) {
    return await driver.findElements(By.css(lensMeConfig.categories));
  }
  async getElements(driver) {
    return await driver.findElements(
      By.css(lensMeConfig.products_selector.productList)
    );
  }
  async clickElement(driver, element) {
    await element.click();
  }
  async getProductName(element) {
    return await element
      .findElement(By.css(lensMeConfig.products_selector.productName))
      .getText();
  }
  async getProductPrice(element) {
    const price = [];
    const priceEntity = await element.findElements(
      By.css(lensMeConfig.products_selector.productPrice)
    );

    priceEntity.forEach(async (priceEle) => {
      const priceByOne = await priceEle.getText();
      const priceToNum = Number(priceByOne.replace(/\D/g, ""));
      price.push(priceToNum);
    });
    return price;
  }
  async getProductGraphic(element) {
    return await element
      .findElement(By.css(lensMeConfig.products_selector.productGraphic))
      .getText();
  }
  async getProductImg(element) {
    return await element
      .findElement(By.css(lensMeConfig.products_selector.productImg))
      .getAttribute("src");
  }
  async getProductRefId(currentUrl) {
    const pathArray = currentUrl.split("/");
    return Number(pathArray[5]);
  }
  getProduct(ref_id, name, price, graphic, img, brand) {
    return { ref_id, name, price, graphic, img, brand: "lensme" };
  }
}
