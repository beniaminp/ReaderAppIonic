import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {EbookReaderComponent} from "./ebook-reader.component";
import {EbookMenuComponent} from './ebook-menu/ebook-menu.component';
import * as Hammer from 'hammerjs';
import {HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';

export class MyHammerConfig extends HammerGestureConfig {
    overrides = <any> {
        swipe: {direction: Hammer.DIRECTION_ALL},
    };
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        EbookReaderComponent,
        EbookMenuComponent,

    ],
    exports: [
        EbookReaderComponent,
        EbookMenuComponent,
    ],
    providers: [
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig,
        }
    ]
})
export class EbookReaderModule {
}
