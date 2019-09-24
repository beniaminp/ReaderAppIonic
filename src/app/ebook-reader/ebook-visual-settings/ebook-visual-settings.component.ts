import {Component, OnInit} from '@angular/core';
import {EBookService, EPUB_EVENT_TYPES} from "../services/e-book.service";
import {ModalController} from "@ionic/angular";
import {AppStorageService} from "../../services/app-storage.service";
import {UserDTO} from "../../models/UserDTO";

@Component({
    selector: 'app-ebook-visual-settings',
    templateUrl: './ebook-visual-settings.component.html',
    styleUrls: ['./ebook-visual-settings.component.scss'],
})
export class EbookVisualSettingsComponent implements OnInit {
    private fontSize: number[] = [];
    public selectedFont = 100;

    constructor(private eBookService: EBookService,
                public modalController: ModalController,
                public appStorageService: AppStorageService) {
    }

    ngOnInit() {
        for (let i = 10; i <= 200; i += 10) {
            this.fontSize.push(i);
        }
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                this.selectedFont = userDTO.fontSize;
            }
        )
    }

    public selectionChanged(event) {
        let fontSizeSelected = event.detail.value;
        this.eBookService.ePubEmitter.next({type: EPUB_EVENT_TYPES.FONT_SIZE_CHANGED, value: fontSizeSelected});
    }

}
