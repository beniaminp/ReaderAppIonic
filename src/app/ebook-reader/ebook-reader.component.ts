import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
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
                public storage: Storage,
                public renderer2: Renderer2,
                public cdr: ChangeDetectorRef) {
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
                    let currentIndex = books
                        .findIndex(book => book.uniqueIdentifier.toLowerCase() == this.book.package.uniqueIdentifier.toLowerCase());
                    if (currentIndex > -1) {
                        this.bookDTO = books[currentIndex];
                    }
                    else {
                        this.bookDTO = new BookDTO();
                        this.bookDTO.uniqueIdentifier = this.book.package.uniqueIdentifier;
                        books.push(this.bookDTO);
                        this.storage.set('books', JSON.stringify(books)).then();
                    }
                } else {
                    this.bookDTO = new BookDTO();
                    this.bookDTO.uniqueIdentifier = this.book.package.uniqueIdentifier;
                    this.storage.set('books', JSON.stringify([this.bookDTO])).then();
                }
            });

            var keyListener = (e) => {
                this.getCoordinates(e);
                if (this.isBookmarkPress(e)) {
                    this.setUnsetBookmark();
                    return;
                }

                if (e.clientX > this.platform.width() / 2) {
                    /*this.book.package.metadata.direction === "rtl" ? this.rendition.next() : this.rendition.prev();
                    console.error('in next');*/
                    this.rendition.next()
                } else {
                    /*this.book.package.metadata.direction === "rtl" ? this.rendition.prev() : this.rendition.next();
                    console.error('in prev');*/
                    this.rendition.prev()
                }

                this.isBookmarkSet = false;
                if (this.bookmarkExists()) {
                    this.isBookmarkSet = true;
                }
                this.cdr.detectChanges();
            };

            this.rendition.on("click", keyListener);
            document.addEventListener("mouseup", keyListener, false)
        });
    }

    public isBookmarkPress(clickEvent) {
        if (clickEvent.clientY < 70
            && clickEvent.clientX > this.platform.width() - 70) {
            return true;
        }
        return false;
    }

    public setUnsetBookmark() {
        var cfi = this.rendition.currentLocation().start.cfi;

        let cfiIndex = this.bookDTO.bookmarks.indexOf(cfi);

        if (!this.bookmarkExists()) {
            this.isBookmarkSet = true;
            this.bookDTO.bookmarks.push(cfi);
        } else {
            this.bookDTO.bookmarks.splice(cfiIndex, 1);
            this.isBookmarkSet = false;
        }
        this.cdr.detectChanges();
        this.storage.set('books', JSON.stringify([this.bookDTO])).then();
    }

    private bookmarkExists() {
        var cfi = this.rendition.currentLocation().start.cfi;
        if (this.bookDTO.bookmarks.indexOf(cfi.toString()) > -1) {
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

    public getCoordinates(event) {
        console.log('this.platform.width()', this.platform.width());
        console.log(event);
        console.log(event.clientX);
        console.log(event.clientY);
    }


}
