import { Column, Order, Search } from ".";

export interface SearchRequest {
  Draw?: number;
  start?: number;
  length?: number;
  columns?: Column[];
  search?: Search;
  order?: Order[];
}
