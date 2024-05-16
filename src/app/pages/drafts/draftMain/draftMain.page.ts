import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-draftmain',
  templateUrl: './draftMain.page.html',
  styleUrls: ['./draftMain.page.scss'],
})
export class DraftMainPage implements OnInit {

  button_size: string;
  screen_width: number;
  notificationCounts: number;

  constructor(public plt: Platform, public notificationService: NotificationsService) {
    plt.ready().then((readySource) => {
      this.screen_width = plt.width();
    });
  }

  ngOnInit() {
    if (this.screen_width < 550) {
      this.button_size = 'default';
    } else {
      this.button_size = 'large';
    }
  }

  ionViewWillEnter() {
    this.notificationService.getNotifications().then(notificationList => {
      const notifications = notificationList.filter(notification => notification.seen == false);
      this.notificationCounts = notifications.length;
    });
  }

}
