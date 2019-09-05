import {AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MenuController, Platform} from "@ionic/angular";
import {Storage} from '@ionic/storage';
import {BookDTO} from "./dto/bookDTO";
import {EBookService} from "./services/e-book.service";
import {MenuService} from "./services/menu.service";

declare var ePub: any;

@Component({
    selector: 'app-ebook-reader',
    templateUrl: './ebook-reader.component.html',
    styleUrls: ['./ebook-reader.component.scss']
})
export class EbookReaderComponent implements OnInit, AfterViewInit, AfterContentInit {
    @Input('ebookSource')
    public ebookSource: any;

    public isBookmarkSet: boolean = false;

    private book: any;
    private rendition: any;
    private bookDTO: BookDTO;

    constructor(public platform: Platform,
                public storage: Storage,
                public cdr: ChangeDetectorRef,
                public menuController: MenuController,
                public ebookService: EBookService,
                public menuService: MenuService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.enableMenu();
    }

    ngAfterContentInit(): void {
        this.initBook();
        this.initEventListeners();
    }

    public move(where) {
        if (where == 0) {
            this.rendition.prev().then(res => this.setUnsetBookmarkIcon());
        } else {
            this.rendition.next().then((res) => this.setUnsetBookmarkIcon());
        }
    }

    public setUnsetBookmark() {
        var cfi = this.ebookService.getStartCfi(this.book);

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

    private enableMenu() {
        this.menuController.enable(true, 'ebook-menu');
    }

    private initBook() {
        if (this.ebookSource == null) {
            alert('No ebook selected');
        }
        this.book = ePub(this.ebookSource);
        this.rendition = this.book.renderTo("book", {
            width: '100%',
            height: this.platform.height() - 105,
            spread: 'always',
            resizeOnOrientationChange: true
        });

        this.rendition.display();

        this.bookReady();
    }

    private bookReady() {
        console.error(this.book);
        this.book.ready.then(() => {
            this.storage.get('books').then((res) => {
                if (res != null) {
                    this.getFromLocalStorage(res);
                } else {
                    this.addToLocalStorage();
                }
                this.ebookService.eBookEmitter.next(this.bookDTO);
            });
            this.book.locations.generate(1600);

            /*var keyListener = (e) => {
                this.getCoordinates(e);
                if (this.isBookmarkPress(e)) {
                    this.setUnsetBookmark();
                    return;
                }

                 if (e.clientX > this.platform.width() / 2) {
                     /!*this.book.package.metadata.direction === "rtl" ? this.rendition.next() : this.rendition.prev();*!/
                     console.error('in next');
                     this.rendition.next()
                 } else {
                     /!*this.book.package.metadata.direction === "rtl" ? this.rendition.prev() : this.rendition.next();*!/
                     console.error('in prev');
                     this.rendition.prev()
                 }

                this.isBookmarkSet = false;
                if (this.bookmarkExists()) {
                    this.isBookmarkSet = true;
                }
                 this.cdr.detectChanges();
            };

            this.rendition.on("click", keyListener);
            document.addEventListener("mouseup", keyListener, false)*/
        });
        console.error('this.book', this.book);
    }

    private addToLocalStorage() {
        this.bookDTO = new BookDTO();
        this.bookDTO.uniqueIdentifier = this.book.package.uniqueIdentifier;
        this.bookDTO.title = this.book.package.metadata.title;
        this.storage.set('books', JSON.stringify([this.bookDTO])).then();
    }

    private getFromLocalStorage(res) {
        let books: BookDTO[] = JSON.parse(res);
        let currentIndex = books
            .findIndex(book => book.uniqueIdentifier.toLowerCase() == this.book.package.uniqueIdentifier.toLowerCase());
        if (currentIndex > -1) {
            this.bookDTO = books[currentIndex];
        }
    }

    private bookmarkExists() {
        var cfi = this.rendition.currentLocation().start.cfi;
        if (this.bookDTO.bookmarks.indexOf(cfi.toString()) > -1) {
            return true;
        }
        return false;
    }

    private setUnsetBookmarkIcon() {
        this.isBookmarkSet = false;
        if (this.bookmarkExists()) {
            this.isBookmarkSet = true;
        }
    }

    private initEventListeners() {
        this.ebookService.emitEpub(this.book);
        this.ebookService.ePubEmitter.subscribe(
            (event) => {
                if (event.type == 0) {
                    this.book.locations.setCurrent(event.value);
                }
            }
        );
        this.menuService.menuEmitter.subscribe(
            (event) => {
                if (event == 0) {
                    this.cdr.detectChanges();
                }
            }
        )
    }

    // search in chapter book.currentChapter.find("Some Text to look for");
    // page number from cfi book.pagination.pageFromCfi(cfiGoesHere);
}
