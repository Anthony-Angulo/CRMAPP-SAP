import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';
import { environment as ENV } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Storage } from '@ionic/storage';
// import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {

  // networksub: any;

  constructor(
    // private http: HttpClient,
    // private storageservice: StorageService,
    // private network: Network,
    // private storage: Storage,
    // private toastController: ToastController,
    // private geolocation: Geolocation
    ) { }

  // async presentToast(data: any) {
  //   const toast = await this.toastController.create({
  //     message: data,
  //     duration: 5000
  //   });
  //   toast.present();
  // }

  // public startNetwork() {
  //   if (this.network.type != 'none') {
  //   }
  //   this.networksub = this.network.onConnect().subscribe(() => {
  //   });
  // }

  // public stopNetwork() {
  //   this.networksub.unsubscribe();
  // }

  // public saveEvents(events, user_id) {

  //   let eventsData = [];

  //   events.forEach(element => {
  //     const formDataEvent = {
  //       name: element.title,
  //       owned_by_id: user_id,
  //       description: element.description,
  //       start_date: element.startTime.getMySQLFormat(),
  //       end_date: element.endTime.getMySQLFormat(),
  //       full_day: (element.allDay) ? 1 : 0,
  //       event_priority_id: element.event_priority_id,
  //     };
  //     eventsData.push(formDataEvent);
  //   });

  //   this.http.post(ENV.apiCRM + '/addEvent', eventsData).subscribe((data: any) => {

  //     this.presentToast('Eventos Guardados');

  //   }, (err: any) => {

  //     this.storageservice.getPendingEvents().then(events => {

  //       if (events) {
  //         eventsData.forEach(element => {
  //           events.push(element);
  //         });
  //         this.storageservice.setPendingEvents(events);
  //       } else {
  //         this.storageservice.setPendingEvents(eventsData);
  //       }

  //     });

  //   });

  // }

  // public updateGeolocation(id: number) {
  //   return this.geolocation.getCurrentPosition({ timeout: 600000, enableHighAccuracy: true }).then((resp) => {

  //     const formData = {
  //       id: id,
  //       longitude: resp.coords.longitude,
  //       latitude: resp.coords.latitude
  //     };

  //     this.storageservice.getContacts().then(contactList => {
  //       const index = contactList.findIndex(contact => contact.id == id);
  //       contactList[index].latitud = formData.latitude;
  //       contactList[index].longitud = formData.longitude;
  //       this.storageservice.setContacts(contactList);
  //     });

  //     this.http.post(ENV.apiCRM + '/updateGeolocationContacts', [formData]).toPromise().then(resp => {

  //       Swal.fire({
  //         title: 'Geolocalizacion Guardada',
  //         type: 'success',
  //         confirmButtonText: 'Enterado.'
  //       });

  //     }).catch(error => {

  //       console.error(error);
  //       this.storageservice.getPendingGeoUpdate().then(geo_update => {

  //         if (geo_update) {
  //           geo_update.push(formData);
  //           this.storageservice.setPendingGeoUpdate(geo_update);
  //         } else {
  //           this.storageservice.setPendingGeoUpdate([formData]);
  //         }

  //       });

  //       Swal.fire({

  //         title: 'Actualizacion Pendiente. Esperando Conexion.',
  //         type: 'success',
  //         confirmButtonText: 'Enterado.'

  //       });

  //     });

  //     return formData;

  //   }).catch((error) => {
  //     throw Error('Error al querer optener geolocalizacion:' + error);
  //   });

  // }

  

}
