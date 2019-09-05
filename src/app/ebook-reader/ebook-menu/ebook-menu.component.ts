import {Component, OnInit} from '@angular/core';
import {EBookService} from "../services/e-book.service";
import {BookDTO} from "../dto/bookDTO";
import {BookmarksListComponent} from "./bookmarks-list/bookmarks-list.component";
import {MenuController, ModalController} from "@ionic/angular";

@Component({
    selector: 'ebook-menu',
    templateUrl: './ebook-menu.component.html',
    styleUrls: ['./ebook-menu.component.scss']
})
export class EbookMenuComponent implements OnInit {
    private bookDTO: BookDTO;
    public ePub;
    public chapters;

    constructor(public ebookService: EBookService,
                public modalController: ModalController,
                public menuCtrl: MenuController) {
    }

    ngOnInit() {
        this.initEventListeners();
    }

    async viewBookMarks() {
        try {
            const modal = await this.modalController.create({
                component: BookmarksListComponent,
                componentProps: {'bookDTO': this.bookDTO, ePub: this.ePub},
                showBackdrop: true,
                backdropDismiss: true
            });
            modal.present();
            const {data} = await modal.onWillDismiss();
            if (data == null) {
                return;
            } else {
                this.goToBookMark(data);
            }
        } catch (e) {
            console.error(e);
        }
    }

    private initEventListeners() {
        this.ebookService.eBookEmitter.subscribe((eBook: BookDTO) => {
            this.bookDTO = eBook;
        });

        this.ebookService.ePubEmitter.subscribe(
            (event) => {
                if (event.type == 1) {
                    this.ePub = event.value;
                }
            }
        )
    }

    goToBookMark(bookmarkCFI){
        this.ePub.rendition.display(bookmarkCFI);
        this.menuCtrl.toggle();
    }

    goToChapter(chapter) {
        this.ePub.rendition.display(chapter.href);
        this.menuCtrl.toggle();
        console.error(chapter);
    }
}
