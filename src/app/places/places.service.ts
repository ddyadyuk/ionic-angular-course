import {Injectable} from '@angular/core';
import {Place} from './place.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject, of} from 'rxjs';
import {delay, filter, map, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

interface PlaceData {
    availableFrom: string;
    availableTo: string;
    description: string;
    imageUrl: string;
    price: number;
    title: string;
    userId: string;
}

@Injectable({
    providedIn: 'root'
})
// [
// new Place('1',
//     'Manhattan Mansion',
//     'In the heart of New York city',
//     'https://img.thedailybeast.com/image/upload/c_crop,d_placeholder_euli9k,h_1687,w_3000,x_0,y' +
//     '_0/dpr_1.5/c_limit,w_1044/fl_lossy,q_auto/v1562604280/190708-connor-epsteins-home-tease_ig23fo',
//     150.65,
//     new Date('2019-01-01'),
//     new Date('2020-12-30'),
//     'abs'),
//     new Place('2',
//         'L\'Amour Toujours',
//         'A romantic place in Paris',
//         'https://i.ytimg.com/vi/VzqA0FpAET0/maxresdefault.jpg',
//         203.80,
//         new Date('2019-01-01'),
//         new Date('2020-12-30'),
//         'abs'),
//     new Place('3',
//         'Foggy Palace',
//         'Not your average city trip!',
//         'https://i.pinimg.com/originals/1c/b1/64/1cb164b482c3d5902dc29e5b0de1f716.jpg',
//         99.99,
//         new Date('2019-01-01'),
//         new Date('2020-12-30'),
//         'abs'),
//     new Place('4',
//         'Agora Tower',
//         'Majestic place in the center of Taipei',
//         'https://www.bocadolobo.com/blog/wp-content/uploads/2017/06/Majestic-Architectural-Buildings-That-Will-Astound-You-1.jpg',
//         130.80,
//         new Date('2019-01-01'),
//         new Date('2020-12-30'),
//         'abs'),
//     new Place('5',
//         'Museum of Performance and Design',
//         'Dive into magic!',
//         'https://www.bocadolobo.com/blog/wp-content/uploads/2017/06/Majestic-Architectural-Buildings-That-Will-Astound-You-2.jpg',
//         120.99,
//         new Date('2019-01-01'),
//         new Date('2020-12-30'),
//         'abs'),
//     new Place('6',
//         'Modern Art Center',
//         'Everything about modern Art...',
//         'https://www.bocadolobo.com/blog/wp-content/uploads/2017/06/Majestic-Architectural-Buildings-That-Will-Astound-You-6.jpg',
//         85.00,
//         new Date('2019-01-01'),
//         new Date('2020-12-30'),
//         'abs')
// ]
export class PlacesService {
    private _places = new BehaviorSubject<Place[]>([]);

    get places() {
        return this._places.asObservable();
    }

    constructor(private authService: AuthService,
                private httpClient: HttpClient) {
    }

    fetchPlaces() {
        return this.httpClient.get<{ [key: string]: PlaceData }>('https://ionic-angular-test-cource.firebaseio.com/offered-places.json')
            .pipe(map(respData => {
                    const places = [];
                    for (const key in respData) {
                        if (respData.hasOwnProperty(key)) {
                            places.push(new Place(
                                key,
                                respData[key].title,
                                respData[key].description,
                                respData[key].imageUrl,
                                respData[key].price,
                                new Date(respData[key].availableTo),
                                new Date(respData[key].availableFrom),
                                respData[key].userId));
                        }
                    }
                    return places;
                }),
                tap(places => {
                    this._places.next(places);
                }));
    }

    getPlaceById(placeId: string) {
        return this.httpClient.get<PlaceData>(`https://ionic-angular-test-cource.firebaseio.com/offered-places/${placeId}.json`)
            .pipe(map(placeData => {
                    return new Place(
                        placeId,
                        placeData.title,
                        placeData.description,
                        placeData.imageUrl,
                        +placeData.price,
                        new Date(placeData.availableFrom),
                        new Date(placeData.availableTo),
                        placeData.userId
                    );
                })
            );
    }

    addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
        let generatedId: string;
        const newPlace = new Place(Math.random().toString(),
            title,
            description,
            'https://www.bocadolobo.com/blog/wp-content/uploads/2017/06/Majestic-Architectural-Buildings-That-Will-Astound-You-6.jpg',
            price,
            dateFrom,
            dateTo,
            this.authService.userId
        );
        // Takes only one object of the Place[] type and then subscribes on it
        return this.httpClient
            .post<{ name: string }>('https://ionic-angular-test-cource.firebaseio.com/offered-places.json', {...newPlace, id: null})
            .pipe(
                switchMap(resData => {
                    generatedId = resData.name;
                    return this.places;
                }),
                take(1),
                tap(places => {
                    newPlace.id = generatedId;
                    this._places.next(places.concat(newPlace));
                }));
        //  this.places.pipe(take(1),
        // delay(1000),
        // tap(places => {
        //     this._places.next(places.concat(newPlace));
        // }));
    }

    updatePlace(placeId: string, title: string, description: string) {
        let updatedPlaces: Place[];
        return this.places.pipe(
            take(1),
            switchMap(places => {
                if (!places || places.length <= 0) {
                    return this.fetchPlaces();
                } else {
                    return of(places);
                }
            }),
            switchMap(places => {
                const updatedPlaceIndex = places.findIndex(p => p.id === placeId);
                updatedPlaces = [...places];
                const oldPlace = updatedPlaces[updatedPlaceIndex];

                updatedPlaces[updatedPlaceIndex] = new Place(oldPlace.id,
                    title,
                    description,
                    oldPlace.imageUrl,
                    oldPlace.price,
                    oldPlace.availableFrom,
                    oldPlace.availableTo,
                    oldPlace.userId);

                return this.httpClient.put(`https://ionic-angular-test-cource.firebaseio.com/offered-places/${placeId}.json`,
                    {...updatedPlaces[updatedPlaceIndex], id: null});
            }), tap(() => {
                this._places.next(updatedPlaces);
            }));
    }
}
