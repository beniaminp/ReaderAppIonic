import {AfterContentInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Storage} from "@ionic/storage";
import {MenuController, Platform} from "@ionic/angular";
import {MenuEvents, MenuService} from "../ebook-reader/services/menu.service";
import {BookDTO} from "../ebook-reader/dto/bookDTO";
import {HttpParseService} from "../services/http-parse.service";
import {AppStorageService} from "../services/app-storage.service";
import {UserDTO} from "../models/UserDTO";

declare var ePub: any;

@Component({
    selector: 'shelf-page',
    templateUrl: './shelf-page.component.html',
    styleUrls: ['./shelf-page.component.scss'],
})
export class ShelfPage implements OnInit {

    public books: BookDTO[];

    constructor(
        private router: Router,
        public storage: Storage,
        public platform: Platform,
        public menuCtrl: MenuController,
        public menuService: MenuService,
        private route: ActivatedRoute,
        private httpParseService: HttpParseService,
        private appStorageService: AppStorageService) {
        this.initEventListeners();
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.enableMenu();
            this.getBooks();
        });

        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                if (userDTO.lastReadBook) {
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
            }
        )
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

    private enableMenu() {
        this.menuCtrl.enable(true, 'my-books-menu');
    }

    private getBooks() {
        this.httpParseService.getBooksForUser().subscribe(
            (res) => {
                this.books = res;
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
