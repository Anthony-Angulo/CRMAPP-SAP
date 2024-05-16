import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { File } from "@ionic-native/file/ngx";
import { ToastController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { Platform } from "@ionic/angular";
import { environment } from "src/environments/environment";
import { UserService } from "../account/services/user.service";

@Injectable({
  providedIn: "root",
})
export class FilesService {
  blob: Blob;
  fileData: JSON;
  _SAP_IP: any;
  constructor(
    private file: File,
    private toastController: ToastController,
    private platform: Platform,
    private http: HttpClient,
    private userService: UserService,
    private storage: Storage
  ) {}

  public async FileExist(Contact): Promise<any> {
    if (this.platform.is("cordova")) {
      return this.file
        .checkFile(this.file.externalDataDirectory, `${Contact}.txt`)
        .then((data) => {
          return data;
        })
        .catch(async (err) => {
          return false;
        });
    }
  }

  public async CrearArchivo(Contact) {
    if (this.platform.is("cordova")) {
      this.file.createFile(
        this.file.externalDataDirectory,
        `${Contact}.txt`,
        true
      );
      await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
      this.http
        .get(`${this._SAP_IP}/ProductosPreferidos/Productos/${Contact}`)
        .toPromise()
        .then((data: any) => {
          console.log(data);
          let url = data;
          let environmentToString = JSON.stringify(url);

          this.blob = new Blob([environmentToString], {
            type: "text/plain",
          });

          let writePromise = this.file.writeFile(
            this.file.externalDataDirectory,
            `${Contact}.txt`,
            this.blob,
            { replace: true, append: false }
          );

          writePromise.then(() => {});
        });
    }
  }

  public async readFile(Contact) {
    let promise = this.file.readAsText(
      this.file.externalDataDirectory,
      `${Contact}.txt`
    );

    await promise
      .then((value) => {
        this.fileData = JSON.parse(value);
        console.log(value);
      })
      .catch((err) => {
        console.log(err);
        this.presentToast("Error al leer archivo", "danger");
      });
  }

  public async saveFile(
    apiSAP: string,
    porcentaje: string,
    sucursal: string,
    IpImpresora: string
  ) {
    let uri = {
      apiSAP: apiSAP,
      porcentaje: porcentaje,
      sucursal: sucursal,
      IpImpresora: IpImpresora,
    };

    let environmentToString = JSON.stringify(uri);

    this.blob = new Blob([environmentToString], { type: "text/plain" });

    let writePromise = this.file.writeFile(
      this.file.externalDataDirectory,
      "settings.txt",
      this.blob,
      { replace: true, append: false }
    );

    await writePromise
      .then(() => {
        this.presentToast("Guardado correctamente", "success");
      })
      .catch((err) => {
        this.presentToast("Error al guardar", "danger");
      });

    this.readFile("");
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toastController.create({
      message: msg,
      color: color,
      duration: 4000,
    });
    toast.present();
  }
}
