import { Builder, By } from "selenium-webdriver";
import "chromedriver";
// import LensApi from "./crawler_api/crawlerApi.js";
import lensTownConfig from "./brand_config/lensTownConfig.js";
import olensConfig from "./brand_config/olensConfig.js";
//refid & name

(async function helloSelenium() {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get(lensTownConfig.url);
  const categories = await driver.findElements(
    By.css(lensTownConfig.categories)
  );

  for (let i = 0; i < categories.length; i++) {
    const categories = await driver.findElements(
      By.css(lensTownConfig.categories)
    );
    if (lensTownConfig.isPageHeader) {
      await driver.executeScript(
        `document.getElementsByClassName("${lensTownConfig.products_selector.pageHeader}")[0].remove();`
      );
    }
    await categories[i].click();
    const elements = await driver.findElements(
      By.css(lensTownConfig.products_selector.productList)
    );

    for (let j = 0; j < elements.length; j++) {
      const elements = await driver.findElements(
        By.css(lensTownConfig.products_selector.productList)
      );
      // const img = await elements[j]
      //   .findElement(By.css(lensTownConfig.products_selector.productImg))
      //   .getAttribute("src");
      // const name = await elements[j].findElement(By.css(lensTownConfig.products_selector.productName)).getText();

      await elements[j].click();
      // const price_str = await driver.findElement(By.css(lensTownConfig.products_selector.productPrice)).getText();
      // const price = Number(price_str.replace(/\D/g, ""));
      // const graphic = await driver.findElement(By.css(lensTownConfig.products_selector.productGraphic)).getText();
      // const period = await driver.findElement(By.css(lensTownConfig.products_selector.productPeriod)).getText();
      // const reviewCount = Number(
      //   reviewText.replace(lensTownConfig.review[0], "").replace(lensTownConfig.review[1], "")
      // );

      // let detail = [];
      // const detailThumbEles = await driver.findElements(By.css(lensTownConfig.products_selector.productDetailThumbs));
      // for (let detailThumbEle of detailThumbEles) {
      //   if (detail.length < 2) {
      //     const detailThumb = await detailThumbEle.getAttribute("src");
      //     detail.push(detailThumb);
      //   }
      // }

      // const detailImgEle = await driver.executeScript(
      //   `return document.querySelector('${lensTownConfig.products_selector.isProductDetailImg}');`
      // );
      // const detailImgEle1 = await driver.executeScript(
      //   `return document.querySelector('${lensTownConfig.products_selector.productDetailImg}')`
      // );
      // const detailImgEle2 = await driver.executeScript(
      //   `return document.querySelector('${lensTownConfig.products_selector.productDetailImg_in_p}')`
      // );

      // let detail = [];
      // if (detailImgEle) {
      //   detail = await driver
      //     .findElement(By.css(lensTownConfig.products_selector.isProductDetailImg))
      //     .getAttribute("src");
      // } else if (detailImgEle1) {
      //   detail = await driver
      //     .findElement(By.css(lensTownConfig.products_selector.productDetailImg))
      //     .getAttribute("src");
      // } else if (detailImgEle2) {
      //   detail = await driver
      //     .findElement(By.css(lensTownConfig.products_selector.productDetailImg_in_p))
      //     .getAttribute("src");
      // } else {
      //   detail = await driver
      //     .findElement(By.css(lensTownConfig.products_selector.productDetailImg_in_div3))
      //     .getAttribute("src");
      // }
      // console.log(detail);

      // const currentUrl = await driver.getCurrentUrl();
      // const ref_id = Number(currentUrl.replace(lensTownConfig.ref_url, ""));
      // LENS_LIST_ENTITY.push({ ref_id, name, price, graphic, period, img, brand: lensTownConfig.brand_name });
      // const detailBox = await driver.findElement(By.css(lensTownConfig.products_selector.productDetailImg));
      const detailimg = await detailBox.findElement(By.css("img"));
      // console.log(await detailimg.getAttribute("src"));

      // const color = await driver.findElement(By.css(".sct_li.active > .sct_txt > a")).getText();
      // console.log(`${j} -- ${color}`);
      const colorImg = await driver
        .findElement(By.css(".sct_li.active > div.sct_img > a > img"))
        .getAttribute("src");
      console.log(`${j} --- ${colorImg}`);
      await driver.navigate().back();
    }
  }
  // console.log(LENS_LIST_ENTITY);
  await driver.quit();
})();
