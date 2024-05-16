import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';

const EVENTS_KEY = 'Events';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private storage: Storage, private http: HttpClient) { console.log('EventsServiceContructor'); }

//   getDataFromDatabase(): Promise<any> {
//     return this.http.get(`${environment.apiSAP}/contact/appcrm`).toPromise().then((data: any) => {
//       data.forEach(contact => {
//         if (!contact.CardFName) {
//           contact.CardFName = '';
//         }
//       });
//       this.setContacts(data);
//     });
//   }

  getEvents(): Promise<any[]> {
    return this.storage.get(EVENTS_KEY);
  }

  setEvents(events): void {
    this.storage.set(EVENTS_KEY, events);
  }

}
