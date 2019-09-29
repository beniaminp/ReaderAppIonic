import {Injectable} from '@angular/core';
import {HttpParseService} from "./http-parse.service";
import {BookDTO} from "../ebook-reader/dto/BookDTO";
import {MenuEvents, MenuService} from "../ebook-reader/services/menu.service";
import {AlertController, MenuController, ToastController} from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    constructor(public httpParseService: HttpParseService,
                public menuService: MenuService,
                public alertController: AlertController,
                public menuCtrl: MenuController,
                public toastController: ToastController) {
    }

    public async readFile(file) {
        this.presentToast('Start uploading ' + file.name + '...');
        let reader = new FileReader();
        reader.onload = (e: any) => {
            let book = new BookDTO();

            book.bookContent = e.target.result;
            book.fileName = file.name;
            book.fileId = file.id;
            this.httpParseService.addBook(book).subscribe(
                (res) => {
                    book.objectId = res.objectId;
                    this.menuService.menuEmitter.next({type: MenuEvents.BOOKS_ADDED, value: book});
                    this.presentToast('File ' + file.name + ' uploaded');
                }
            );

        };
        reader.readAsArrayBuffer(file);
        this.menuCtrl.toggle().then();
    }

    async presentToast(message) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }
}
