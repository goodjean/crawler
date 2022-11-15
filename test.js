import { Builder, By } from "selenium-webdriver";
import "chromedriver";
// import LensApi from "./crawler_api/crawlerApi.js";
import lensTownConfig from "./brand_config/lensTownConfig.js";
import olensConfig from "./brand_config/olensConfig.js";
//refid & name

(async function helloSelenium() {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.manage().setTimeouts({ implicit: 2000 });
  await driver.get("https://hapakristin.co.kr/collections/main");
  const categories = await driver.findElements(
    By.css(".v-pagination.theme--light > li > .v-pagination__item")
  );

  console.log(categories);

  // for (let i = 0; i < categories.length; i++) {
  //   const categories = await driver.findElements(
  //     By.css(olensConfig.categories)
  //   );
  //   await driver.executeScript(`arguments[0].click();`, categories[i]);
  //   await driver.sleep(2000);

  //   const elements = await driver.findElements(
  //     By.css(olensConfig.products_selector.productList)
  //   );

  //   for (let j = 0; j < elements.length; j++) {
  //     const categories = await driver
  //       .findElements(By.css(olensConfig.categories))
  //       .getAttribute("src");
  //     await driver.executeScript(`arguments[0].click();`, categories[i]);
  //     await driver.sleep(2000);
  //     const elements = await driver.findElements(
  //       By.css(olensConfig.products_selector.productList)
  //     );

  //     // const img = await elements[j]
  //     //   .findElement(By.css(lensTownConfig.products_selector.productImg))
  //     //   .getAttribute("src");
  //     const name = await elements[j]
  //       .findElement(By.css(olensConfig.products_selector.productName))
  //       .getText();
  //     // console.log(`${name}`);

  //     await driver.executeScript(`arguments[0].click();`, elements[j]);
  //     await driver.sleep(2000);

  //     // const detailthumbs = await driver.findElements(By.css(olensConfig.products_selector.productDetailThumbs));
  //     // let detailImgs = [];
  //     // for (let thumb of detailthumbs) {
  //     //   if (detailImgs.length < 2) {
  //     //     const detailImg = await thumb.getAttribute("src");
  //     //     detailImgs.push(detailImg);
  //     //   }
  //     // }

  //     // const detailImg = await driver.executeScript(
  //     //   `return document.querySelector('${olensConfig.products_selector.productDetailImg}')`
  //     // );
  //     // const detail = await driver
  //     //   .findElement(By.css(olensConfig.products_selector.productDetailImg))
  //     //   .getAttribute("src");

  //     // let detail = [];
  //     // if (detailImg) {
  //     //   const detailImg = await driver.findElement(By.css(olensConfig.products_selector.productDetailImg));
  //     //   detail = await detailImg.findElement(By.css("img")).getAttribute("src");
  //     // }
  //     // console.log(`${name} --- ${detail}`);

  //     // const color = await driver.findElement(By.css("li.on > a > span.tx")).getText();
  //     // console.log(`${name} -- ${color}`);
  //     const colorImg = await driver
  //       .findElement(By.css(".img > img"))
  //       .getAttribute("src");
  //     console.log(`${name} --- ${colorImg}`);
  //     //     const price_str = await driver.findElement(By.css(lensTownConfig.products_selector.productPrice)).getText();
  //     //     const price = Number(price_str.replace(/\D/g, ""));
  //     //     const graphic = await driver.findElement(By.css(lensTownConfig.products_selector.productGraphic)).getText();
  //     //     const period = await driver.findElement(By.css(lensTownConfig.products_selector.productPeriod)).getText();
  //     //     // const reviewCount = Number(
  //     //     //   reviewText.replace(lensTownConfig.review[0], "").replace(lensTownConfig.review[1], "")
  //     //     // );
  //     //     const detail = await driver
  //     //       .findElements(By.css(lensTownConfig.products_selector.productDetailImgs))
  //     //       .getAttribute("src");
  //     //     console.log(detail);

  //     //     const currentUrl = await driver.getCurrentUrl();
  //     //     const ref_id = Number(currentUrl.replace(lensTownConfig.ref_url, ""));
  //     //     // LENS_LIST_ENTITY.push({ ref_id, name, price, graphic, period, img, brand: lensTownConfig.brand_name });
  //     await driver.navigate().back();
  //     await driver.sleep(1000);
  //   }
  // }
  // // console.log(LENS_LIST_ENTITY);
  await driver.quit();
})();
