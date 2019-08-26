import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BookService {

    constructor() {
    }

    public goToNextPageWithBook(element, rendition, book) {
        element.addEventListener("click", function (e) {
            book.package.metadata.direction === "rtl" ? rendition.prev() : rendition.next();
            e.preventDefault();
        }, false);
    }

    public goToNextPage(rendition, book) {
        book.package.metadata.direction === "rtl" ? rendition.prev() : rendition.next();
    }

    public goToPreviousPage(rendition, book) {
        book.package.metadata.direction === "rtl" ? rendition.next() : rendition.prev();
    }

    public getTitle(book) {
        return book.package.metadata.title;
    }
}
