import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {BookDTO} from "../../dto/bookDTO";

@Component({
    selector: 'bookmarks-list',
    templateUrl: './bookmarks-list.component.html',
    styleUrls: ['./bookmarks-list.component.scss']
})
export class BookmarksListComponent implements OnInit {
    @Input()
    public bookDTO: BookDTO;

    constructor(public modalController: ModalController) {

    }

    ngOnInit(): void {

    }

    dismissModal(data){
        this.modalController.dismiss(data);
    }


}
