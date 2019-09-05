import {EventEmitter, Injectable} from '@angular/core';
import {BookDTO} from "../dto/bookDTO";

@Injectable({
    providedIn: 'root'
})
export class EBookService {
    public eBookEmitter: EventEmitter<BookDTO> = new EventEmitter();
    public ePubEmitter: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    public goToBookMark(bookMark) {
        this.ePubEmitter.next({type: 0, value: bookMark});
    }

    public emitEpub(epub) {
        this.ePubEmitter.next({type: 1, value: epub});
    }
}
