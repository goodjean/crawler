import mysql2 from "mysql2";
import dbConfig from "./config/database.js";

const connection = mysql2.createConnection(dbConfig);

export default class LensRepo {
  addLensEntity(lensEntity) {
    lensEntity.forEach((lens) => {
      connection.query(
        "INSERT INTO lens(ref_id, name, price, mid_price, high_price, graphic, img, brand) VALUES(?, ?, ?, ?, ?, ?, ?, ?);",
        [
          lens.ref_id,
          lens.name,
          lens.price[0],
          lens.price[1],
          lens.price[2],
          lens.graphic,
          lens.img,
          lens.brand,
        ]
      );
    });
  }
}
