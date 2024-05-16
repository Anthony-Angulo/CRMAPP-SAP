import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Platform } from "@ionic/angular";
import { UserService } from "./account/services/user.service";
import { LoginService } from "./services/login.service";
import { AppUpdate } from "@ionic-native/app-update/ngx";
import { FilesService } from "./services/FilesService.service";
import { File } from "@ionic-native/file/ngx";

// import 'json-hpack';

// declare global {
//   interface JSON {
//     hunpack(data: any, index?: number): JSON;
//   }
// }

declare global {
  interface Date {
    getMySQLFormat(): string;
    getSAPFormat(): string;
    addYears(a: number): Date;
    addMonths(a: number): Date;
    addDays(a: number): Date;
  }

  interface Array<T> {
    swap(a: number, b: number): Array<T>;
  }
}

Array.prototype.swap = function (a: number, b: number) {
  if (a < 0 || a >= this.length || b < 0 || b >= this.length) {
    return;
  }

  const temp = this[a];
  this[a] = this[b];
  this[b] = temp;
  return this;
};

Date.prototype.addYears = function (a: number) {
  return new Date(this.getFullYear() + a, this.getMonth(), this.getDate());
};

Date.prototype.addDays = function (a: number) {
  return new Date(this.getFullYear(), this.getMonth(), this.getDate() + a);
};

Date.prototype.getMySQLFormat = function () {
  return (
    this.getFullYear() +
    "-" +
    (1 + this.getMonth()) +
    "-" +
    this.getDate() +
    " " +
    this.toLocaleTimeString().slice(0, -2)
  );
};

Date.prototype.getSAPFormat = function () {
  return [
    this.getFullYear(),
    1 + this.getMonth() < 10
      ? "0" + (1 + this.getMonth())
      : 1 + this.getMonth(),
    this.getDate() < 10 ? "0" + this.getDate() : this.getDate(),
  ].join("");
};

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private userService: UserService,
    private router: Router,
    private backgroundMode: BackgroundMode,
    private LoginService: LoginService,
    private appUpdate: AppUpdate,
    private file: File
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backgroundMode.enable();
      const updateUrl = "http://crmsap.ccfnweb.com.mx/AppSAP10/update.xml";
      if (this.platform.is("cordova")) {
        this.appUpdate
          .checkAppUpdate(updateUrl, {
            skipPromptDialog: false,
            skipProgressDialog: false,
          })
          .then(() => {
            (data) => console.log(data);
          })
          .catch((error) => console.log(error));

        this.file
          .checkDir("file:///storage/emulated/0/", `productosClientes`)
          .catch(() => {
            this.file
              .createDir(
                "file:///storage/emulated/0/",
                `productosClientes`,
                false
              )
              .then((data) => {
                console.log(data);
              })
              .catch((data) => {
                console.log(data);
              });
          });
      }
      // this.backgroundMode.excludeFromTaskList();
      this.userService.authenticationState.subscribe(async (state) => {
        if (state) {
          this.LoginService.getDatabaseinfo().then(() => {
            this.router.navigate(["dashboard"], { replaceUrl: true });
          });
        } else {
          this.router.navigate(["login"]);
        }
      });
    });
  }
}
