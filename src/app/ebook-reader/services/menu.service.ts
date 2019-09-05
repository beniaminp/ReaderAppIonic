import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    public menuEmitter: EventEmitter<any> = new EventEmitter();

    constructor() {
    }
}
