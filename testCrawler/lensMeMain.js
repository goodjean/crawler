import { Builder, By } from "selenium-webdriver";
import "chromedriver";
import LensMeCrawler from "../brands/lensMeCrawler.js";

(async function mainCrawler() {
  let crawler = new LensMeCrawler();
  const lens_list_entity = [];
  let driver = await crawler.goMainPage();
  const categories = await crawler.getCategories(driver);
  const elements = await crawler.getElements(driver);

  for (let i = 0; i < categories.length; i++) {
    const categories = await crawler.getCategories(driver);
    await driver.executeScript(
      "return document.getElementsByClassName('inner_bts bg_header')[0].remove();"
    );
    await crawler.clickElement(categories[i]);

    for (let j = 0; j < 10; j++) {
      await driver.executeScript(
        "return document.getElementsByClassName('widgets')[0].remove();"
      );
      const elements = await crawler.getElements(driver);
      const name = await crawler.getProductName(elements[j]);
      const price = await crawler.getProductPrice(elements[j]);
      const graphic = await crawler.getProductGraphic(elements[j]);
      const img = await crawler.getProductImg(elements[j]);
      await crawler.clickElement(elements[j]);
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
