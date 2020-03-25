import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookingService} from './booking.service';
import {Booking} from './booking.model';
import {IonItemSliding, LoadingController} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
    loadedBookings: Booking[];
    isLoading = false;
    bookingsSub: Subscription;

    constructor(private bookingService: BookingService,
                private loadingController: LoadingController) {
    }

    ngOnInit() {
        this.bookingsSub = this.bookingService.bookings.subscribe(bookings => {
            console.log(bookings);
            this.loadedBookings = bookings;
        });
    }

    ionViewWillEnter() {
        this.isLoading = true;
        this.bookingService.fetchBookings().subscribe(() => this.isLoading = false);
    }

    ngOnDestroy(): void {
        if (this.bookingsSub) {
            this.bookingsSub.unsubscribe();
        }
    }

    onCancelBooking(id: string, slidingBooking: IonItemSliding) {
        slidingBooking.close();
        this.loadingController.create({
            message: 'Deleting booking...'
        }).then(loadingEl => {
            loadingEl.present();
            this.bookingService.cancelBooking(id).subscribe(() => loadingEl.dismiss());
        });
    }
}
