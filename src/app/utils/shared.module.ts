import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ColorChooserComponent} from "./color-chooser/color-chooser.component";
import {IonicModule} from "@ionic/angular";
import {ColorPalleteComponent} from "./color-chooser/color-pallete/color-pallete.component";


@NgModule({
    declarations: [
        ColorChooserComponent,
        ColorPalleteComponent
    ],
    imports: [
        IonicModule,
        CommonModule
    ],
    exports: [
        ColorChooserComponent,
        ColorPalleteComponent
    ],
    entryComponents: [
        ColorPalleteComponent
    ]
})
export class SharedModule {
}
