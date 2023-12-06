import { RowDataPacket } from "mysql2";

export interface IDaysEntity extends RowDataPacket {
  id: number;
  en: string;
  ko: string;
}

export interface IBrandsEntity extends RowDataPacket {
  id: number;
  en_name: string;
  ko_name: string;
}

export interface IColorsEntity extends RowDataPacket {
  id: number;
  color: string;
}
