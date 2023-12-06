export interface ILens {
  ref_id: number;
  name: string;
  color: string;
  colorId: number;
  colorImg: string | undefined;
  price: number;
  graphic: number;
  img: string;
  detailImg: string | undefined;
  detailThumbs: string[];
  period: string;
  periodClassification: string;
  reviewCount: number;
  currentUrl: string;
  brandId: number;
}

export interface IDays {
  id: number;
  en: string;
  ko: string;
}

export interface IBrands {
  id: number;
  en_name: string;
  ko_name: string;
}

export interface IColors {
  id: number;
  color: string;
}
