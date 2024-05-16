import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { UserService } from "src/app/account/services/user.service";
import { environment } from "src/environments/environment";
import {
  Platform,
  ToastController,
  LoadingController,
  AlertController,
} from "@ionic/angular";
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  formData = {
    email: "",
    password: "",
  };

  SapIp: any;
  link: any;

  ip: any = [
    {
      name: "Alestra A",
      type: "radio",
      label: "Alestra A",
      value: environment.alestra_A,
    },
    {
      name: "Alestra B",
      type: "radio",
      label: "Alestra B",
      value: environment.alestra_B,
    },
    {
      name: "Transtelco A",
      type: "radio",
      label: "Transtelco A",
      value: environment.transtelco_A,
    },
    {
      name: "Transtelco B",
      type: "radio",
      label: "Transtelco B",
      value: environment.transtelco_B,
    },
  ];
  constructor(
    private userService: UserService,
    private storage: Storage,
    private alert: AlertController
  ) {}

  async ngOnInit() {
    // this.storage.clear();
    this.storage.get("last_user").then((email) => {
      if (email) {
        this.formData.email = email;
      }
    });

    // await this.storage.set("_SAP_IP", environment.apiSAP);

    // await this.storage.get("_SAP_IP").then((x) => {
    //   if (x == "http://192.168.0.32:8887/api") {
    //     this.link = "Alestra";
    //   } else {
    //     this.link = "Transtelco";
    //   }
    // });
    // this.storage.get("_SAP_IP").then((x) => {
    //   if (x == null) {
    //     this.storage.set("_SAP_IP", environment.apiSAP);
    //     console.log(x);
    //     this.SapIp = true;
    //   } else {
    //     console.log(x);
    //     this.SapIp = false;
    //   }
    // });
  }

  async promptCodeDesc() {
    const alert = await this.alert.create({
      header: "Configuracion",
      inputs: this.ip,
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Aceptar",
          handler: (data) => {
            console.log(data);
            this.link = data;
            this.storage.set("_SAP_IP", data);
            // this.storage.get("_SAP_IP").then((x) => {
            //   if (x == null) {
            //     this.storage.set("_SAP_IP", data);
            //     console.log(x);
            //     // this.SapIp = true;
            //   }
            // });
          },
        },
      ],
    });

    await alert.present();
  }

  // async cambiarIp($event) {
  //   // this.storage.clear();
  //   if ($event.target.checked) {
  //     console.log(1);
  //     await this.storage.set("_SAP_IP", environment.apiSAPAlter);
  //   } else {
  //     console.log(2);
  //     await this.storage.set("_SAP_IP", environment.apiSAP);
  //   }

  //   await this.storage.get("_SAP_IP").then((x) => {
  //     if (x == "http://apisap10.ccfn.com.mx:89/api") {
  //       this.link = "Transtelco";
  //     } else {
  //       this.link = "Alestra";
  //     }
  //   });
  // }

  login() {
    this.userService.login(this.formData);
  }
}
