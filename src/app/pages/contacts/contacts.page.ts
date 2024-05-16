import { Component, OnInit } from '@angular/core';
import { FilesService } from 'src/app/services/FilesService.service';
import { ContactService } from '../../services/contact.service';
import Swal from 'sweetalert2';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  contactList = [];
  searchText = '';

  constructor(private loadingController: LoadingController,private contactService: ContactService,private FileService:FilesService) { }

  ngOnInit() {
    this.contactService.getContacts().then(contactList => {
      this.contactList = contactList;
    });
  }
 
}
