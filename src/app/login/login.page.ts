import {AfterContentInit, Component, OnInit} from '@angular/core';
import {DirectoryEntry, Entry, File} from '@ionic-native/file/ngx';
import {FileChooser} from "@ionic-native/file-chooser/ngx";
import {NavigationExtras, Router} from "@angular/router";
import {Storage} from "@ionic/storage";
import {MenuController, Platform} from "@ionic/angular";
import {MenuEvents, MenuService} from "../ebook-reader/services/menu.service";
import {BookDTO} from "../ebook-reader/dto/bookDTO";

declare var ePub: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements AfterContentInit, OnInit {

    public files: BookDTO[];

    constructor(
        private router: Router,
        public storage: Storage,
        public platform: Platform,
        public menuCtrl: MenuController,
        public menuService: MenuService) {
        this.initEventListeners();
    }


    ngAfterContentInit(): void {
        this.platform.ready().then(
            (pltReady) => {
            }
        );
    }

    ngOnInit(): void {
        this.storage.get("my-books").then(
            (books) => {
                this.files = books;
            }
        );
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
                    this.storage.get("my-books").then(
                        (books) => {
                            this.files = books;
                        }
                    )
                }
            }
        )
    }
}
