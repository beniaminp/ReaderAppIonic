import {Component, OnInit} from '@angular/core';
import {MenuController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {BookDTO} from "../../ebook-reader/dto/bookDTO";
import {MenuEvents, MenuService} from "../../ebook-reader/services/menu.service";

declare var ePub: any;

@Component({
    selector: 'app-my-books-menu',
    templateUrl: './my-books-menu.component.html',
    styleUrls: ['./my-books-menu.component.scss']
})
export class MyBooksMenuComponent implements OnInit {

    constructor(public menuCtrl: MenuController,
                public storage: Storage,
                public menuService: MenuService) {

    }


    onUploadOutput(output): void {
        if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
            const file = output.file.nativeFile;
            console.error(output);
            const reader = new FileReader();
            reader.onload = (e: any) => {
                let book = new BookDTO();

                book.bookContent = e.target.result;
                book.fileName = file.name;
                book.fileId = file.id;

                this.storage.get("my-books").then(
                    (books: BookDTO[]) => {
                        if (books) {
                            let foundIndex = books.findIndex(book => book.fileName == file.fileName);
                            if (foundIndex == -1) {
                                books.push(book);
                            }
                            this.storage.set('my-books', books).then();
                            this.menuCtrl.toggle();
                        } else {
                            this.storage.set('my-books', [book]).then();
                            this.menuCtrl.toggle();
                        }
                    }
                );
                this.menuService.menuEmitter.next({type: MenuEvents.BOOKS_ADDED})
            };
            reader.readAsArrayBuffer(file);
        }
    }


    ngOnInit() {
    }

}
