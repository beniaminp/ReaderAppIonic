import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {EbookReaderComponent} from "./ebook-reader.component";
import {EbookMenuComponent} from './ebook-menu/ebook-menu.component';
import {BookmarksListComponent} from './ebook-menu/bookmarks-list/bookmarks-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        EbookReaderComponent,
        EbookMenuComponent,
        BookmarksListComponent
    ],
    exports: [
        EbookReaderComponent,
        EbookMenuComponent,
        BookmarksListComponent
    ]
})
export class EbookReaderModule {
}
