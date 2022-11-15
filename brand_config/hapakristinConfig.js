export default {
  products: [],
  brand_name: "hapakristin",
  review: ["(", ")"],
  url: "https://hapakristin.co.kr/collections/main",
  categories: ".v-pagination__item",
  ref_url: "https://hapakristin.co.kr/products/",
  products_selector: {
    productList: ["div.pa-0.product-item.col-md-1.5.col-6"],
    productImg: ".sct_a > img",
    productDetailThumbs: "#sit_pvi > li > a > img",
    productDetailImg: "#sit_inf_explan",
    productName: ".sct_txt",
    productColor: ".sct_li.active > .sct_txt > a",
    productColorImg: ".sct_li.active > div.sct_img > a > img",
    productPrice: ".dis-price",
    productGraphic:
      ".detail_info > .detail_info_items:nth-child(3) > .detail_info_right",
    productPeriod:
      ".detail_info > .detail_info_items:nth-child(1) > .detail_info_right",
    productReviewCount: ".item_use_count",
  },
  a_tag: false,
};
