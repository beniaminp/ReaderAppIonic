import {AfterContentInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Storage} from "@ionic/storage";
import {MenuController, Platform} from "@ionic/angular";
import {MenuEvents, MenuService} from "../ebook-reader/services/menu.service";
import {BookDTO} from "../ebook-reader/dto/bookDTO";

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
        private route: ActivatedRoute) {
        this.initEventListeners();
    }

    ngOnInit(): void {
        this.storage.get("my-books").then(
            (books) => {
                this.books = books != null ? books : [];
            }
        );
        this.route.params.subscribe(params => {
            this.enableMenu();
        });
        this.enableMenu();
    }

    public openBook(book: BookDTO) {
        let navigationExtras: { state: { book: BookDTO } } = {
            state: {
                book
            }
        };
        this.router.navigate(['user'], navigationExtras);
    }

    private enableMenu() {
        this.menuCtrl.enable(true, 'my-books-menu');
    }

    private initEventListeners() {
        this.menuService.menuEmitter.subscribe(
            (res) => {
                if (res.type == MenuEvents.BOOKS_ADDED) {
                    this.books.push(res.value);
                    this.storage.set("my-books", this.books).then();
                }
            }
        )
    }
}
