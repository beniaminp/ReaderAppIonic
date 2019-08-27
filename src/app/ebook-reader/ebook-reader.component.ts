import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Platform} from "@ionic/angular";
import {Storage} from '@ionic/storage';
import {BookDTO} from "./bookDTO";

declare var ePub: any;

@Component({
    selector: 'app-ebook-reader',
    templateUrl: './ebook-reader.component.html',
    styleUrls: ['./ebook-reader.component.scss']
})
export class EbookReaderComponent implements OnInit, AfterViewInit {
    @Input('ebookSource')
    public ebookSource: any;

    public isBookmarkSet: boolean = false;

    private book: any;
    private rendition: any;
    private bookDTO: BookDTO;

    constructor(public platform: Platform,
                public storage: Storage) {
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.initBook();
    }

    private initBook() {
        if (this.ebookSource == null) {
            alert('No ebook selected');
        }
        this.book = ePub(this.ebookSource);
        this.rendition = this.book.renderTo("book", {
            width: '100%',
            height: this.platform.height() - 70,
            spread: 'always'
        });

        this.rendition.display();

        this.book.ready.then(() => {
            this.storage.get('books').then((res) => {
                if (res != null) {
                    let books: BookDTO[] = JSON.parse(res);
                    let currentBooks = books.filter(book => book.uniqueIdentifier.toLowerCase() == this.book.package.uniqueIdentifier.toLowerCase());
                    if (currentBooks.length > 0) {
                        this.bookDTO = currentBooks[0];
                    }
                    else {
                        this.bookDTO = new BookDTO();
                        this.bookDTO.uniqueIdentifier = this.book.package.uniqueIdentifier;
                        currentBooks.push(this.bookDTO);
                        this.storage.set('books', JSON.stringify(currentBooks)).then();
                    }
                } else {
                    this.bookDTO = new BookDTO();
                    this.bookDTO.uniqueIdentifier = this.book.package.uniqueIdentifier;
                    this.storage.set('books', JSON.stringify([this.bookDTO])).then();
                }
            });

            var keyListener = (e) => {
                if (this.isBookmarkPress(e)) {
                    this.setUnsetBookmark();
                    return;
                }

                if (this.platform.width() / 2 > e.x) {
                    this.book.package.metadata.direction === "rtl" ? this.rendition.next() : this.rendition.prev();
                } else {
                    this.book.package.metadata.direction === "rtl" ? this.rendition.prev() : this.rendition.next();
                }
            };

            this.rendition.on("mouseup", keyListener);
            document.addEventListener("mouseup", keyListener, false)
        });
    }

    public isBookmarkPress(clickEvent) {
        if (clickEvent.y < 50
            && clickEvent.x > this.platform.width() - 50) {
            return true;
        }
        return false;
    }

    public setUnsetBookmark() {
        var cfi = this.rendition.currentLocation().start.cfi;
        console.error('cfi', cfi);
        console.error('this.bookDTO.bookmarks', this.bookDTO.bookmarks);
        let filteredBookMarks = this.bookDTO.bookmarks.filter(bookMark => {
            bookMark.toLowerCase() === cfi.toLowerCase()
        });

        if (!this.bookmarkExists()) {
            this.isBookmarkSet = true;
            this.bookDTO.bookmarks.push(cfi);
        } else {
            this.bookDTO.bookmarks.splice(this.bookDTO.bookmarks.indexOf(filteredBookMarks[0]), 1);
            this.isBookmarkSet = false;
        }
    }

    private bookmarkExists() {
        var cfi = this.rendition.currentLocation().start.cfi;
        let filteredBookMarks = this.bookDTO.bookmarks.filter(bookMark => {
            bookMark.toLowerCase() === cfi.toLowerCase()
        });
        if (filteredBookMarks.length == 1) {
            return true;
        }
        return false;
    }

    public setBookmark() {
        var cfi = this.rendition.currentLocation().start.cfi;
        this.bookDTO.bookmarks.push(cfi);
        this.isBookmarkSet = true;
    }

    public unsetBookmark() {
        var cfi = this.rendition.currentLocation().start.cfi;
        this.bookDTO.bookmarks.splice(this.bookDTO.bookmarks.indexOf(cfi), 1);
        this.isBookmarkSet = false;
    }

}
