import {Component, OnInit} from '@angular/core';
import {EBookService, EPUB_EVENT_TYPES} from "../services/e-book.service";

@Component({
    selector: 'app-ebook-visual-settings',
    templateUrl: './ebook-visual-settings.component.html',
    styleUrls: ['./ebook-visual-settings.component.scss'],
})
export class EbookVisualSettingsComponent implements OnInit {
    private fontSize: number[] = [];

    constructor(private eBookService: EBookService) {
    }

    ngOnInit() {
        for (let i = 10; i < 200; i += 10) {
            this.fontSize.push(i);
        }
    }

    public selectionChanged(event) {
        let fontSizeSelected = event.detail.value;
        this.eBookService.ePubEmitter.next({type: EPUB_EVENT_TYPES.FONT_SIZE_CHANGED, value: fontSizeSelected});
    }

}
