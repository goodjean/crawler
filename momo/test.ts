import olensConfig from "../brand_config/olensConfig";
import { Builder, By, WebDriver, WebElement } from "selenium-webdriver";
import "chromedriver";
import { IBrandConfig } from "../types/config";

(async function starter() {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.manage().setTimeouts({ implicit: 2000 });
  await driver.get("https://o-lens.com/product/list-by-main/1");

  const products = await driver.findElements(
    By.css(olensConfig.products_selector.productList[0])
  );
  await driver.executeScript("arguments[0].click();", products[0]);
  await driver.sleep(2000);
  const period = await driver
    .findElement(
      By.css(
        "#container > section > div.product-infos > div.product-infos-desc > ul > li:nth-child(1) > div.dd > span.bar"
      )
    )
    .getText();

  console.log(period);
  await driver.quit();
})();
