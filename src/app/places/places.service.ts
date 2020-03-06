import {Injectable} from '@angular/core';
import {Place} from './place.model';

@Injectable({
    providedIn: 'root'
})
export class PlacesService {
    private _places: Place[] = [
        new Place('1',
            'Manhattan Mansion',
            'In the heart of New York city',
            'https://img.thedailybeast.com/image/upload/c_crop,d_placeholder_euli9k,h_1687,w_3000,x_0,y' +
            '_0/dpr_1.5/c_limit,w_1044/fl_lossy,q_auto/v1562604280/190708-connor-epsteins-home-tease_ig23fo',
            150.65),
        new Place('2',
            'L\'Amour Toujours',
            'A romantic place in Paris',
            'https://i.ytimg.com/vi/VzqA0FpAET0/maxresdefault.jpg',
            203.80),
        new Place('3',
            'Foggy Palace',
            'Not your average city trip!',
            'https://i.pinimg.com/originals/1c/b1/64/1cb164b482c3d5902dc29e5b0de1f716.jpg',
            99.99),
        new Place('4',
            'Agora Tower',
            'Majestic place in the center of Taipei',
            'https://www.bocadolobo.com/blog/wp-content/uploads/2017/06/Majestic-Architectural-Buildings-That-Will-Astound-You-1.jpg',
            130.80),
        new Place('5',
            'Museum of Performance and Design',
            'Dive into magic!',
            'https://www.bocadolobo.com/blog/wp-content/uploads/2017/06/Majestic-Architectural-Buildings-That-Will-Astound-You-2.jpg',
            120.99),
        new Place('6',
            'Modern Art Center',
            'Everything about modern Art...',
            'https://www.bocadolobo.com/blog/wp-content/uploads/2017/06/Majestic-Architectural-Buildings-That-Will-Astound-You-6.jpg',
            85.00)
    ];

    get places() {
        return [...this._places];
    }

    constructor() {
    }

    getPlaceById(placeId: string) {
        return {
            ...this._places.find(place => place.id === placeId)
        };
    }
}
