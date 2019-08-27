import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {EbookReaderComponent} from "./ebook-reader.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        EbookReaderComponent
    ],
    exports: [
        EbookReaderComponent
    ]
})
export class EbookReaderModule {
}
