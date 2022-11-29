import { ILens } from "./lens";

export interface IBrandConfig {
  products: ILens[];
  brand_name: string;
  review: string[];
  url: string;
  categories: string;
  ref_url: string;
  products_selector: {
    productList: string[];
    productImg: string;
    productDetailThumbs: string;
    productDetailImg: string;
    productName: string;
    productColor: string;
    productColorImg: string;
    productPrice: string;
    productGraphic: string;
    productPeriod: string;
    productReviewCount: string;
  };
  isColor: boolean;
  dynamicUrl: boolean;
  product_a_tag: boolean;
}
