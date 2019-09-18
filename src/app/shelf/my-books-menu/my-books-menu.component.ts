import {Component, OnInit} from '@angular/core';
import {MenuController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {BookDTO} from "../../ebook-reader/dto/bookDTO";
import {MenuEvents, MenuService} from "../../ebook-reader/services/menu.service";
import {ParseService} from "../../services/parse.service";
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
                public parseService: ParseService,
                public httpParseService: HttpParseService) {

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
        let books = [];
        this.storage.get("my-books").then((retBooks: BookDTO[]) => {
            books = retBooks != null ? retBooks : [];
            this.filesArray.forEach(file => {
                let reader = new FileReader();
                reader.onload = (e: any) => {
                    let book = new BookDTO();

                    book.bookContent = e.target.result;
                    book.fileName = file.name;
                    book.fileId = file.id;

                    let foundIndex = books.findIndex(book => book.fileName == file.fileName);
                    if (foundIndex == -1) {
                        books.push(book);
                    }
                    this.httpParseService.addBook(book).subscribe(
                        (success) => {
                            console.error(success);
                            this.menuService.menuEmitter.next({type: MenuEvents.BOOKS_ADDED, value: book});
                        }
                    );
                };

                reader.readAsArrayBuffer(file);
            });
            this.menuCtrl.toggle().then();
        });
    }


    ngOnInit() {
    }

}
