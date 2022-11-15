import { Builder, By } from "selenium-webdriver";
import "chromedriver";

export default class CrawlerApi {
  async goMainPage(url) {
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get(url);
    return driver;
  }
  async getCategories(driver, cate_selector) {
    return await driver.findElements(By.css(cate_selector));
  }
  async getElementList(driver, ele_selector) {
    return await driver.findElements(By.css(ele_selector));
  }
  async removeElement(driver, className) {
    await driver.executeScript(`document.getElementsByClassName("${className}")[0].remove();`);
  }
  async getElementsByClassName(driver, className) {
    return await driver.executeScript(`return document.getElementsByClassName("${className}")[0];`);
  }
  async getElementByQuerySelector(driver, query_selector) {
    return await driver.executeScript(`return document.querySelector('${query_selector}')`);
  }
  async clickElement(element) {
    await element.click();
  }
  async clickElementByJs(driver, element) {
    await driver.executeScript("arguments[0].click();", element);
    await driver.sleep(2000);
  }
  async getProductName(element, name_selector) {
    return await element.findElement(By.css(name_selector)).getText();
  }
  async getProductColor(driver, color_selector) {
    return await driver.findElement(By.css(color_selector)).getText();
  }
  async getProductColorImg(driver, color_img_selector) {
    return await driver.findElement(By.css(color_img_selector)).getAttribute("src");
  }
  async getProductPrice(driver, price_selector) {
    const price = [];
    const priceEntities = await driver.findElements(By.css(price_selector));

    for (let priceEntity of priceEntities) {
      const priceByOne = await priceEntity.getText();
      const priceToNum = Number(priceByOne.replace(/\D/g, ""));
      price.push(priceToNum);
    }
    return price;
  }
  async getProductImg(element, img_selector) {
    return await element.findElement(By.css(img_selector)).getAttribute("src");
  }
  async getProductDetailImg(driver, detail_img_selector) {
    const detailImg = await driver.findElement(By.css(detail_img_selector));
    return await detailImg.findElement(By.css("img")).getAttribute("src");
  }
  async getProductDetailThumbnails(driver, thumb_selector) {
    let detail = [];
    const detailThumbEles = await driver.findElements(By.css(thumb_selector));
    for (let detailThumbEle of detailThumbEles) {
      if (detail.length < 2) {
        const detailThumb = await detailThumbEle.getAttribute("src");
        detail.push(detailThumb);
      }
    }
    return detail;
  }
  async getProductGraphic(driver, graphic_selector) {
    const graphic = await driver.findElement(By.css(graphic_selector)).getText();
    return graphic;
  }
  async getProductPeriod(driver, period_selector) {
    return await driver.findElement(By.css(period_selector)).getText();
  }
  async getProductReviewCount(driver, reviewCount_selector, review) {
    const reviewText = await driver.findElement(By.css(reviewCount_selector)).getText();
    const reviewCount = Number(reviewText.replace(review, "").replace(review[0], "").replace(review[1], ""));
    return reviewCount;
  }
  async getProductRefId(currentUrl, ref_url) {
    const url_lens_id = currentUrl.replace(ref_url, "");
    const ref_id = Number(url_lens_id);
    return ref_id;
  }
  getProductInfos(
    ref_id,
    name,
    color,
    colorImg,
    price,
    graphic,
    img,
    detailImg,
    thumbnails,
    period,
    reviewCount,
    brand
  ) {
    return { ref_id, name, color, colorImg, price, graphic, img, detailImg, thumbnails, period, reviewCount, brand };
  }
  async goBackPage(driver, time) {
    await driver.navigate().back();
    await driver.sleep(time);
  }
}
