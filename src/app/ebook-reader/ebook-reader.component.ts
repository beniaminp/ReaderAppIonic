import {AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MenuController, Platform, PopoverController} from "@ionic/angular";
import {Storage} from '@ionic/storage';
import {BookDTO} from "./dto/BookDTO";
import {EBookService, EPUB_EVENT_TYPES} from "./services/e-book.service";
import {MenuService} from "./services/menu.service";
import {Router} from "@angular/router";
import {UserSettingsComponent} from "../shelf/user-settings/user-settings.component";
import {EbookPreferencesComponent} from "./ebook-preferences/ebook-preferences.component";
import {AppStorageService} from "../er-local-storage/app-storage.service";
import {LoadingService} from "../services/loading.service";
import {BookmarkDTO} from "./dto/BookmarkDTO";
import {HttpParseService} from "../services/http-parse.service";
import {UserDTO} from "../models/UserDTO";

declare var ePub: any;
declare var window: any;

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
                private httpParseService: HttpParseService,
                public appStorageService: AppStorageService) {
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
        this.book.open(this.ebookSource/*, {storage: true, store: 'epubs-store'}*/);
        this.rendition = this.book.renderTo("book", {
            manager: "continuous",
            flow: "paginated",
            width: '100%',
            height: this.platform.height() - 105,
            spread: 'always',
            resizeOnOrientationChange: true,
            snap: true
        });

        let displayed = this.rendition.display();
        /*displayed.then(
            (res) => {
                this.book.storage.add(this.book.resources, true).then(() => {
                    console.log("stored");
                });
            }
        );*/

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

            // this.setupBookStorage();

            this.ebookService.eBookEmitter.next(this.bookDTO);
            this.ebookService.ePubEmitter.next({type: EPUB_EVENT_TYPES.EPUB, value: this.book});
            this.book.locations.generate(1600);

            let userDTO = this.appStorageService.getUserDTO();

            this.setFontSize(userDTO.fontSize);
            this.setTextColor(userDTO.textColor);
            this.setBackgroundColor(userDTO.backgroundColor);
            this.setTextBold(userDTO.isBold);
            this.setTextItalic(userDTO.isItalic);

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

            window.on("swipeleft", (event) => {
                console.error('swipeleft');
                this.rendition.next();
            });

            window.on("swiperight", (event) => {
                console.error('swiperight');
                this.rendition.prev();
            });

        }).catch(e => this.loadingService.dismissLoader());
    }

    private setupBookStorage() {
        this.book.storage.on("online", () => {
            console.log("online");
        });
        this.book.storage.on("offline", () => {
            console.log("offline");
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

    private setUnsetBookmarkIcon() {
        this.isBookmarkSet = false;
        if (this.bookmarkExists()) {
            this.isBookmarkSet = true;
        }
    }

    private setFontSize(fontSize) {
        this.rendition.themes.fontSize(fontSize + '%');
    }

    private setTextColor(textColor) {
        this.rendition.themes.override('color', textColor, true);
    }

    private setBackgroundColor(backgroundColor) {
        this.rendition.themes.override('background-color', backgroundColor, true);
    }

    private setTextBold(isBold: boolean) {
        this.rendition.themes.override('font-weight', isBold ? 'bold' : 'normal', true);
    }

    private setTextItalic(isItalic: boolean) {
        this.rendition.themes.override('font-style', isItalic ? 'italic' : 'normal', true);
    }

    private initEventListeners() {
        this.ebookService.emitEpub(this.book);
        this.ebookService.ePubEmitter.subscribe(
            (event) => {
                switch (event.type) {
                    case EPUB_EVENT_TYPES.GO_TO_BOOKMARK: {
                        this.book.rendition.display(event.value);
                        this.menuController.toggle();
                        this.cdr.detectChanges();
                        break;
                    }
                    case EPUB_EVENT_TYPES.FONT_SIZE_CHANGED: {
                        this.httpParseService.updateFontSize(event.value).subscribe(
                            (res) => {
                                this.setFontSize(event.value);
                            }
                        );
                        break;
                    }
                    case EPUB_EVENT_TYPES.TEXT_COLOR_CHANGED: {
                        this.httpParseService.updateTextColor(event.value).subscribe(
                            (res) => {
                                this.setTextColor(event.value);
                            }
                        );
                        break;
                    }
                    case EPUB_EVENT_TYPES.BACKGROUND_COLOR_CHANGED: {
                        this.httpParseService.updateBackgroundColor(event.value).subscribe(
                            (res) => {
                                this.setBackgroundColor(event.value);
                            }
                        );
                        break;
                    }
                    case EPUB_EVENT_TYPES.TEXT_BOLD_CHANGED: {
                        this.httpParseService.updateTextBold(event.value).subscribe(
                            (res) => {
                                this.setTextBold(event.value);
                            }
                        );
                        break;
                    }
                    case EPUB_EVENT_TYPES.TEXT_ITALIC_CHANGED: {
                        this.httpParseService.updateTextItalic(event.value).subscribe(
                            (res) => {
                                this.setTextItalic(event.value);
                            }
                        );
                        break;
                    }
                    default: {
                        break;
                    }
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
