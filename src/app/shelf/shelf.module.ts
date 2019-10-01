import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {NgxUploaderModule} from 'ngx-uploader';

import {IonicModule} from '@ionic/angular';

import {ShelfPage} from './shelf-page.component';
import {MyBooksMenuComponent} from './my-books-menu/my-books-menu.component';
import {UserSettingsComponent} from "./user-settings/user-settings.component";
import {BookPopoverComponent} from "./book-popover/book-popover.component";
import {SocialModule} from "../social/social.module";
import {ShareBookComponent} from "./share-book/share-book.component";

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
        NgxUploaderModule,
        SocialModule
    ],
    declarations: [
        ShelfPage,
        MyBooksMenuComponent,
        UserSettingsComponent,
        BookPopoverComponent,
        ShareBookComponent
    ],
    exports: [
        MyBooksMenuComponent,
        UserSettingsComponent,
        BookPopoverComponent,
        ShareBookComponent
    ],
    entryComponents: [
        UserSettingsComponent,
        BookPopoverComponent,
        ShareBookComponent
    ]
})
export class ShelfPageModule {
}
