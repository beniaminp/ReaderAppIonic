import {Component, OnInit} from '@angular/core';
import {AlertController, MenuController, ModalController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {BookDTO} from "../../ebook-reader/dto/BookDTO";
import {MenuEvents, MenuService} from "../../ebook-reader/services/menu.service";
import {HttpParseService} from "../../services/http-parse.service";
import {BookmarksListComponent} from "../../ebook-reader/ebook-menu/bookmarks-list/bookmarks-list.component";
import {PeopleComponent} from "../../social/people/people.component";
import {PendingConnectionsComponent} from "../../social/pending-connections/pending-connections.component";
import {UploadService} from "../../services/upload.service";
import {MyConnectionsComponent} from "../../social/my-connections/my-connections.component";

declare var ePub: any;

@Component({
    selector: 'app-my-books-menu',
    templateUrl: './my-books-menu.component.html',
    styleUrls: ['./my-books-menu.component.scss']
})
export class MyBooksMenuComponent implements OnInit {
    public filesArray = [];
    public options;

    constructor(public storage: Storage,
                public httpParseService: HttpParseService,
                public alertController: AlertController,
                public modalController: ModalController,
                private uploadService: UploadService) {

    }

    onUploadOutput(output): void {
        if (output.type == 'allAddedToQueue') {
            this.httpParseService.getBooksForUser().subscribe(
                (bookDTO: BookDTO[]) => {
                    this.filesArray.forEach(file => {
                        let foundedBook = this.bookExists(bookDTO, file.name);
                        if (foundedBook.length != 0) {
                            this.presentAlert(file.name).then();
                        } else {
                            this.uploadService.readFile(file);
                        }
                    });
                }
            );
        }
        if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
            this.filesArray.push(output.file.nativeFile);
        }
    }

    private bookExists(bookDTO: BookDTO[], fileName) {
        let foundedBook = bookDTO.filter(bookDTO => bookDTO.fileName.toLowerCase() == fileName.toLowerCase());
        return foundedBook;
    }

    async presentAlert(bookTitle) {
        const alert = await this.alertController.create({
            header: 'Book exists',
            message: 'This is book is already added ' + bookTitle,
            buttons: ['OK']
        });

        await alert.present();
    }

    ngOnInit() {
        this.options = {allowedContentTypes: ['application/epub+zip']}
    }

    public async openPeople() {
        try {
            const modal = await this.modalController.create({
                component: PeopleComponent,
                componentProps: {},
                showBackdrop: true,
                backdropDismiss: true
            });
            modal.present();
            const {data} = await modal.onWillDismiss();
        } catch (e) {
            console.error(e);
        }
    }

    public async openPendingInvites() {
        try {
            const modal = await this.modalController.create({
                component: PendingConnectionsComponent,
                componentProps: {},
                showBackdrop: true,
                backdropDismiss: true
            });
            modal.present();
            const {data} = await modal.onWillDismiss();
        } catch (e) {
            console.error(e);
        }
    }

    public async openMyConnections() {
        try {
            const modal = await this.modalController.create({
                component: MyConnectionsComponent,
                componentProps: {},
                showBackdrop: true,
                backdropDismiss: true
            });
            modal.present();
            const {data} = await modal.onWillDismiss();
        } catch (e) {
            console.error(e);
        }
    }
}
