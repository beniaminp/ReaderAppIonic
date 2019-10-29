import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {BookDTO} from "../../dto/BookDTO";
import {EBookService, EPUB_EVENT_TYPES} from "../../services/e-book.service";
import {BookmarkDTO} from "../../dto/BookmarkDTO";
import {debug} from "util";
import {Storage} from "@ionic/storage";

@Component({
    selector: 'bookmarks-list',
    templateUrl: './bookmarks-list.component.html',
    styleUrls: ['./bookmarks-list.component.scss']
})
export class BookmarksListComponent implements OnInit {
    @Input()
    public bookDTO: BookDTO;

    public ePub;
    public bookmarksDTOList: BookmarkDTO[] = [];

    constructor(public modalController: ModalController,
                public ebookService: EBookService,
                public cdr: ChangeDetectorRef) {

    }

    ngOnInit(): void {
        this.initEventListeners();

    }

    dismissModal(data) {
        this.modalController.dismiss(data);
    }

    private initEventListeners() {
        this.ebookService.ePubEmitter.subscribe(
            (event) => {
                if (event.type == EPUB_EVENT_TYPES.EPUB) {
                    this.ePub = event.value;
                } else if (event.type == EPUB_EVENT_TYPES.BOOKMARKS_LOADED) {
                    this.bookmarksDTOList = event.value;
                    this.cdr.detectChanges();
                }
            }
        )
    }


    computePercentage(bookMark) {
        return this.ebookService.getPagePercentByCfi(this.ePub, bookMark);
    }
}
