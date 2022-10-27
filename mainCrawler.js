import "chromedriver";
import LensMeCrawler from "./brands/lensMeCrawler.js";
import OlensCrawler from "./brands/olensCrawler.js";
import LensRepo from "./db/LensRepo.js";

(async function mainCrawler() {
  const lensRepo = new LensRepo();
  const brands = [LensMeCrawler, OlensCrawler];
  const lens_list_entity = [];

  for await (let brand of brands) {
    const crawler = new brand();
    let driver = await crawler.goMainPage();
    const categories = await crawler.getCategories(driver);
    const elements = await crawler.getElements(driver);

    for (let i = 0; i < categories.length; i++) {
      const categories = await crawler.getCategories(driver);
      const pageHeader = await driver.executeScript(
        "return document.getElementById('gh_layout')"
      );
      if (pageHeader) {
        await driver.executeScript(
          "return document.getElementsByClassName('inner_bts bg_header')[0].remove();"
        );
        await driver.sleep(2000);
      }
      await crawler.clickElement(driver, categories[i]);

      for (let j = 0; j < 10; j++) {
        const sideBtn = await driver.executeScript(
          "return document.getElementsByClassName('widgets')[0]"
        );
        if (sideBtn) {
          await driver.executeScript(
            "return document.getElementsByClassName('widgets')[0].remove();"
          );
          await driver.sleep(2000);
        } else {
          const categories = await crawler.getCategories(driver);
          await crawler.clickElement(driver, categories[i]);
        }
        const elements = await crawler.getElements(driver);
        await driver.sleep(2000);
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
    await driver.quit();
  }
  lensRepo.addLensEntity(lens_list_entity);
})();
