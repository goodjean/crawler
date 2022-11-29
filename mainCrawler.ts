import { Builder, By, WebDriver, WebElement } from "selenium-webdriver";
import "chromedriver";
import lensTownConfig from "./brand_config/lensTownConfig";
import olensConfig from "./brand_config/olensConfig";
import lensmeConfig from "./brand_config/lensmeConfig";
import LensRepo from "./db/LensRepo";
import { ILens } from "./types/lens";
import { IBrandConfig } from "./types/config";

//--------------------------- Crawler Api --------------------------------

async function goMainPage(config: IBrandConfig): Promise<WebDriver> {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.manage().setTimeouts({ implicit: 2000 });
  await driver.get(config.url);
  return driver;
}

async function getCategories(
  driver: WebDriver,
  config: IBrandConfig
): Promise<string[]> {
  const categories = await driver.findElements(By.css(config.categories));
  const urls: string[] = [];
  for (let i = 0; i < categories.length; i++) {
    const url = await categories[i].getAttribute("href");
    urls.push(url);
  }
  return urls;
}

async function goCategory(category: string, driver: WebDriver): Promise<void> {
  await driver.get(category);
}

async function getProducts(
  driver: WebDriver,
  config: IBrandConfig
): Promise<WebElement[]> {
  const products = await driver.findElements(
    By.css(config.products_selector.productList[0])
  );
  if (products.length === 0) {
    const productsAlpha = await driver.findElements(
      By.css(config.products_selector.productList[1])
    );
    console.log(`[productElement-2222]: ${productsAlpha.length}`);
    return productsAlpha;
  }
  console.log(`[productElement-1111]: ${products.length}`);
  return products;
}

async function clickProduct(
  driver: WebDriver,
  product: WebElement,
  config: IBrandConfig
): Promise<void> {
  if (config.product_a_tag) {
    try {
      await product.click();
    } catch (e) {
      const clickableDetailUrl = await product
        .findElement(By.css(config.products_selector.productName))
        .getAttribute("href");
      await driver.get(clickableDetailUrl);
    }
  } else {
    await driver.executeScript("arguments[0].click();", product);
  }
}

async function getReviewCount(
  driver: WebDriver,
  config: IBrandConfig
): Promise<number> {
  try {
    const reviewText = await driver
      .findElement(By.css(config.products_selector.productReviewCount))
      .getText();
    return Number(
      reviewText.replace(config.review[0], "").replace(config.review[1], "")
    );
  } catch (e) {
    return 0;
  }
}

async function getDetailImg(
  driver: WebDriver,
  config: IBrandConfig
): Promise<string | undefined> {
  try {
    if (config.brand_name === "lensme") {
      const detailImgEles = await driver.findElements(
        By.css(config.products_selector.productDetailImg)
      );
      return await detailImgEles[detailImgEles.length - 1].getAttribute("src");
    } else {
      const detailImgEle = await driver.findElement(
        By.css(config.products_selector.productDetailImg)
      );
      return await detailImgEle.findElement(By.css("img")).getAttribute("src");
    }
  } catch (e) {
    console.log("디테일 이미지 없음");
  }
}

async function getDetailThumbs(
  driver: WebDriver,
  config: IBrandConfig
): Promise<string[]> {
  let detail: string[] = [];
  const detailThumbEles = await driver.findElements(
    By.css(config.products_selector.productDetailThumbs)
  );
  for (let detailThumbEle of detailThumbEles) {
    if (detail.length < 2) {
      const detailThumb = await detailThumbEle.getAttribute("src");
      detail.push(detailThumb);
    }
  }
  // console.log(`[detailThumbs]: ${detail[0]}, ${detail[1]}`);
  return detail;
}

async function getProductColor(
  driver: WebDriver,
  config: IBrandConfig
): Promise<string> {
  const color = await driver
    .findElement(By.css(config.products_selector.productColor))
    .getText();
  if (config.isColor) {
    return color;
  } else {
    const colorArr = color
      .replace(/10P/i, "")
      .replace(/30P/i, "")
      .replace(/S/i, "")
      .replace(/M/i, "")
      .replace(/L/i, "")
      .replace(" ()", "")
      .replace("쵸코", "초코")
      .split(" ");
    return colorArr[colorArr.length - 1];
  }
}

async function getProductColorImg(
  driver: WebDriver,
  config: IBrandConfig
): Promise<string | undefined> {
  try {
    return await driver
      .findElement(By.css(config.products_selector.productColorImg))
      .getAttribute("src");
  } catch (e) {
    console.log("컬러 이미지 없음");
  }
}

