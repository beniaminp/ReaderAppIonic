import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ColorChooserComponent} from "./color-chooser/color-chooser.component";
import {IonicModule} from "@ionic/angular";


@NgModule({
    declarations: [
        ColorChooserComponent
    ],
    imports: [
        IonicModule,
        CommonModule
    ],
    exports: [
        ColorChooserComponent
    ]
})
export class SharedModule {
}
