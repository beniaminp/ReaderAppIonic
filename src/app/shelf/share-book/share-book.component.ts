import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
import {BookDTO} from "../../ebook-reader/dto/BookDTO";

@Component({
    selector: 'app-share-book',
    templateUrl: './share-book.component.html',
    styleUrls: ['./share-book.component.scss'],
})
export class ShareBookComponent implements OnInit {
    private bookDTO: BookDTO;

    constructor(public modalController: ModalController,
                private navParams: NavParams) {
    }

    ngOnInit() {
        this.bookDTO = this.navParams.get('bookDTO');
    }

}
