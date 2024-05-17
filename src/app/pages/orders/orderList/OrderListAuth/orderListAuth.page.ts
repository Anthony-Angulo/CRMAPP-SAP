import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ToastController, LoadingController } from "@ionic/angular";
import { UserService } from "src/app/account/services/user.service";
import { OrderService } from "src/app/services/order.service";
import { Storage } from "@ionic/storage";
import { environment } from "src/environments/environment";
import { ContactService } from "../../../../services/contact.service";
import { FilterByPipePipe } from "../../../../pipes/filter-by-pipe.pipe";
enum Status {
  "O" = "Abierto",
  "C" = "Aprobada",
  "X" = "No_Aprobada",
  "M" = "Modificando",
  "V" = "Visualizando",
}
enum backgrounds {
  "O" = "green",
  "C" = "red",
}

@Component({
  selector: "app-orderlistAuth",
  templateUrl: "./orderListAuth.page.html",
  styleUrls: ["./orderListAuth.page.scss"],
})
export class OrderListAuth implements OnInit {
  Status = Status;
  backgrounds = backgrounds;
  _SAP_IP: any;
  orderListAuth = [];
  pendingOrderList = [];
  contactList = [];
  contact: any;
  contactListSearchBar = [];
  load: any;
  filterPipe: FilterByPipePipe;

  constructor(
    private orderService: OrderService,
    private storage: Storage,
    public toastController: ToastController,
    private userService: UserService,
    private http: HttpClient,
    private contactService: ContactService,
    private loadingController: LoadingController
  ) {
    this.filterPipe = new FilterByPipePipe();
  }

  ngOnInit() {
    this.getData();
  }
  async getData() {
    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
    return this.userService
      .getUser()
      .then((user) => {
        if (user.AppLogin.id != 0) {
          const date = new Date();
          return this.http
            .get(`${this._SAP_IP}/OrdersAuth/GetByUser/${user.AppLogin.id}`)
            .toPromise()
            .then((data) => {
              return data;
            });
        } else {
          return this.http
            .get(`${this._SAP_IP}/order/CRMAPP/list/`)
            .toPromise()
            .then((data) => {
              return data;
            });
          throw Error("No Tiene numero de SAP asignado.");
        }
      })

      .then((data: any) => {
        data.forEach((element) => {
          switch (element.Auth) {
            case "0":
              element.status = "O";
              break;
            case "1":
              element.status = "C";
              break;
            case "2":
              element.status = "X";
              break;
            case "3":
              element.status = "M";
              break;
            case "4":
              element.status = "V";
              break;
            default:
              break;
          }
        });
        this.orderListAuth = data;
        console.log(this.orderListAuth);
      })
      .then(() => {
        return this.contactService.getContacts();
      })
      .then((contactList: any) => {
        this.contactList = contactList;
      });
  }

  initialDate = Date.now();
  finalDate = Date.now();

  async Buscar() {
    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
    this.load = await this.loadingController.create({
      message: "Obteniendo Informacion",
    });
    await this.load.present();

    const dates = {
      initialDate: this.initialDate,
      finalDate: this.finalDate,
    };
    return this.userService
      .getUser()
      .then((user) => {
        if (user.AppLogin.id != 0) {
          const date = new Date();
          return this.http
            .post(
              `${this._SAP_IP}/OrdersAuth/GetByUserDates/${user.AppLogin.id}/${this.contact.CardCode}`,
              dates
            )
            .toPromise()
            .then((data) => {
              return data;
            })
            .catch(() => {
              this.orderListAuth = [];
            });
        } else {
          return this.http
            .get(`${this._SAP_IP}/order/CRMAPP/list/`)
            .toPromise()
            .then((data) => {
              return data;
            });
          throw Error("No Tiene numero de SAP asignado.");
        }
      })

      .then((data: any) => {
        data.forEach((element) => {
          switch (element.Auth) {
            case "0":
              element.status = "O";
              break;
            case "1":
              element.status = "C";
              break;
            case "2":
              element.status = "X";
              break;
            case "3":
              element.status = "M";
              break;
            case "4":
              element.status = "V";
              break;
            default:
              break;
          }
        });
        this.orderListAuth = data;
        console.log(this.orderListAuth);
      })
      .finally(() => this.load.dismiss());
  }

  public searchContacts(value) {
    if (value && value.trim() != "") {
      this.contactListSearchBar = this.filterPipe.transform(
        this.contactList,
        value
      );
    } else {
      this.contactListSearchBar = [];
    }
  }

  addContact(contact: any) {
    console.log(contact);
    this.contact = contact;
    this.contactListSearchBar = [];
    // this.clientSearchBar.value = "";
  }
}
