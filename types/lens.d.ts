export interface ILens {
  ref_id: number;
  name: string;
  color: string;
  colorImg: string | undefined;
  price: number;
  graphic: number;
  img: string;
  detailImg: string | undefined;
  detailThumbs: string[];
  period: string;
  periodClassification: string;
  reviewCount: number;
  brand: string;
}
