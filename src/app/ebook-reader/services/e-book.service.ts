import {EventEmitter, Injectable} from '@angular/core';
import {BookDTO} from "../dto/BookDTO";

export enum EPUB_EVENT_TYPES {
    GO_TO_BOOKMARK = 0,
    EPUB = 1,
    GO_TO_CHAPTER = 2,
    FONT_SIZE_CHANGED,
    TEXT_COLOR_CHANGED,
    BACKGROUND_COLOR_CHANGED,
    BOOKMARKS_LOADED,
    TEXT_BOLD_CHANGED,
    TEXT_ITALIC_CHANGED
}


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

    public getPagePercentByCfi(epub, cfi) {
        return (epub.locations.percentageFromCfi(cfi) * 100).toPrecision(3);
    }

    public getCurrentLocation(epub) {
        return epub.rendition.currentLocation();
    }

    public getSpineItemByLocation(epub, location) {
        return epub.spine.get(location);
    }

    public getNavItemBySpine(epub, spine) {
        return epub.navigation.get(spine.href);
    }

    public getStartCfi(epub) {
        return epub.rendition.currentLocation().start.cfi;
    }
}
