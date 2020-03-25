import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionSheetController, AlertController, LoadingController, ModalController, NavController} from '@ionic/angular';
import {PlacesService} from '../../places.service';
import {Place} from '../../place.model';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import {Subscription} from 'rxjs';
import {BookingService} from '../../../bookings/booking.service';
import {AuthService} from '../../../auth/auth.service';

@Component({
    selector: 'app-place-detail',
    templateUrl: './place-detail.page.html',
    styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
    place: Place;
    isBookable = false;
    isLoading = false;
    private placesSub: Subscription;

    constructor(private navController: NavController,
                private activatedRoute: ActivatedRoute,
                private placesService: PlacesService,
                private modalController: ModalController,
                private actionSheetController: ActionSheetController,
                private bookingService: BookingService,
                private loadingController: LoadingController,
                private router: Router,
                private authService: AuthService,
                private alertController: AlertController) {
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navController.navigateBack('/places/tabs/discover');
                return;
            }
            this.isLoading = true;
            this.placesSub = this.placesService.getPlaceById(paramMap.get('placeId'))
                .subscribe(place => {
                        this.place = place;
                        this.isBookable = place.userId !== this.authService.userId;
                        this.isLoading = false;
                    },
                    error => {
                        this.alertController.create({
                            header: 'An error occurred!',
                            message: 'Could not load place',
                            buttons: [{
                                text: 'Okay', handler: () => {
                                    this.router.navigate(['/places/tabs/discover']);
                                }
                            }]
                        }).then(alertEl => {
                            alertEl.present();
                        });
                    });
        });
    }

    ngOnDestroy(): void {
        if (this.placesSub) {
            this.placesSub.unsubscribe();
        }
    }

    ionViewWillEnter() {

    }

    onBookPlace() {
        this.actionSheetController.create({
            header: 'Choose an Action',
            buttons: [
                {
                    text: 'Select Date',
                    handler: () => {
                        this.openBookingModel('select');
                    }
                },
                {
                    text: 'Random Date',
                    handler: () => {
                        this.openBookingModel('random');
                    }
                },
                {
                    text: 'Cancel',
                    role: 'destructive'
                }
            ]
        }).then(actionSheetElement => {
            actionSheetElement.present();
        });
    }

    openBookingModel(mode: 'select' | 'random') {
        console.log(mode);

        this.modalController.create({
            component: CreateBookingComponent,
            componentProps: {selectedPlace: this.place, selectedMode: mode}
        }).then(modalElement => {
            modalElement.present();
            return modalElement.onDidDismiss();
        })
            .then(resultData => {
                if (resultData.role === 'confirm') {
                    console.log('Booked!');
                    const bookingData = resultData.data.bookingData;
                    this.loadingController.create({
                        message: 'Adding new booking...'
                    }).then(loadingEl => {
                        loadingEl.present();

                        this.bookingService.addBooking(this.place.id,
                            this.place.title,
                            this.place.imageUrl,
                            bookingData.firstName,
                            bookingData.lastName,
                            bookingData.guestNumber,
                            bookingData.dateFrom,
                            bookingData.dateTo
                        ).subscribe(() => {
                            loadingEl.dismiss();

                            this.router.navigate(['/bookings']);
                        });
                    });
                }
            });
    }
}
