import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

const APP_ID = '1da8f75f-ed04-428b-ac55-bdd4fdeb0063';
const ANDROID_ID = '666882513764';
const NOTIFICATIONS_KEY = 'Notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private oneSignal: OneSignal,
              private storage: Storage,
              private alertCtrl: AlertController) { }

  setup() {

    this.oneSignal.startInit(APP_ID, ANDROID_ID);

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let msg = data.payload.body;
      let title = data.payload.title;
      let additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });

    this.oneSignal.handleNotificationOpened().subscribe(data => {
      let additionalData = data.notification.payload.additionalData;
      this.showAlert('OPENED', 'To read this beofer', additionalData.task)
    });

    this.oneSignal.endInit();

  }

  getNotifications(): Promise<any[]> {
    return this.storage.get(NOTIFICATIONS_KEY).then(notificationList => {
      return notificationList || [];
    });
  }

  setNotifications(notifications): void {
    this.storage.set(NOTIFICATIONS_KEY, notifications);
  }

  async showAlert(title, msg, task) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Action ${task}`,
          handler: () => {

          }
        }
      ]
    });
    alert.present();
  }

}
