import { Builder, By, WebDriver, WebElement } from "selenium-webdriver";
import "chromedriver";
import lensTownConfig from "./brand_config/lensTownConfig";
import olensConfig from "./brand_config/olensConfig";
import lensmeConfig from "./brand_config/lensmeConfig";
import LensRepo from "./db/LensRepo";
import { IBrands, IColors, IDays, ILens } from "./types/lens";
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
  try {
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
  } catch (e) {
    return await driver
      .findElement(By.css("ul > li:nth-child(4) > div.sct_txt > a"))
      .getText();
  }
}

function findColorEntityId(colorEntity: IColors[], color: string): number {
  const EntityByColor = colorEntity.find((cl) => cl.color === color);
  if (!EntityByColor) {
    throw "No color Entity";
  }
  return EntityByColor.id;
}

function getProductColorId(color: string, colorEntity: IColors[]): number {
  const colors = {
    brown: ["브라운", "베이지", "카카오", "코코아", "헤이즐"],
    choco: ["에스프레소", "초코", "카푸치노"],
    gray: ["그레이", "실버"],
    pink: ["로즈", "버건디", "핑크", "바이올렛", "레드", "퍼플"],
    black: ["블랙", "스모키", "샤갈", "BK"],
    blue: ["베리", "블루", "오션"],
    green: ["그린", "카키", "올리브"],
  };

  if (colors.brown.some((cl) => color.includes(cl))) {
    return findColorEntityId(colorEntity, "브라운");
  } else if (colors.choco.some((cl) => color.includes(cl))) {
    return findColorEntityId(colorEntity, "초코");
  } else if (colors.gray.some((cl) => color.includes(cl))) {
    return findColorEntityId(colorEntity, "그레이");
  } else if (colors.pink.some((cl) => color.includes(cl))) {
    return findColorEntityId(colorEntity, "핑크");
  } else if (colors.black.some((cl) => color.includes(cl))) {
    return findColorEntityId(colorEntity, "블랙");
  } else if (colors.blue.some((cl) => color.includes(cl))) {
    return findColorEntityId(colorEntity, "블루");
  } else if (colors.green.some((cl) => color.includes(cl))) {
    return findColorEntityId(colorEntity, "그린");
  } else {
    return findColorEntityId(colorEntity, "그레이");
  }
}

async function getProductColorImg(
  driver: WebDriver,
  config: IBrandConfig
): Promise<string | undefined> {
  try {
    if (
      (await driver.findElement(By.css("#sit_title")).getText()) ===
      "투베러 원데이 블랙"
    ) {
      return await driver
        .findElement(By.css("ul > li:nth-child(4) > div.sct_img > a > img"))
        .getAttribute("src");
    } else {
      return await driver
        .findElement(By.css(config.products_selector.productColorImg))
        .getAttribute("src");
    }
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
      const periodEntity = periodAlpha.split(/[·,/]/)[0].trim();
      const period = periodEntity
        .replace(/1day/gi, periodList[0])
        .replace(/2weeks/gi, periodList[1])
        .replace(/1month/gi, periodList[2])
        .replace(/3months/gi, periodList[3])
        .replace(/6months/gi, periodList[4])
        .replace(/1 year/gi, periodList[5])
        .replace(/1개월/gi, periodList[2])
        .replace(/2~3개월/gi, periodList[3])
        .replace(/3~6개월/gi, periodList[4]);
      // console.log(`[period]: '${period}'`);
      return period;
    } else {
      return periodList[4];
    }
  } catch (e) {
    return periodList[4];
  }
}

function getProductPeriodClassifi(period: string, daysEntity: IDays[]): string {
  let period_classifi = "";
  switch (period) {
    case "1day":
      const onedayEntity = daysEntity.find((days) => days.id === 1);
      if (!onedayEntity) {
        throw "error";
      }
      period_classifi = onedayEntity.en;
      break;
    case "2weeks":
    case "1month":
      const weeklyMonthEntity = daysEntity.find((days) => days.id === 2);
      if (!weeklyMonthEntity) {
        throw "error";
      }
      period_classifi = weeklyMonthEntity.en;
      break;
    case "3month":
    case "6month":
    case "1year":
      const longTermEntity = daysEntity.find((days) => days.id === 3);
      if (!longTermEntity) {
        throw "error";
      }
      period_classifi = longTermEntity.en;
      break;
    default:
      period_classifi = period;
      break;
  }
  console.log(`[period_classifi]: ${period_classifi}`);
  return period_classifi;
}

