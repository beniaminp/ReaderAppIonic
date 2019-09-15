import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {NgxUploaderModule} from 'ngx-uploader';

import {IonicModule} from '@ionic/angular';

import {LoginPage} from './login.page';
import {MyBooksMenuComponent} from './my-books-menu/my-books-menu.component';

const routes: Routes = [
    {
        path: '',
        component: LoginPage
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
    declarations: [LoginPage, MyBooksMenuComponent],
    exports: [
        MyBooksMenuComponent
    ]
})
export class LoginPageModule {
}
