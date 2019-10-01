import {Component, OnInit} from '@angular/core';
import {EBookService, EPUB_EVENT_TYPES} from "../services/e-book.service";
import {ModalController} from "@ionic/angular";
import {AppStorageService} from "../../er-local-storage/app-storage.service";
import {UserDTO} from "../../models/UserDTO";

@Component({
    selector: 'app-ebook-visual-settings',
    templateUrl: './ebook-visual-settings.component.html',
    styleUrls: ['./ebook-visual-settings.component.scss'],
})
export class EbookVisualSettingsComponent implements OnInit {
    private fontSize: number[] = [];
    public selectedFont = 100;
    public textColor = '#330000';
    public backgroundColor = 'white';
    public textBold: boolean;
    public textItalic: boolean;
    public themes = [{value: 'dark', name: 'Dark'}, {value: 'tan', name: 'Tan'}, {value: 'light', name: 'Light'}];
    public selectedTheme = 'light';

    constructor(private eBookService: EBookService,
                public modalController: ModalController,
                public appStorageService: AppStorageService) {
    }

    ngOnInit() {
        for (let i = 10; i <= 200; i += 10) {
            this.fontSize.push(i);
        }
        let userDTO = this.appStorageService.getUserDTO();

        this.selectedFont = userDTO.fontSize;
        this.textColor = userDTO.textColor != null ? userDTO.textColor : this.textColor;
        this.backgroundColor = userDTO.backgroundColor != null ? userDTO.backgroundColor : this.backgroundColor;
        this.textBold = userDTO.isBold;
        this.textItalic = userDTO.isItalic;
        this.selectedTheme = userDTO.theme;
    }

    public selectionChanged(event) {
        let fontSizeSelected = event.detail.value;
        this.eBookService.ePubEmitter.next({type: EPUB_EVENT_TYPES.FONT_SIZE_CHANGED, value: fontSizeSelected});
    }

    public textColorChanged(color: string) {
        this.textColor = color;
        this.eBookService.ePubEmitter.next({type: EPUB_EVENT_TYPES.TEXT_COLOR_CHANGED, value: color});
    }

    public backgroundColorChanged(color: string) {
        this.backgroundColor = color;
        this.eBookService.ePubEmitter.next({type: EPUB_EVENT_TYPES.BACKGROUND_COLOR_CHANGED, value: color});
    }

    public boldChanged(event) {
        this.textBold = event.detail.checked;
        this.eBookService.ePubEmitter.next({type: EPUB_EVENT_TYPES.TEXT_BOLD_CHANGED, value: this.textBold});
    }

    public italicChanged(event) {
        this.textItalic = event.detail.checked;
        this.eBookService.ePubEmitter.next({type: EPUB_EVENT_TYPES.TEXT_ITALIC_CHANGED, value: this.textBold});
    }

    public themeChanged(event) {
        this.selectedTheme = event.detail.value;
        this.eBookService.ePubEmitter.next({type: EPUB_EVENT_TYPES.THEME_CHANGED, value: this.selectedTheme});
    }
}
