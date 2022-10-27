import { Builder, By } from "selenium-webdriver";
import "chromedriver";
import OlensCrawler from "../brands/olensCrawler.js";

(async function helloSelenium() {
  const lens_list_entity = [];
  const crawler = new OlensCrawler();
  let driver = await crawler.goMainPage();
  const categories = await crawler.getCategories(driver);
  const elements = await crawler.getElements(driver);

  for (let i = 0; i < categories.length; i++) {
    const categories = await crawler.getCategories(driver);
    await crawler.clickElement(driver, categories[i]);

    for (let j = 0; j < 10; j++) {
      const categories = await crawler.getCategories(driver);
      await crawler.clickElement(driver, categories[i]);
      const elements = await crawler.getElements(driver);
      const name = await crawler.getProductName(elements[j]);
      const price = await crawler.getProductPrice(elements[j]);
      const graphic = await crawler.getProductGraphic(elements[j]);
      const img = await crawler.getProductImg(elements[j]);
      await crawler.clickElement(driver, elements[j]);
      const currentUrl = await driver.getCurrentUrl();
      const ref_id = await crawler.getProductRefId(currentUrl);
      await driver.navigate().back();
      await driver.sleep(2000);
      const productEntity = crawler.getProduct(
        ref_id,
        name,
        price,
        graphic,
        img
      );
      lens_list_entity.push(productEntity);
    }
  }
  console.log(lens_list_entity);
  await driver.quit();
})();
