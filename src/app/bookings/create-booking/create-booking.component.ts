import {Component, Input, OnInit} from '@angular/core';
import {Place} from '../../places/place.model';
import {ModalController} from '@ionic/angular';
import {NgForm} from '@angular/forms';

@Component({
    selector: 'app-create-booking',
    templateUrl: './create-booking.component.html',
    styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
    @Input() selectedPlace: Place;
    @Input() selectedMode: 'select' | 'random';
    startDate: string;
    endDate: string;

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
        const availableFrom = new Date(this.selectedPlace.availableFrom);
        const availableTo = new Date(this.selectedPlace.availableTo);
        if (this.selectedMode === 'random') {
            this.startDate = new Date(
                availableFrom.getTime()
                + Math.random()
                * (availableTo.getTime()
                - 7 * 24 * 60 * 60 * 1000
                - availableFrom.getTime())
            ).toISOString();

            this.endDate = new Date(new Date(this.startDate).getTime()
                + Math.random()
                * (new Date(this.startDate).getTime()
                    + 6 * 34 * 60 * 60 * 1000
                    - new Date(this.startDate).getTime())
            ).toISOString();
        }
    }

    onCancel() {
        this.modalController.dismiss(null, 'cancel');
    }

    onBookPlace(form: NgForm) {
        if (!form.valid) {
            return;
        }

        this.modalController.dismiss({
            bookingData: {
                firstName: form.value['first-name'],
                lastName: form.value['last-name'],
                guestNumber: +form.value['guest-number'],
                dateFrom: new Date(form.value['date-from']),
                dateTo: new Date(form.value['date-to'])
            }
        }, 'confirm');
    }
}
