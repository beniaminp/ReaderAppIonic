import {Component, OnInit} from '@angular/core';
import {MenuController, ModalController, NavParams, PopoverController} from "@ionic/angular";
import {BookDTO} from "../../ebook-reader/dto/BookDTO";
import {UserDTO} from "../../models/UserDTO";
import {HttpParseService} from "../../services/http-parse.service";
import {AppStorageService} from "../../er-local-storage/app-storage.service";
import {MenuEvents, MenuService} from "../../ebook-reader/services/menu.service";
import {BookmarksListComponent} from "../../ebook-reader/ebook-menu/bookmarks-list/bookmarks-list.component";
import {ShareBookComponent} from "../share-book/share-book.component";

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
                private popoverController: PopoverController,
                public modalController: ModalController) {
    }

    ngOnInit() {
        this.bookDTO = this.navParams.get('bookDTO');
        this.userDTO = this.appStorageService.getUserDTO();

        if (this.userDTO.favoritesBook != null) {
            this.favoritesBooks = this.userDTO.favoritesBook.split(",");
        }
    }

    public isFavoriteBook() {
        return this.favoritesBooks.indexOf(this.bookDTO.objectId) > -1;
    }

    public setFavorites(setFav: boolean) {

        if (!setFav) {
            let indexOfBook = this.favoritesBooks.findIndex(objectId => objectId == this.bookDTO.objectId);
            this.favoritesBooks.splice(indexOfBook, 1);
        } else {
            this.favoritesBooks.push(this.bookDTO.objectId);
        }
        this.userDTO.favoritesBook = this.favoritesBooks.join(",");

        this.httpParseService.updateFavoritesBooks(this.favoritesBooks, this.userDTO).subscribe(
            (res) => {
                this.menuService.menuEmitter.next({
                    type: MenuEvents.FAVORITES_CHANGED,
                    value: this.userDTO.favoritesBook
                });
                this.popoverController.dismiss();
            }
        );
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

    public async shareBook() {
        try {
            const modal = await this.modalController.create({
                component: ShareBookComponent,
                componentProps: {'bookDTO': this.bookDTO},
                showBackdrop: true,
                backdropDismiss: true
            });
            this.popoverController.dismiss();
            modal.present();
        } catch (e) {
            console.error(e);
        }
    }
}
