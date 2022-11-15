import mysql2 from "mysql2";
import dbConfig from "./db_config/database.js";

const connection = mysql2.createConnection(dbConfig);

export default class LensRepo {
  addLensInfo(lensInfo) {
    //중복체크 business에서
    lensInfo.forEach((lens) => {
      connection.query(
        "INSERT INTO lens(ref_id, name, color, color_img, price, graphic, img, detail_img, eye_thumbnail, model_thumbnail, period, period_classifi, reviewcount, brand) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [
          lens.ref_id,
          lens.name,
          lens.color,
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
          lens.brand,
        ]
      );
    });
  }
}
