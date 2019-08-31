import {Component, OnInit} from '@angular/core';
import {EBookService} from "../services/e-book.service";
import {BookDTO} from "../dto/bookDTO";

@Component({
    selector: 'ebook-menu',
    templateUrl: './ebook-menu.component.html',
    styleUrls: ['./ebook-menu.component.scss']
})
export class EbookMenuComponent implements OnInit {
    private bookDTO: BookDTO;

    constructor(public ebookService: EBookService) {
    }

    ngOnInit() {
        this.ebookService.eBookEmitter.subscribe((eBook: BookDTO) => {
            this.bookDTO = eBook;
        })
    }

    viewBookMarks() {
        console.error(this.bookDTO.bookmarks);
    }
}
