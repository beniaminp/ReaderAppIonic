import {AfterContentInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Storage} from "@ionic/storage";
import {MenuController, Platform, PopoverController} from "@ionic/angular";
import {MenuEvents, MenuService} from "../ebook-reader/services/menu.service";
import {BookDTO} from "../ebook-reader/dto/bookDTO";
import {HttpParseService} from "../services/http-parse.service";
import {AppStorageService} from "../services/app-storage.service";
import {UserDTO} from "../models/UserDTO";
import {UserSettingsComponent} from "./user-settings/user-settings.component";

declare var ePub: any;

@Component({
    selector: 'shelf-page',
    templateUrl: './shelf-page.component.html',
    styleUrls: ['./shelf-page.component.scss'],
})
export class ShelfPage implements OnInit {

    public books: BookDTO[];
    public favoritesBooks: string[] = [];

    constructor(
        private router: Router,
        public storage: Storage,
        public platform: Platform,
        public menuCtrl: MenuController,
        public menuService: MenuService,
        private route: ActivatedRoute,
        private httpParseService: HttpParseService,
        private appStorageService: AppStorageService,
        private popoverController: PopoverController) {
        this.initEventListeners();
    }

    ngOnInit(): void {
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
                this.getBooks();
            }
        );
    }

    public setFavorites(setFav: boolean, bookDTO: BookDTO) {
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                if (!setFav) {
                    this.favoritesBooks.slice(this.favoritesBooks.findIndex(objectId => objectId == bookDTO.objectId), 1);
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

    private enableMenu() {
        this.menuCtrl.enable(true, 'my-books-menu');
    }

    private getBooks() {
        this.httpParseService.getBooksForUser().subscribe(
            (res) => {
                this.books = res.sort((a, b) => a.fileName > b.fileName ? 1 : -1);
            }
        );
    }

    private initEventListeners() {
        this.menuService.menuEmitter.subscribe(
            (res) => {
                if (res.type == MenuEvents.BOOKS_ADDED) {
                    this.books.push(res.value);
                    this.httpParseService.addBook(res.value).subscribe();
                }
            }
        )
    }

}
