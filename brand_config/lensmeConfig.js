export default {
  products: [],
  brand_name: "lensme",
  review: ["REVIEW (", ")"],
  url: "https://www.lens-me.com/product/list.html?cate_no=120",
  categories: ".menuCategory > li > a",
  ref_url: "dynamicUrl",
  products_selector: {
    productList: [".prdList.hover_thumb.grid4 > li"],
    productImg: ".thumb",
    productDetailThumbs: ".ThumbImage",
    productDetailImg: "#prdDetailContent > p > img",
    productName: ".name > a",
    productColor: ".head_box > h2",
    productColorImg: "displaynone",
    productPrice: ".price.displaynone_sp1.custom_dp",
    productGraphic: "tr.made_in_css.xans-record- > td > div > span",
    productPeriod: "tr.simple_desc_css.xans-record- > td > div > span",
    productReviewCount: ".board_title > h3",
  },
  isColor: false,
  dynamicUrl: true,
  product_a_tag: true,
};