async function getProductRefId(
  currentUrl: string,
  config: IBrandConfig
): Promise<number> {
  if (!config.dynamicUrl) {
    return Number(currentUrl.replace(config.ref_url, ""));
  } else {
    const pathArr = currentUrl.split("/");
    return Number(pathArr[5]);
  }
}

function getBrandId(config: IBrandConfig, brandsEntity: IBrands[]): number {
  const brand = brandsEntity.find(
    (brand) => brand.en_name === config.brand_name
  );
  if (!brand) {
    throw "No brand";
  }
  return brand.id;
}

function getProduct(
  ref_id: number,
  name: string,
  color: string,
  colorId: number,
  colorImg: string | undefined,
  price: number,
  graphic: number,
  img: string,
  detailImg: string | undefined,
  detailThumbs: string[],
  period: string,
  periodClassification: string,
  reviewCount: number,
  currentUrl: string,
  brandId: number
): ILens {
  return {
    ref_id,
    name,
    color,
    colorId,
    colorImg,
    price,
    graphic,
    img,
    detailImg,
    detailThumbs,
    period,
    periodClassification,
    reviewCount,
    currentUrl,
    brandId,
  };
}

async function goBackPage(driver: WebDriver): Promise<void> {
  await driver.navigate().back();
}

//--------------------------------crawlDetail-----------------------------------

async function crawlDetail(
  driver: WebDriver,
  product: WebElement,
  config: IBrandConfig,
  brandsEntity: IBrands[],
  daysEntity: IDays[],
  colorEntity: IColors[]
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
  console.log("[color]: ", color);
  const colorId = getProductColorId(color, colorEntity);
  const colorImg = await getProductColorImg(driver, config);
  console.log("[colorImg]: ", colorImg);
  const price = await getProductPrice(driver, config);
  const graphic = await getProductGraphic(driver, config);
  const period = await getProductPeriod(driver, config);
  const periodClassification = getProductPeriodClassifi(period, daysEntity);
  const currentUrl = await driver.getCurrentUrl();
  const ref_id = await getProductRefId(currentUrl, config);
  const brandId = getBrandId(config, brandsEntity);
  const crawlProduct = getProduct(
    ref_id,
    name,
    color,
    colorId,
    colorImg,
    price,
    graphic,
    img,
    detailImg,
    detailThumbs,
    period,
    periodClassification,
    reviewCount,
    currentUrl,
    brandId
  );
  config.products.push(crawlProduct);
  await goBackPage(driver);
}

//----------------------------------- Main Exec ---------------------------------------

(async function main() {
  let LENS_LIST_ENTITY: ILens[] = [];
  const lensRepo = new LensRepo();
  const brandsEntity = await lensRepo.getBrandsEntity();
  const daysEntity = await lensRepo.getDaysEntity();
  const colorEntity = await lensRepo.getColorEntity();
  let configs: IBrandConfig[] = [lensTownConfig, olensConfig, lensmeConfig];

  for (let config of configs) {
    await mainCrawler(config, brandsEntity, daysEntity, colorEntity);
    LENS_LIST_ENTITY.push(...config.products);
  }

  lensRepo.addLensInfo(LENS_LIST_ENTITY);
})();

//----------------------------------- Main Crawler ----------------------------------------

async function mainCrawler(
  config: IBrandConfig,
  brandsEntity: IBrands[],
  daysEntity: IDays[],
  colorEntity: IColors[]
): Promise<void> {
  let driver = await goMainPage(config);
  const categories = await getCategories(driver, config);

  for (let i = 0; i < categories.length; i++) {
    await goCategory(categories[i], driver);
    const products = await getProducts(driver, config);

    for (let j = 0; j < products.length; j++) {
      const products = await getProducts(driver, config);
      await crawlDetail(
        driver,
        products[j],
        config,
        brandsEntity,
        daysEntity,
        colorEntity
      );
    }
  }
  await driver.quit();
}
