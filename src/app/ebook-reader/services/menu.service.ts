import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    public menuEmitter: EventEmitter<any> = new EventEmitter();

    constructor() {
    }
}

export enum MenuEvents{
    BOOKS_ADDED,
    SHOW_FAVORITES,
    SHOW_ALL
}
