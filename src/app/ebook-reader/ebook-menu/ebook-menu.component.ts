import {Component, OnInit} from '@angular/core';
import {EBookService, EPUB_EVENT_TYPES} from "../services/e-book.service";
import {BookDTO} from "../dto/BookDTO";
import {BookmarksListComponent} from "./bookmarks-list/bookmarks-list.component";
import {MenuController, ModalController} from "@ionic/angular";
import {MenuService} from "../services/menu.service";

@Component({
    selector: 'ebook-menu',
    templateUrl: './ebook-menu.component.html',
    styleUrls: ['./ebook-menu.component.scss']
})
export class EbookMenuComponent implements OnInit {
    public bookDTO: BookDTO;
    public ePub;
    public chapters;

    constructor(public ebookService: EBookService,
                public modalController: ModalController,
                public menuCtrl: MenuController,
                public menuService: MenuService) {
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

    goToBookMark(bookmarkCFI) {
        this.ebookService.ePubEmitter.next({type: EPUB_EVENT_TYPES.GO_TO_BOOKMARK, value: bookmarkCFI});
    }

    goToChapter(chapter) {
        this.ePub.rendition.display(chapter.href);
        this.menuService.menuEmitter.next(0);
        this.menuCtrl.toggle();
    }

    private initEventListeners() {
        this.ebookService.eBookEmitter.subscribe((eBook: BookDTO) => {
            this.bookDTO = eBook;
        });

        this.ebookService.ePubEmitter.subscribe(
            (event) => {
                if (event.type == EPUB_EVENT_TYPES.EPUB) {
                    this.ePub = event.value;
                }
            }
        )
    }
}