async function getProductPrice(
  driver: WebDriver,
  config: IBrandConfig
): Promise<number> {
  const priceEntity = await driver
    .findElement(By.css(config.products_selector.productPrice))
    .getText();
  const price = Number(priceEntity.replace(/\D/g, ""));
  console.log(`[price]: ${price}`);
  return price;
}

async function getProductGraphic(
  driver: WebDriver,
  config: IBrandConfig
): Promise<number> {
  try {
    const graphicAlpha = await driver
      .findElement(By.css(config.products_selector.productGraphic))
      .getText();
    const graphic = Number(graphicAlpha.substr(0, 4));
    if (isNaN(graphic)) {
      return 0;
    } else {
      return graphic;
    }
  } catch (e) {
    return 0;
  }
}

async function getProductPeriod(
  driver: WebDriver,
  config: IBrandConfig
): Promise<string> {
  const periodList = ["1day", "2weeks", "1month", "3month", "6month", "1year"];
  try {
    const periodAlpha = await driver
      .findElement(By.css(config.products_selector.productPeriod))
      .getText();
    if (!periodAlpha.includes("~")) {
      const periodEntity = periodAlpha.split(/[·,/]/)[0];
      const period = periodEntity
        .replace(/1day /gi, periodList[0])
        .replace(/2weeks /gi, periodList[1])
        .replace(/1month /gi, periodList[2])
        .replace(/3months /gi, periodList[3])
        .replace(/6months /gi, periodList[4])
        .replace(/1 year /gi, periodList[5])
        .replace(/1개월 /gi, periodList[2])
        .replace(/2~3개월 /gi, periodList[3])
        .replace(/3~6개월 /gi, periodList[4]);
      // console.log(`[period]: '${period}'`);
      return period;
    } else {
      return periodList[4];
    }
  } catch (e) {
    return periodList[4];
  }
}

function getProductPeriodClassifi(period: string): string {
  let period_classifi = "";
  switch (period) {
    case "1day":
      period_classifi = "oneday";
      break;
    case "2weeks":
    case "1month":
      period_classifi = "weekly-1month";
      break;
    case "3month":
    case "6month":
    case "1year":
      period_classifi = "long-term";
      break;
    default:
      period_classifi = period;
      break;
  }
  // console.log(`[period_classifi]: ${period_classifi}`);
  return period_classifi;
}

async function getProductRefId(
  driver: WebDriver,
  config: IBrandConfig
): Promise<number> {
  const currentUrl = await driver.getCurrentUrl();
  if (!config.dynamicUrl) {
    return Number(currentUrl.replace(config.ref_url, ""));
  } else {
    const pathArr = currentUrl.split("/");
    return Number(pathArr[5]);
  }
}

function getProduct(
  ref_id: number,
  name: string,
  color: string,
  colorImg: string | undefined,
  price: number,
  graphic: number,
  img: string,
  detailImg: string | undefined,
  detailThumbs: string[],
  period: string,
  periodClassification: string,
  reviewCount: number,
  brand: string
): ILens {
  return {
    ref_id,
    name,
    color,
    colorImg,
    price,
    graphic,
    img,
    detailImg,
    detailThumbs,
    period,
    periodClassification,
    reviewCount,
    brand,
  };
}

async function goBackPage(driver: WebDriver): Promise<void> {
  await driver.navigate().back();
}

//--------------------------------crawlDetail-----------------------------------

async function crawlDetail(
  driver: WebDriver,
  product: WebElement,
  config: IBrandConfig
): Promise<void> {
  const name = await product
    .findElement(By.css(config.products_selector.productName))
    .getText();
  console.log(name);
  const img = await product
    .findElement(By.css(config.products_selector.productImg))
    .getAttribute("src");
  await clickProduct(driver, product, config);
  const reviewCount = await getReviewCount(driver, config);
  const detailImg = await getDetailImg(driver, config);
  const detailThumbs = await getDetailThumbs(driver, config);
  const color = await getProductColor(driver, config);
  const colorImg = await getProductColorImg(driver, config);
  const price = await getProductPrice(driver, config);
  const graphic = await getProductGraphic(driver, config);
  const period = await getProductPeriod(driver, config);
  const periodClassification = await getProductPeriodClassifi(period);
  const ref_id = await getProductRefId(driver, config);
  const crawlProduct = getProduct(
    ref_id,
    name,
    color,
    colorImg,
    price,
    graphic,
    img,
    detailImg,
    detailThumbs,
    period,
    periodClassification,
    reviewCount,
    config.brand_name
  );
  config.products.push(crawlProduct);
  await goBackPage(driver);
}

//----------------------------------- Main Exec ---------------------------------------

(async function main() {
  let LENS_LIST_ENTITY: ILens[] = [];
  let configs: IBrandConfig[] = [lensTownConfig, olensConfig, lensmeConfig];
  const lensRepo = new LensRepo();
  for (let config of configs) {
    await mainCrawler(config);
    LENS_LIST_ENTITY.push(...config.products);
  }
  lensRepo.addLensInfo(LENS_LIST_ENTITY);
})();

