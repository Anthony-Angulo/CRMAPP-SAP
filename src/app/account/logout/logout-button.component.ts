import { Component, EventEmitter, Output } from '@angular/core';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.css']
})
export class LogoutComponent {

  @Output() logoutEvent = new EventEmitter();

  constructor(private userService: UserService) {
  }

  logout() {
    this.logoutEvent.emit();
    this.userService.logout();
  }

}
