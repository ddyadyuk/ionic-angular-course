import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ModalController, NavController} from '@ionic/angular';
import {PlacesService} from '../../places.service';
import {Place} from '../../place.model';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';

@Component({
    selector: 'app-place-detail',
    templateUrl: './place-detail.page.html',
    styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
    place: Place;

    constructor(private navController: NavController,
                private activatedRoute: ActivatedRoute,
                private placesService: PlacesService,
                private modelController: ModalController) {
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navController.navigateBack('/places/tabs/discover');
                return;
            }
            this.place = this.placesService.getPlaceById(paramMap.get('placeId'));
        });
    }

    onBookPlace() {
        this.modelController.create({component: CreateBookingComponent, componentProps: {selectedPlace: this.place}}).then(modalElement => {
            modalElement.present();
            return modalElement.onDidDismiss();
        })
            .then(resultData => {
                console.log(resultData.data, resultData.role);
                if (resultData.role === 'confirm') {
                    console.log('Booked!');
                }
            });
    }
}
