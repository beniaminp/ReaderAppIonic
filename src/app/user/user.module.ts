import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {UserPage} from './user.page';
import {EbookReaderModule} from "../ebook-reader/ebook-reader.module";

const routes: Routes = [
    {
        path: '',
        component: UserPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EbookReaderModule,
        RouterModule.forChild(routes)
    ],
    declarations: [UserPage]
})
export class UserPageModule {
}
