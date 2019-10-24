import {Component, OnInit} from '@angular/core';
import {EBookService, EPUB_EVENT_TYPES} from "../services/e-book.service";
import {HttpParseService} from "../../services/http-parse.service";
import {AppStorageService} from "../../er-local-storage/app-storage.service";
import {ModalController} from "@ionic/angular";

@Component({
    selector: 'app-ebook-control-settings',
    templateUrl: './ebook-control-settings.component.html',
    styleUrls: ['./ebook-control-settings.component.scss'],
})
export class EbookControlSettingsComponent implements OnInit {
    public showNavigationControls: boolean = this.appStorageService.getUserDTO().showNavigationControl;

    constructor(private eBookService: EBookService,
                public appStorageService: AppStorageService,
                public modalController: ModalController) {
    }

    ngOnInit() {
    }

    dismissModal(data) {
        this.modalController.dismiss(data);
    }

    navigationControlChanged(event) {
        this.showNavigationControls = event.detail.checked;
        this.eBookService.ePubEmitter.next({
            type: EPUB_EVENT_TYPES.NAVIGATION_CONTROL_CHANGED,
            value: this.showNavigationControls
        });
    }
}
