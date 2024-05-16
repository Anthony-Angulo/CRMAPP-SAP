import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-draftlist',
  templateUrl: './draftList.page.html',
  styleUrls: ['./draftList.page.scss'],
})
export class DraftListPage implements OnInit {

  draftList = [];

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.draftList = this.orderService.getOrderDrafts();
    // this.orderService.getOrderDrafts().then(draftList => {
    //   this.draftList = draftList;
    // });
  }

}
