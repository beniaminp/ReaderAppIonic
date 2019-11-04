import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
import {BookDTO} from "../../ebook-reader/dto/BookDTO";
import {ConnectionDTO} from "../../models/ConnectionDTO";
import {UserDTO} from "../../models/UserDTO";
import {AppStorageService} from "../../er-local-storage/app-storage.service";
import {HttpParseService} from "../../services/http-parse.service";

@Component({
    selector: 'app-share-book',
    templateUrl: './share-book.component.html',
    styleUrls: ['./share-book.component.scss'],
})
export class ShareBookComponent implements OnInit {
    private bookDTO: BookDTO;
    public connections: UserDTO[];
    public isOkToRender = false;
    public userDTO: UserDTO;

    constructor(public modalController: ModalController,
                private navParams: NavParams,
                public appStorageService: AppStorageService,
                public httpParseService: HttpParseService) {
    }

    ngOnInit() {
        this.connections = this.appStorageService.getUserConnections();
        this.isOkToRender = true;
    }

    public dismissModal() {
        this.modalController.dismiss();
    }

    public shareWithUser(user: UserDTO) {
        this.httpParseService.shareWithUser(user, this.bookDTO).subscribe(
            (res) => {

            }, (e) => console.error(e)
        );
    }
}
