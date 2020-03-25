import {Component, OnDestroy, OnInit} from '@angular/core';
import {Place} from '../../place.model';
import {PlacesService} from '../../places.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-edit-offer',
    templateUrl: './edit-offer.page.html',
    styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
    offer: Place;
    offerId: string;
    form: FormGroup;
    isLoading = false;
    private offerSubs: Subscription;

    constructor(private placeService: PlacesService,
                private activatedRoute: ActivatedRoute,
                private navController: NavController,
                private router: Router,
                private loadingController: LoadingController,
                private alertController: AlertController) {
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navController.navigateBack('/places/tabs/offers');
                return;
            }
            this.offerId = paramMap.get('placeId');
            this.isLoading = true;
            this.offerSubs = this.placeService.getPlaceById(paramMap.get('placeId'))
                .subscribe(offer => {
                        this.offer = offer;

                        this.form = new FormGroup({
                            title: new FormControl(this.offer.title, {
                                updateOn: 'blur',
                                validators: [Validators.required]
                            }),
                            description: new FormControl(this.offer.description, {
                                updateOn: 'blur',
                                validators: [Validators.required, Validators.maxLength(180)]
                            })
                        });
                        this.isLoading = false;
                    },
                    error => {
                        this.alertController.create({
                            header: 'An error occurred.',
                            message: 'Place could not be fetched. please try again later.',
                            buttons: [{
                                text: 'Okay', handler: () => {
                                    this.router.navigate(['/places/tabs/offers']);
                                }
                            }]
                        }).then(alertEl => {
                            alertEl.present();
                        });
                    });
        });
    }

    ngOnDestroy(): void {
        if (this.offerSubs) {
            this.offerSubs.unsubscribe();
        }
    }

    onEditOffer() {
        if (!this.form.valid) {
            return;
        }

        this.loadingController.create({
            message: 'Updating offer...'
        }).then(loadingEl => {
            loadingEl.present();

            this.placeService.updatePlace(
                this.offer.id,
                this.form.value.title,
                this.form.value.description
            ).subscribe(() => {
                loadingEl.dismiss();
                this.form.reset();
                this.router.navigate(['places/tabs/offers']);
            });
        });


    }
}
