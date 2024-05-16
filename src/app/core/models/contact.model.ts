import { ContactPaymentMethod } from ".";

export interface Contact {
  CardCode: string;
  CardName: string;
  CardFName: string;
  ListNum: number;
  GroupNum: number;
  PymntGroup: string;
  PayMethCod: string;
  Descript: string;
  SlpName: string;
  ListName: string;
  Balance: number;
  PaymentMethods: ContactPaymentMethod[];
}
