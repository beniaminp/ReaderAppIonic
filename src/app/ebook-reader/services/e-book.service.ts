import {EventEmitter, Injectable} from '@angular/core';
import {BookDTO} from "../dto/bookDTO";

@Injectable({
    providedIn: 'root'
})
export class EBookService {
    public eBookEmitter: EventEmitter<BookDTO> = new EventEmitter();

    constructor() {
    }
}
