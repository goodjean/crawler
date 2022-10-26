import { Builder, By } from "selenium-webdriver";
import "chromedriver";
import LensMeCrawler from "./brands/lensMeCrawler.js";

(async function helloSelenium() {
  const lens_list_entity = [];
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("https://www.lens-me.com/product/list.html?cate_no=120");
  const categories = await driver.findElements(By.css("#chips-cate > ul > li"));

  const elements = await driver.findElements(
    By.css(
      "#contents > div.xans-element-.xans-product.xans-product-normalpackage > div.xans-element-.xans-product.xans-product-listnormal.ec-base-product > div > ul > li"
    )
  );

  for (let i = 0; i < categories.length; i++) {
    const categories = await driver.findElements(
      By.css("#chips-cate > ul > li")
    );
    await driver.executeScript(
      "return document.getElementsByClassName('inner_bts bg_header')[0].remove();"
    );
    await categories[i].click();

    for (let j = 0; j < 10; j++) {
      await driver.executeScript(
        "return document.getElementsByClassName('widgets')[0].remove();"
      );
      const elements = await driver.findElements(
        By.css(
          "#contents > div.xans-element-.xans-product.xans-product-normalpackage > div.xans-element-.xans-product.xans-product-listnormal.ec-base-product > div > ul > li"
        )
      );
      const name = await elements[j].findElement(By.css(".name")).getText();
      const price = [];
      const priceEntity = await elements[j].findElements(
        By.css(
          "span.price.displaynone_sale.displaynone_optsale.displaynone_custom"
        )
      );

      priceEntity.forEach(async (priceEle) => {
        const priceByOne = await priceEle.getText();
        const priceToNum = Number(priceByOne.replace(/\D/g, ""));
        price.push(priceToNum);
      });
      const graphic = await elements[j]
        .findElement(By.css(".summary"))
        .getText();
      const img = await elements[j]
        .findElement(By.css(".thumb"))
        .getAttribute("src");
      await elements[j].click();
      const currentUrl = await driver.getCurrentUrl();
      const pathArray = currentUrl.split("/");
      const ref_id = Number(pathArray[5]);
      await driver.navigate().back();
      await driver.sleep(2000);
      lens_list_entity.push({ ref_id, name, price, graphic, img });
    }
  }
  console.log(lens_list_entity);
  await driver.quit();
})();
