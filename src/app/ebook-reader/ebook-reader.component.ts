import {AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MenuController, Platform, PopoverController} from "@ionic/angular";
import {Storage} from '@ionic/storage';
import {BookDTO} from "./dto/BookDTO";
import {EBookService, EPUB_EVENT_TYPES} from "./services/e-book.service";
import {MenuService} from "./services/menu.service";
import {Router} from "@angular/router";
import {UserSettingsComponent} from "../shelf/user-settings/user-settings.component";
import {EbookPreferencesComponent} from "./ebook-preferences/ebook-preferences.component";
import {AppStorageService} from "../services/app-storage.service";
import {LoadingService} from "../services/loading.service";
import {BookmarkDTO} from "./dto/BookmarkDTO";
import {HttpParseService} from "../services/http-parse.service";

declare var ePub: any;

@Component({
    selector: 'app-ebook-reader',
    templateUrl: './ebook-reader.component.html',
    styleUrls: ['./ebook-reader.component.scss']
})
export class EbookReaderComponent implements OnInit, AfterViewInit, AfterContentInit {
    @Input('ebookSource')
    public ebookSource: any;

    @Input('bookDTO')
    public bookDTO: BookDTO = new BookDTO();

    public isBookmarkSet: boolean = false;

    private book: any = ePub();
    private rendition: any;
    private bookMarks: BookmarkDTO[] = [];

    constructor(public platform: Platform,
                public storage: Storage,
                public cdr: ChangeDetectorRef,
                public menuController: MenuController,
                public ebookService: EBookService,
                public menuService: MenuService,
                private router: Router,
                private popoverController: PopoverController,
                private loadingService: LoadingService,
                private httpParseService: HttpParseService) {
    }

    ngOnInit() {
        this.loadingService.showLoader();
    }

    ngAfterViewInit(): void {
    }

    ngAfterContentInit(): void {
        this.initBook();
        this.initEventListeners();
    }

    private initBook() {
        if (this.ebookSource == null) {
            alert('No ebook selected');
        }
        this.book.open(this.ebookSource);
        this.rendition = this.book.renderTo("book", {
            width: '100%',
            height: this.platform.height() - 105,
            spread: 'always',
            resizeOnOrientationChange: true
        });

        this.rendition.display();

        this.getBookmarksList();

        this.bookReady();
    }

    private getBookmarksList() {
        this.httpParseService.getBookmarks(this.bookDTO).subscribe(
            (bookmarksDTOList: any) => {
                this.bookMarks = bookmarksDTOList.results;
                this.ebookService.ePubEmitter.next({type: EPUB_EVENT_TYPES.BOOKMARKS_LOADED, value: this.bookMarks});
            },
            error => console.error(error)
        )
    }

    private bookReady() {
        this.book.ready.then(() => {
            this.loadingService.dismissLoader();

            this.ebookService.eBookEmitter.next(this.bookDTO);
            this.ebookService.ePubEmitter.next({type: EPUB_EVENT_TYPES.EPUB, value: this.book});
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
    }

    public goBack() {
        this.router.navigate(['shelf']);
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

        if (!this.bookmarkExists()) {
            this.isBookmarkSet = true;
            let bookMarkDTO: BookmarkDTO = new BookmarkDTO();
            bookMarkDTO.cfi = cfi;
            bookMarkDTO.isDeleted = false;
            bookMarkDTO.bookId = this.bookDTO.objectId;
            bookMarkDTO.percentage = this.ebookService.getPagePercentByCfi(this.book, cfi);
            this.httpParseService.addBookmark(bookMarkDTO).subscribe(
                (res: any) => {
                    bookMarkDTO.objectId = res.objectId;
                    this.bookMarks.push(bookMarkDTO);
                }
            );
        } else {
            let indexOfBookmark = this.bookMarks.findIndex(bookMarkDTO => bookMarkDTO.cfi == cfi);
            let bookMarkToDelete = this.bookMarks[indexOfBookmark];
            console.error('index', indexOfBookmark);
            console.error('bookMarkToDelete', bookMarkToDelete);
            this.bookMarks.splice(indexOfBookmark, 1);
            this.isBookmarkSet = false;

            this.httpParseService.deleteBookMark(bookMarkToDelete).subscribe();
        }
        this.cdr.detectChanges();
    }

    private bookmarkExists() {
        let cfi = this.rendition.currentLocation().start.cfi;

        if (this.bookMarks.filter(bookMarksDTO => bookMarksDTO.cfi == cfi).length > 0) {
            return true;
        }
        return false;
    }

    public async presentPopover(ev) {
        const popover = await this.popoverController.create({
            component: EbookPreferencesComponent,
            event: ev,
            translucent: true
        });
        return await popover.present();
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
            .findIndex(book => book.uniqueIdentifier && book.uniqueIdentifier.toLowerCase()
                == this.book.package.uniqueIdentifier.toLowerCase());
        if (currentIndex > -1) {
            this.bookDTO = books[currentIndex];
        }
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
                if (event.type == EPUB_EVENT_TYPES.GO_TO_BOOKMARK) {
                    this.book.rendition.display(event.value);
                    this.menuController.toggle();
                    this.cdr.detectChanges();
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
    onSwipeLeft(event) {
        console.error(event);
    }
}
