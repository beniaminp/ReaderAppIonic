import {Component, OnInit} from '@angular/core';
import {EBookService} from "../services/e-book.service";
import {BookDTO} from "../dto/bookDTO";
import {BookmarksListComponent} from "./bookmarks-list/bookmarks-list.component";
import {ModalController} from "@ionic/angular";

@Component({
    selector: 'ebook-menu',
    templateUrl: './ebook-menu.component.html',
    styleUrls: ['./ebook-menu.component.scss']
})
export class EbookMenuComponent implements OnInit {
    private bookDTO: BookDTO;

    constructor(public ebookService: EBookService,
                public modalController: ModalController) {
    }

    ngOnInit() {
        this.ebookService.eBookEmitter.subscribe((eBook: BookDTO) => {
            this.bookDTO = eBook;
        })
    }

    async viewBookMarks() {
        let modalOptions = {
            component: BookmarksListComponent,
            componentProps: {'bookDTO': this.bookDTO},
            showBackdrop: true,
            backdropDismiss: true
        };
        const modal = await this.modalController.create(modalOptions);
        // console.error(this.bookDTO.bookmarks);
        await modal.present();
        let dataFromModal = await modal.onWillDismiss();
    }
}
