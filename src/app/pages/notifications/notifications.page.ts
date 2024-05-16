import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications: any = [];

  constructor(private notificationService: NotificationsService) { }

  ngOnInit() {
    this.notificationService.getNotifications().then(notificationList => {
      this.notifications = notificationList;
    });
  }

}
