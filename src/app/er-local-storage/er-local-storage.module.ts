import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocalStorageModule} from "angular-2-local-storage";
import {AppStorageService} from "./app-storage.service";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LocalStorageModule.forRoot({
            prefix: 'er',
            storageType: 'localStorage'
        }),
    ],
    providers: [
        AppStorageService
    ]
})
export class ErLocalStorageModule {
}