//----------------------------------- Main Crawler ----------------------------------------

async function mainCrawler(config: IBrandConfig): Promise<void> {
  let driver = await goMainPage(config);
  const categories = await getCategories(driver, config);

  for (let i = 0; i < categories.length; i++) {
    await goCategory(categories[i], driver);
    const products = await getProducts(driver, config);

    for (let j = 0; j < products.length; j++) {
      const products = await getProducts(driver, config);
      await crawlDetail(driver, products[j], config);
    }
  }
  await driver.quit();
}

// (async function mainCrawler() {
//   const brands = [olensConfig, lensTownConfig];
//   const crawlerApi = new CrawlerApi();
//   const lensRepo = new LensRepo();
//   const LENS_LIST_ENTITY = [];

//   for await (let brand of brands) {
//     let driver = await crawlerApi.goMainPage(brand.url);
//     const categories = await crawlerApi.getCategories(driver, brand.categories);

//     for (let i = 0; i < categories.length; i++) {
//       const categories = await crawlerApi.getCategories(driver, brand.categories); // pink cate 안눌림

//       if (brand.isPageHeader) {
//         await crawlerApi.removeElement(driver, brand.products_selector.pageHeader);
//         await crawlerApi.clickElement(categories[i]);
//       } else {
//         await crawlerApi.clickElementByJs(driver, categories[i]);
//       }

//       const elements = await crawlerApi.getElementList(driver, brand.products_selector.productList);

//       for (let j = 0; j < elements.length; j++) {
//         if (!brand.has_a_tag) {
//           const categories = await crawlerApi.getCategories(driver, brand.categories);
//           await crawlerApi.clickElementByJs(driver, categories[i]);
//         }

//         const elements = await crawlerApi.getElementList(driver, brand.products_selector.productList);
//         const name = await crawlerApi.getProductName(elements[j], brand.products_selector.productName);
//         const img = await crawlerApi.getProductImg(elements[j], brand.products_selector.productImg);

//         let reviewCount = "";

//         if (brand.has_a_tag) {
//           await crawlerApi.clickElement(elements[j]);
//           reviewCount = await crawlerApi.getProductReviewCount(
//             driver,
//             brand.products_selector.productReviewCount,
//             brand.review
//           );
//         } else {
//           await crawlerApi.clickElementByJs(driver, elements[j]);
//           const reviewBtn = await crawlerApi.getElementsByClassName(driver, brand.products_selector.productReviewBtn);
//           if (reviewBtn) {
//             reviewCount = await crawlerApi.getProductReviewCount(
//               driver,
//               brand.products_selector.productReviewCount,
//               brand.review
//             );
//           } else {
//             reviewCount = 0;
//           }
//         }

//         let detailImg = "";

//         if (brand.has_product_detail_img_optional) {
//           const detailImgEle = await crawlerApi.getElementByQuerySelector(
//             driver,
//             brand.products_selector.productDetailImg
//           );
//           if (detailImgEle) {
//             detailImg = await crawlerApi.getProductDetailImg(driver, brand.products_selector.productDetailImg);
//           }
//         } else {
//           detailImg = await crawlerApi.getProductDetailImg(driver, brand.products_selector.productDetailImg);
//         }

//         const thumbnails = await crawlerApi.getProductDetailThumbnails(
//           driver,
//           brand.products_selector.productDetailThumbs
//         );
//         const color = await crawlerApi.getProductColor(driver, brand.products_selector.productColor);
//         const colorImg = await crawlerApi.getProductColorImg(driver, brand.products_selector.productColorImg);
//         const price = await crawlerApi.getProductPrice(driver, brand.products_selector.productPrice);
//         const graphic = await crawlerApi.getProductGraphic(driver, brand.products_selector.productGraphic);
//         const period = await crawlerApi.getProductPeriod(driver, brand.products_selector.productPeriod);
//         const currentUrl = await driver.getCurrentUrl();
//         const ref_id = await crawlerApi.getProductRefId(currentUrl, brand.ref_url);
//         const productEntity = crawlerApi.getProductInfos(
//           ref_id,
//           name,
//           color,
//           colorImg,
//           price,
//           graphic,
//           img,
//           detailImg,
//           thumbnails,
//           period,
//           reviewCount,
//           brand.brand_name
//         );
//         LENS_LIST_ENTITY.push(productEntity);

//         await crawlerApi.goBackPage(driver, 1000);
//       }
//     }

//     await driver.quit();
//   }

//   lensRepo.addLensInfo(LENS_LIST_ENTITY);
// })();
