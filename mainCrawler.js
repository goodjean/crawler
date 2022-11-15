import { Builder, By, Key } from "selenium-webdriver";
import { Driver } from "selenium-webdriver/chrome.js";
import { addConsoleHandler } from "selenium-webdriver/lib/logging.js";
import lensTownConfig from "./brand_config/lensTownConfig.js";
import olensConfig from "./brand_config/olensConfig.js";
import hapakristinConfig from "./brand_config/hapakristinConfig.js";
import CrawlerApi from "./crawler_api/crawlerApi.js";
import LensRepo from "./db/LensRepo.js";

//--------------------------- Crawler Api --------------------------------

async function goMainPage(config) {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.manage().setTimeouts({ implicit: 2000 });
  await driver.get(config.url);
  return driver;
}

async function getCategories(driver, config) {
  const categories = await driver.findElements(By.css(config.categories));
  try {
    const urls = [];
    for (let i = 0; i < categories.length; i++) {
      const url = await categories[i].getAttribute("href");
      urls.push(url);
    }
    return urls;
  } catch (e) {
    return categories;
  }
}

async function goCategory(category, driver) {
  await driver.get(category);
}

async function getProducts(driver, config) {
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

async function clickProduct(driver, product, config) {
  if (config.a_tag) {
    await product.click();
  } else {
    await driver.executeScript("arguments[0].click();", product);
    // await driver.sleep(2000);
  }
}

async function getReviewCount(driver, config) {
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

async function getDetailImg(driver, config) {
  try {
    const detailImgEle = await driver.findElement(
      By.css(config.products_selector.productDetailImg)
    );
    return await detailImgEle.findElement(By.css("img")).getAttribute("src");
  } catch (e) {
    console.log("디테일 이미지 없음");
  }
}

async function getDetailThumbs(driver, config) {
  let detail = [];
  const detailThumbEles = await driver.findElements(
    By.css(config.products_selector.productDetailThumbs)
  );
  for (let detailThumbEle of detailThumbEles) {
    if (detail.length < 2) {
      const detailThumb = await detailThumbEle.getAttribute("src");
      detail.push(detailThumb);
    }
  }
  console.log(`[detailThumbs]: ${detail[0]}, ${detail[1]}`);
  return detail;
}

async function getProductPrice(driver, config) {
  const priceEntity = await driver
    .findElement(By.css(config.products_selector.productPrice))
    .getText();
  const price = Number(priceEntity.replace(/\D/g, ""));
  console.log(`[price]: ${price}`);
  return price;
}

async function getProductGraphic(driver, config) {
  const graphicAlpha = await driver
    .findElement(By.css(config.products_selector.productGraphic))
    .getText();
  const graphic = Number(graphicAlpha.substr(0, 4));
  console.log(`[Graphic]: ${graphic}`);
  return graphic;
}

async function getProductPeriod(driver, config) {
  const periodList = ["1day", "2weeks", "1month", "3month", "6month", "1year"];
  const periodAlpha = await driver
    .findElement(By.css(config.products_selector.productPeriod))
    .getText();
  const periodEntity = periodAlpha.split(/[·,/]/)[0];
  const period = periodEntity
    .replace(/1day /gi, periodList[0])
    .replace(/2weeks /gi, periodList[1])
    .replace(/1month/gi, periodList[2])
    .replace(/3months/gi, periodList[3])
    .replace(/6months/gi, periodList[4])
    .replace(/1 year/gi, periodList[5])
    .replace(/1개월 /gi, periodList[2])
    .replace(/2~3개월 /gi, periodList[3])
    .replace(/3~6개월 /gi, periodList[4]);
  // console.log(`[period]: '${period}'`);
  return period;
}

async function getProductPeriodClassifi(period) {
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
      period;
      break;
  }
  console.log(`[period_classifi]: ${period_classifi}`);
  return period_classifi;
}

function getProduct(
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
  brand
) {
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

async function goBackPage(driver) {
  await driver.navigate().back();
}

//--------------------------------crawlDetail-----------------------------------

async function crawlDetail(driver, product, config) {
  const name = await product
    .findElement(By.css(config.products_selector.productName))
    .getText();
  const img = await product
    .findElement(By.css(config.products_selector.productImg))
    .getAttribute("src");
  await clickProduct(driver, product, config);
  const reviewCount = await getReviewCount(driver, config);
  const detailImg = await getDetailImg(driver, config);
  const detailThumbs = await getDetailThumbs(driver, config);
  const color = await driver
    .findElement(By.css(config.products_selector.productColor))
    .getText();
  const colorImg = await driver
    .findElement(By.css(config.products_selector.productColorImg))
    .getAttribute("src");
  const price = await getProductPrice(driver, config);
  const graphic = await getProductGraphic(driver, config);
  console.log(`[product-img]: ${colorImg}`);
  const period = await getProductPeriod(driver, config);
  const periodClassification = await getProductPeriodClassifi(period);
  const currentUrl = await driver.getCurrentUrl();
  const ref_id = Number(currentUrl.replace(config.ref_url, ""));
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
  let LENS_LIST_ENTITY = [];
  let configs = [lensTownConfig, olensConfig, hapakristinConfig];
  const lensRepo = new LensRepo();
  // for(let config of configs) {
  //   mainCrawler(config)
  // }
  await mainCrawler(configs[1]);
  LENS_LIST_ENTITY.push(...configs[1].products);
  lensRepo.addLensInfo(LENS_LIST_ENTITY);
})();

//----------------------------------- Main Crawler ----------------------------------------

async function mainCrawler(config) {
  let driver = await goMainPage(config);
  const categories = await getCategories(driver, config);
  console.log(categories.length);

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
