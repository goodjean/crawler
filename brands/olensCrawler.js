import { Builder, By } from "selenium-webdriver";
import "chromedriver";
import olensConfig from "../config/olensConfig.js";

export default class OlensCrawler {
  async goMainPage() {
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get(olensConfig.url);
    return driver;
  }
  async getCategories(driver) {
    return await driver.findElements(By.css(olensConfig.categories));
  }
  async getElements(driver) {
    return await driver.findElements(
      By.css(olensConfig.products_selector.productList)
    );
  }
  async clickElement(driver, element) {
    await driver.executeScript("arguments[0].click();", element);
    await driver.sleep(2000);
  }
  async getProductName(element) {
    return await element
      .findElement(By.css(olensConfig.products_selector.productName))
      .getText();
  }
  async getProductPrice(element) {
    const price = [];
    const priceEntity = await element.findElements(
      By.css(olensConfig.products_selector.productPrice)
    );
    priceEntity.forEach(async (priceEle) => {
      const priceByOne = await priceEle.getText();
      const priceToNum = Number(priceByOne.replace(/\D/g, ""));
      price.push(priceToNum);
    });
    return price;
  }
  async getProductGraphic(element) {
    const graphicOnedayEntity = await element
      .findElement(By.css(olensConfig.products_selector.productGraphic))
      .getText();
    const graphic = graphicOnedayEntity.replace(" (1DAY 권장)", "");
    return graphic;
  }
  async getProductImg(element) {
    return await element
      .findElement(By.css(olensConfig.products_selector.productImg))
      .getAttribute("src");
  }
  async getProductRefId(currentUrl) {
    const url_lens_id = currentUrl.replace(
      "https://o-lens.com/product/detail?productSeq=",
      ""
    );
    const ref_id = Number(url_lens_id);
    return ref_id;
  }
  getProduct(ref_id, name, price, graphic, img, brand) {
    return { ref_id, name, price, graphic, img, brand: "olens" };
  }
}
