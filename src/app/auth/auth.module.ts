import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SignUpPage} from "./sign-up/sign-up-page";
import {LoginComponent} from "./login/login.component";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'sign-up',
        component: SignUpPage
    },
    {
        path: 'login',
        component: LoginComponent
    }
];


@NgModule({
    declarations: [
        LoginComponent,
        SignUpPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)

    ]
})
export class AuthModule {
}
