import {Component, OnInit} from '@angular/core';
import {MenuController, NavParams, PopoverController} from "@ionic/angular";
import {BookDTO} from "../../ebook-reader/dto/bookDTO";
import {UserDTO} from "../../models/UserDTO";
import {HttpParseService} from "../../services/http-parse.service";
import {AppStorageService} from "../../services/app-storage.service";
import {MenuEvents, MenuService} from "../../ebook-reader/services/menu.service";

@Component({
    selector: 'app-book-popover',
    templateUrl: './book-popover.component.html',
    styleUrls: ['./book-popover.component.scss'],
})
export class BookPopoverComponent implements OnInit {
    public bookDTO: BookDTO;
    public userDTO: UserDTO;

    public favoritesBooks: string[] = [];

    constructor(private navParams: NavParams,
                private appStorageService: AppStorageService,
                private httpParseService: HttpParseService,
                public menuService: MenuService,
                private popoverController: PopoverController) {
    }

    ngOnInit() {
        this.bookDTO = this.navParams.get('bookDTO');

        this.appStorageService.getUserDTO().then(
            (user: UserDTO) => {
                this.userDTO = user;

                if (this.userDTO.favoritesBook != null) {
                    this.favoritesBooks = this.userDTO.favoritesBook.split(",");
                }
            }
        );
    }

    public isFavoriteBook() {
        return this.favoritesBooks.indexOf(this.bookDTO.objectId) > -1;
    }

    public setFavorites(setFav: boolean) {
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                if (!setFav) {
                    let indexOfBook = this.favoritesBooks.findIndex(objectId => objectId == this.bookDTO.objectId);
                    this.favoritesBooks.splice(indexOfBook, 1);
                } else {
                    this.favoritesBooks.push(this.bookDTO.objectId);
                }
                userDTO.favoritesBook = this.favoritesBooks.join(",");

                this.httpParseService.updateFavoritesBooks(this.favoritesBooks, userDTO).subscribe(
                    (res) => {
                        this.menuService.menuEmitter.next({
                            type: MenuEvents.FAVORITES_CHANGED,
                            value: userDTO.favoritesBook
                        });
                        this.popoverController.dismiss();
                    }
                );
            }
        ).catch(e => console.error(e))
    }


    public deleteBook() {
        this.httpParseService.deleteBook(this.bookDTO).subscribe(
            (res) => {
                this.menuService.menuEmitter.next({
                    type: MenuEvents.BOOK_DELETED,
                    value: this.bookDTO
                });
                this.popoverController.dismiss();
            }
        );
    }

}
