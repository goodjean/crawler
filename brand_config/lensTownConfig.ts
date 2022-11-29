export default {
  products: [],
  brand_name: "lenstown",
  review: ["(", ")"],
  url: "https://lenstown.co.kr/home/product/?cate=10200500020000",
  categories: ".sct_ct > ul > li > a",
  ref_url: "https://lenstown.co.kr/home/product/detail.php?prdcode=G100000",
  products_selector: {
    productList: [".sct.sct_10 > div"],
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
  isColor: true,
  dynamicUrl: false,
  product_a_tag: true,
};
