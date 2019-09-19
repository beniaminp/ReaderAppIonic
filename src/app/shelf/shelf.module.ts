import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {NgxUploaderModule} from 'ngx-uploader';

import {IonicModule} from '@ionic/angular';

import {ShelfPage} from './shelf-page.component';
import {MyBooksMenuComponent} from './my-books-menu/my-books-menu.component';
import {UserSettingsComponent} from "./user-settings/user-settings.component";

const routes: Routes = [
    {
        path: '',
        component: ShelfPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        NgxUploaderModule
    ],
    declarations: [
        ShelfPage,
        MyBooksMenuComponent,
        UserSettingsComponent
    ],
    exports: [
        MyBooksMenuComponent,
        UserSettingsComponent
    ],
    entryComponents: [
        UserSettingsComponent
    ]
})
export class ShelfPageModule {
}
