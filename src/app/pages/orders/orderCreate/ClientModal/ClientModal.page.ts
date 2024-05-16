import { Component, Input, OnInit } from "@angular/core";
import { ProductService } from "../../../../services/product.service";
import { LoadingController, ModalController, Platform } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { FileOpener } from "@ionic-native/file-opener/ngx";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from "@ionic-native/file/ngx";
import { UserService } from "src/app/account/services/user.service";
enum Estrellas {
  "*" = 1,
  "**" = 2,
  "***" = 3,
  "****" = 4,
}

@Component({
  selector: "app-ClientModal",
  templateUrl: "./ClientModal.page.html",
})
export class ClientModal implements OnInit {
  pdfObj = null;
  Estrellas = Estrellas;
  productList = [];
  items = [];
  GrupoEscogido = "";
  searchText = "";
  @Input() client: any;
  constructor(
    private userService: UserService,
    private loadingController: LoadingController,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private http: HttpClient,
    public modalCtrl: ModalController,
    private productService: ProductService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.items = [
      "TODOS",
      "ABARROTES",
      "LACTEOS",
      "CARNES",
      "FRUTAS Y VERDURAS",
      "MERCANCIAS GENERALES",
      "PANADERIA Y TORTILLERIA",
      "FARMACIA",
      "ALIMENTOS PREPRADOS",
      "PRODUCTOS EMPACADOS",
    ];
  }
  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }

  /**
   * @param  {any} Producto a verificar stock
   */
  productwithstock(product: any) {
    if (product.stocks.length == 0) {
      return false;
    }
    product.stocks.map((stock) => {
      if (stock.OnHand > 1) {
        return true;
      }
    });
    return false;
  }
  cargar(event) {
    this.userService.getUser().then((user) => {
      this.GrupoEscogido = event.detail.value;
      this.http
        .get(
          `${environment.apiSAP}/ProductosPreferidos/Productos/${this.client.CardCode}/${event.detail.value}`
        )
        .toPromise()
        .then((data: []) => {
          console.log(data);
          this.productList = data;
        });
    });
  }
  load;
  async CargarLoading() {
    this.load = await this.loadingController.create({
      message: "Exportando pdf",
    });
    await this.load.present();
  }

  async exportar() {
    await this.CargarLoading();
    var docDefinition = {
      content: [
        {
          text: `Lista de productos del cliente ${this.client.CardCode}`,
          style: "header",
        },
        { text: new Date().toTimeString(), alignment: "right" },
        {
          ul: [],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0],
        },
        story: {
          italic: true,
          alignment: "center",
          width: "50%",
        },
      },
    };

    if (this.productList.length == 0) {
      await this.http
        .get(
          `${environment.apiSAP}/ProductosPreferidos/Productos/${this.client.CardCode}/TODOS`
        )
        .toPromise()
        .then((data: []) => {
          this.productList = data;
        });
    }
    this.productList = this.productList.sort(function (a, b) {
      if (a.ItmsGrpNam > b.ItmsGrpNam) {
        return 1;
      }
      if (a.ItmsGrpNam < b.ItmsGrpNam) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    let grupoviejo;
    let gruponuevo;
    let productoGrupo = [];
    grupoviejo = this.productList[0].ItmsGrpNam;
    this.productList.map((x) => {
      gruponuevo = x.ItmsGrpNam;
      if (gruponuevo == grupoviejo) {
        productoGrupo.push(x);
        return;
      }
      if (gruponuevo != grupoviejo && grupoviejo != undefined) {
        docDefinition.content.push(
          { text: `${grupoviejo}`, style: "header" },
          {
            ul: productoGrupo.map(
              (x) => x.ItemCode + " " + x.ItemName + " " + Estrellas[x.status]
            ),
          }
        );
        productoGrupo = [];
        productoGrupo.push(x);
      }
      grupoviejo = gruponuevo;
    });
    docDefinition.content.push(
      { text: `${grupoviejo}`, style: "header" },
      {
        ul: productoGrupo.map(
          (x) => x.ItemCode + " " + x.ItemName + " " + Estrellas[x.status]
        ),
      }
    );
    if (this.productList.length == 0) return;
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.downloadPdf();
    this.load.dismiss();
  }

  downloadPdf() {
    let date = new Date().toISOString();
    if (this.plt.is("cordova")) {
      this.pdfObj.getBuffer(async (buffer) => {
        var blob = new Blob([buffer], { type: "application/pdf" });

        // Save the PDF to the data Directory of our App
        let url;
        await this.file
          .checkDir(
            "file:///storage/emulated/0/productosClientes",
            `${this.client.CardCode}`
          )
          .catch(async () => {
            await this.file
              .createDir(
                "file:///storage/emulated/0/productosClientes",
                `${this.client.CardCode}`,
                true
              )
              .then((data) => {
                url = data.nativeURL;
              })
              .catch(() => {});
          });
        this.file
          .removeFile(url, `${this.client.CardCode}-${this.GrupoEscogido}.pdf`)
          .then(() => {})
          .finally(() => {
            this.file
              .writeFile(
                url,
                `${this.client.CardCode}-${this.GrupoEscogido}.pdf`,
                blob,
                { replace: true }
              )
              .then((fileEntry) => {
                // Open the PDf with the correct OS tools
                this.fileOpener.open(
                  url + `${this.client.CardCode}-${this.GrupoEscogido}.pdf`,
                  "application/pdf"
                );
              });
          });
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }
}
