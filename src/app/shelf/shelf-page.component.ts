import {AfterContentInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Storage} from "@ionic/storage";
import {LoadingController, MenuController, Platform, PopoverController} from "@ionic/angular";
import {MenuEvents, MenuService} from "../ebook-reader/services/menu.service";
import {BookDTO} from "../ebook-reader/dto/BookDTO";
import {HttpParseService} from "../services/http-parse.service";
import {AppStorageService} from "../er-local-storage/app-storage.service";
import {UserDTO} from "../models/UserDTO";
import {UserSettingsComponent} from "./user-settings/user-settings.component";
import {LoadingService} from "../services/loading.service";
import {BookPopoverComponent} from "./book-popover/book-popover.component";
import {GenericHttpService} from "../services/generic-http.service";

declare var ePub: any;

@Component({
    selector: 'shelf-page',
    templateUrl: './shelf-page.component.html',
    styleUrls: ['./shelf-page.component.scss'],
})
export class ShelfPage implements OnInit {

    public books: BookDTO[];
    public filteredBooks: BookDTO[];
    public favoritesBooks: string[] = [];
    public showFavorites = false;
    public userDTO: UserDTO;
    public viewFreeBooks = false;

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

        let userDTO = this.appStorageService.getUserDTO();

        this.userDTO = userDTO;
        if (userDTO.lastReadBook && userDTO.goToLastRead) {
            this.httpParseService.getBookById(userDTO.lastReadBook).subscribe(
                (books: any) => {
                    let bookDTO: BookDTO = books[0];
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
                this.appStorageService.setBooks(this.books);
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
            this.filteredBooks = this.books;
        } else {
            this.filteredBooks = this.books.filter(book => book.fileName.toLowerCase().includes(searchedText.toLowerCase()));
        }
    }

    public searchInputChanged(event) {
        if (event.detail == null) {
            this.filteredBooks = this.books;
            return;
        }
        let searchedText = event.detail.data;
        if (searchedText) {
            if (searchedText.trim() == '') {
                this.filteredBooks = this.books;
            } else {
                this.filteredBooks = this.books.filter(book => book.fileName.toLowerCase().includes(searchedText.toLowerCase()));
            }
        }
    }

    public selectionChanged(event) {
        let showBooks = event.detail.value;
        if (showBooks == 0) {
            this.getBooks();
            this.showFavorites = false;
            this.viewFreeBooks = false;
        } else if (showBooks == 1) {
            this.filteredBooks = this.books.filter(book => this.favoritesBooks.includes(book.objectId));
            this.showFavorites = true;
            this.viewFreeBooks = false;
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
        this.appStorageService.deleteBook(bookDTO);
        this.books = this.appStorageService.getBooks();
        this.filteredBooks = this.books;
    }

    private enableMenu() {
        this.menuCtrl.enable(true, 'my-books-menu');
    }

    private async getBooks() {
        if (this.books != null && this.books.length > 1) {
            this.filteredBooks = this.books;
            return;
        }
        if (this.appStorageService.getBooks() != null) {
            this.books = this.appStorageService.getBooks();
            this.filteredBooks = this.books;
            return;
        }
        this.loadingService.showLoader();
        this.httpParseService.getBooksForUser().subscribe(
            (res) => {
                this.books = res.sort((a, b) => a.fileName > b.fileName ? 1 : -1);
                this.filteredBooks = this.books;
                this.loadingService.dismissLoader();
                /*this.books.forEach(
                    book => {
                        ePub(book.fileUrl).ready.then(
                            (resBook) => {
                                console.error(resBook);
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
                        this.appStorageService.addBook(res.value);
                        this.books = this.appStorageService.getBooks();
                        this.filteredBooks = this.books;
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
