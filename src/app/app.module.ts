import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { GoogleMaps } from "@ionic-native/google-maps";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { Network } from "@ionic-native/network/ngx";
import { File } from "@ionic-native/file/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";
import { NgCalendarModule } from "ionic2-calendar";
import { AppUpdate } from "@ionic-native/app-update/ngx";
import { PDFGenerator } from "@ionic-native/pdf-generator/ngx";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { UserService } from "./account/services/user.service";
import { FileOpener } from "@ionic-native/file-opener/ngx";

import { PipesModule } from "./pipes/pipes.module";
import { AddTokenInterceptor } from "./services/token.interceptor";
import { AppVersion } from "@ionic-native/app-version/ngx";
// import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
// import { LocationTrackerService  } from './services/location-tracker.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    PipesModule,
    IonicStorageModule.forRoot(),
    NgCalendarModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // LocationTrackerService,
    GoogleMaps,
    Network,
    // BackgroundGeolocation,
    Geolocation,
    BarcodeScanner,
    BackgroundMode,
    OneSignal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UserService,
    File,
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
    WebView,
    PDFGenerator,
    FilePath,
    FileOpener,
    AppUpdate,
    AppVersion,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
