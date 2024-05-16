import { UOMDetail } from ".";

export interface Product {
  ItemName: string;
  ItemCode: string;
  PesProm: number;
  SUoMEntry: number;
  PriceList: number;
  Currency: string;
  Price: number;
  UomEntry: number;
  PriceType: string;
  WhsCode: string;
  OnHand: number;
  Quantity: number;
  SelectedCurrency: string;
  UOMList: UOMDetail[];
  SelectedUOM: UOMDetail;
  Meet: string;
}
