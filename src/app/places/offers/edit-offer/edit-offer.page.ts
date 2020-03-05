import {Component, OnInit} from '@angular/core';
import {Place} from '../../place.model';
import {PlacesService} from '../../places.service';
import {ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-edit-offer',
    templateUrl: './edit-offer.page.html',
    styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
    offer: Place;

    constructor(private placeService: PlacesService,
                private activatedRoute: ActivatedRoute,
                private navController: NavController) {
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navController.navigateBack('/places/tabs/offers');
                return;
            }
            this.offer = this.placeService.getPlaceById(paramMap.get('placeId'));
        });
    }


}
