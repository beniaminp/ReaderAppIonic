import {AfterContentInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Storage} from "@ionic/storage";
import {LoadingController, MenuController, Platform, PopoverController} from "@ionic/angular";
import {MenuEvents, MenuService} from "../ebook-reader/services/menu.service";
import {BookDTO} from "../ebook-reader/dto/bookDTO";
import {HttpParseService} from "../services/http-parse.service";
import {AppStorageService} from "../services/app-storage.service";
import {UserDTO} from "../models/UserDTO";
import {UserSettingsComponent} from "./user-settings/user-settings.component";
import {LoadingService} from "../services/loading.service";

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

    public deleteBook(book: BookDTO) {
        this.httpParseService.deleteBook(book).subscribe(
            (res) => {
                this.deleteBookLocal(book);
            }
        );
    }

    public setFavorites(setFav: boolean, bookDTO: BookDTO) {
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                if (!setFav) {
                    let indexOfBook = this.favoritesBooks.findIndex(objectId => objectId == bookDTO.objectId);
                    this.favoritesBooks.splice(indexOfBook, 1);
                } else {
                    this.favoritesBooks.push(bookDTO.objectId);
                }
                userDTO.favoritesBook = this.favoritesBooks.join(",");
                this.httpParseService.updateFavoritesBooks(this.favoritesBooks, userDTO).subscribe();
            }
        ).catch(e => console.error(e))
    }

    public isFavoriteBook(bookDTO: BookDTO) {
        return this.favoritesBooks.indexOf(bookDTO.objectId) > -1;
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
                    case MenuEvents.SHOW_FAVORITES: {
                        this.books = this.books.filter(book => this.favoritesBooks.includes(book.objectId));
                        this.showFavorites = true;
                        break;
                    }
                    case MenuEvents.SHOW_ALL: {
                        this.getBooks();
                        this.showFavorites = false;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        )
    }

    searchChanged(event) {
        let searchedText = event.detail.value;
        if (searchedText.trim() == '') {
            this.getBooks();
        } else {
            this.books = this.books.filter(book => book.fileName.toLowerCase().includes(searchedText));
        }
    }
}
