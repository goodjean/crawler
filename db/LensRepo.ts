import mysql2 from "mysql2";
import { IBrands, IColors, IDays, ILens } from "../types/lens";
import { IBrandsEntity, IColorsEntity, IDaysEntity } from "../types/lensEntity";
import dbConfig from "./db_config/database";

const connection = mysql2.createConnection(dbConfig);

export default class LensRepo {
  addLensInfo(lensInfo: ILens[]) {
    lensInfo.forEach((lens) => {
      connection.query(
        "INSERT INTO lens(ref_id, name, color, color_id, color_img, price, graphic, img, detail_img, eye_thumbnail, model_thumbnail, period, period_classifi, reviewcount, page_url, brand_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [
          lens.ref_id,
          lens.name,
          lens.color,
          lens.colorId,
          lens.colorImg,
          lens.price,
          lens.graphic,
          lens.img,
          lens.detailImg,
          lens.detailThumbs[0],
          lens.detailThumbs[1],
          lens.period,
          lens.periodClassification,
          lens.reviewCount,
          lens.currentUrl,
          lens.brandId,
        ]
      );
    });
  }
  async getDaysEntity(): Promise<IDays[]> {
    return new Promise((resolve) => {
      connection.query<IDaysEntity[]>("SELECT * FROM days;", (err, rows) => {
        if (err) throw err;
        resolve(rows);
      });
    });
  }
  async getBrandsEntity(): Promise<IBrands[]> {
    return new Promise((resolve) => {
      connection.query<IBrandsEntity[]>(
        "SELECT * FROM brands;",
        (err, rows) => {
          if (err) throw err;
          resolve(rows);
        }
      );
    });
  }
  async getColorEntity(): Promise<IColors[]> {
    return new Promise((resolve) => {
      connection.query<IColorsEntity[]>(
        "SELECT * FROM colors;",
        (err, rows) => {
          if (err) throw err;
          resolve(rows);
        }
      );
    });
  }
}
