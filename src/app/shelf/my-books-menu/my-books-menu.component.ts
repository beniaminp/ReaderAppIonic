import {Component, OnInit} from '@angular/core';
import {AlertController, MenuController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {BookDTO} from "../../ebook-reader/dto/bookDTO";
import {MenuEvents, MenuService} from "../../ebook-reader/services/menu.service";
import {HttpParseService} from "../../services/http-parse.service";

declare var ePub: any;

@Component({
    selector: 'app-my-books-menu',
    templateUrl: './my-books-menu.component.html',
    styleUrls: ['./my-books-menu.component.scss']
})
export class MyBooksMenuComponent implements OnInit {
    public filesArray = [];

    constructor(public menuCtrl: MenuController,
                public storage: Storage,
                public menuService: MenuService,
                public httpParseService: HttpParseService,
                public alertController: AlertController) {

    }


    onUploadOutput(output): void {
        if (output.type == 'allAddedToQueue') {
            this.readAllFiles();
        }
        if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
            this.filesArray.push(output.file.nativeFile);
        }
    }

    public readAllFiles() {
        this.httpParseService.getBooksForUser().subscribe(
            (bookDTO: BookDTO[]) => {

                this.filesArray.forEach(file => {
                    let reader = new FileReader();
                    reader.onload = (e: any) => {
                        let book = new BookDTO();

                        book.bookContent = e.target.result;
                        book.fileName = file.name;
                        book.fileId = file.id;

                        let foundedBook = bookDTO.filter(bookDTO => bookDTO.fileName.toLowerCase() == book.fileName.toLowerCase());
                        if (foundedBook.length == 0) {
                            this.httpParseService.addBook(book).subscribe(
                                () => {
                                    this.menuService.menuEmitter.next({type: MenuEvents.BOOKS_ADDED, value: book});
                                }
                            );
                        } else {
                            this.presentAlert(book.fileName).then();
                        }
                    };

                    reader.readAsArrayBuffer(file);
                });
                this.menuCtrl.toggle().then();
            }
        );
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
    }

}
