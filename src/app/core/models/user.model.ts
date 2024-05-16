export interface User {
  [appUser: string]: any;
  name: string;
  warehouseName: string;
  warehouseCode: string;
  email: string;
  SAPID: string;
  token: string;
  status: boolean;
  active: boolean;
  roles: string[];
}
