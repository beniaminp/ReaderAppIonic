import {AfterContentInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Storage} from "@ionic/storage";
import {LoadingController, MenuController, Platform, PopoverController} from "@ionic/angular";
import {MenuEvents, MenuService} from "../ebook-reader/services/menu.service";
import {BookDTO} from "../ebook-reader/dto/BookDTO";
import {HttpParseService} from "../services/http-parse.service";
import {AppStorageService} from "../services/app-storage.service";
import {UserDTO} from "../models/UserDTO";
import {UserSettingsComponent} from "./user-settings/user-settings.component";
import {LoadingService} from "../services/loading.service";
import {BookPopoverComponent} from "./book-popover/book-popover.component";

declare var ePub: any;

@Component({
    selector: 'shelf-page',
    templateUrl: './shelf-page.component.html',
    styleUrls: ['./shelf-page.component.scss'],
})
export class ShelfPage implements OnInit {

    public books: BookDTO[];
    public favoritesBooks: string[] = [];
    public showFavorites = false;
    public userDTO: UserDTO;

    constructor(
        private router: Router,
        public storage: Storage,
        public platform: Platform,
        public menuCtrl: MenuController,
        public menuService: MenuService,
        private route: ActivatedRoute,
        private httpParseService: HttpParseService,
        private appStorageService: AppStorageService,
        private popoverController: PopoverController,
        private loadingService: LoadingService) {
        this.initEventListeners();
    }

    async ngOnInit() {
        this.route.params.subscribe(params => {
            this.enableMenu();
            this.getBooks();
        });

        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                this.userDTO = userDTO;
                if (userDTO.lastReadBook && userDTO.goToLastRead) {
                    this.httpParseService.getBookById(userDTO.lastReadBook).subscribe(
                        (books: any) => {
                            let bookDTO: BookDTO = books.results[0];
                            this.openBook(bookDTO);
                        }
                    )
                } else {
                    this.getBooks();
                    this.enableMenu();
                }
                if (userDTO.favoritesBook != null) {
                    this.favoritesBooks = userDTO.favoritesBook.split(",");
                }
            }
        );
    }

    public openBook(book: BookDTO) {
        let navigationExtras: { state: { book: BookDTO } } = {
            state: {
                book
            }
        };
        this.router.navigate(['reader'], navigationExtras);
    }

    public doRefresh(event) {
        this.httpParseService.getBooksForUser().subscribe(
            (res) => {
                this.books = res.sort((a, b) => a.fileName > b.fileName ? 1 : -1);
                event.target.complete();
            }
        );
    }

    public async presentPopover(ev) {
        const popover = await this.popoverController.create({
            component: UserSettingsComponent,
            event: ev,
            translucent: true
        });
        return await popover.present();
    }

    public searchChanged(event) {
        let searchedText = event.detail.value;
        if (searchedText.trim() == '') {
            this.getBooks();
        } else {
            this.books = this.books.filter(book => book.fileName.toLowerCase().includes(searchedText));
        }
    }

    public searchInputChanged(event) {
        let searchedText = event.detail.data;
        if (searchedText) {
            if (searchedText.trim() == '') {
                this.getBooks();
            } else {
                this.books = this.books.filter(book => book.fileName.toLowerCase().includes(searchedText));
            }
        }
    }

    public selectionChanged(event) {
        let showBooks = event.detail.value;
        if (showBooks == 0) {
            this.getBooks();
            this.showFavorites = false;
        } else if (showBooks == 1) {
            this.books = this.books.filter(book => this.favoritesBooks.includes(book.objectId));
            this.showFavorites = true;
        }
    }

    public async showBookPopover(event, bookDTO: BookDTO) {
        const popover = await this.popoverController.create({
            component: BookPopoverComponent,
            componentProps: {bookDTO, userDTO: this.userDTO},
            event: event,
            translucent: true
        });
        return await popover.present();
    }

    private deleteBookLocal(bookDTO: BookDTO) {
        this.books.splice(this.books.indexOf(bookDTO), 1);
    }

    private enableMenu() {
        this.menuCtrl.enable(true, 'my-books-menu');
    }

    private async getBooks() {
        this.loadingService.showLoader();
        this.httpParseService.getBooksForUser().subscribe(
            (res) => {
                this.books = res.sort((a, b) => a.fileName > b.fileName ? 1 : -1);
                this.loadingService.dismissLoader();
                /*this.books.forEach(
                    book => {
                        ePub(book.fileUrl).ready.then(
                            (res) => {
                                console.error(res);
                            }
                        )

                    }
                )*/
            },
            (e) => {
                console.error(e);
                this.loadingService.dismissLoader();
            }
        );
    }

    private initEventListeners() {
        this.menuService.menuEmitter.subscribe(
            (res) => {
                switch (res.type) {
                    case MenuEvents.BOOKS_ADDED: {
                        this.books.push(res.value);
                        break;
                    }
                    case MenuEvents.FAVORITES_CHANGED: {
                        this.favoritesBooks = res.value;
                        break;
                    }
                    case MenuEvents.BOOK_DELETED: {
                        this.deleteBookLocal(res.value);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        )
    }
}
