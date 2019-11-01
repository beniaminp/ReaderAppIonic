import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
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
                public navParams: NavParams) {

    }

    ngOnInit(): void {
        this.bookmarksDTOList = this.navParams.get('bookmarksDTOList');
        this.bookmarksDTOList.sort((a, b) => Number(a.percentage) - Number(b.percentage));
        this.ePub = this.navParams.get('ePub');

    }

    dismissModal(data) {
        this.modalController.dismiss(data);
    }


    computePercentage(bookMark) {
        return this.ebookService.getPagePercentByCfi(this.ePub, bookMark);
    }
}
