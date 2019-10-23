import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {Facebook} from '@ionic-native/facebook/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {IonicStorageModule} from "@ionic/storage";
import {EbookReaderModule} from "./ebook-reader/ebook-reader.module";
import {BookmarksListComponent} from "./ebook-reader/ebook-menu/bookmarks-list/bookmarks-list.component";
import {File} from "@ionic-native/file/ngx";
import {FileChooser} from "@ionic-native/file-chooser/ngx";
import {ShelfPageModule} from "./shelf/shelf.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ServiceWorkerModule} from '@angular/service-worker';
import {ErLocalStorageModule} from "./er-local-storage/er-local-storage.module";
import {TokenInterceptorService} from "./services/token-interceptor.service";

@NgModule({
    declarations: [AppComponent, BookmarksListComponent],
    entryComponents: [BookmarksListComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot(),
        EbookReaderModule,
        ShelfPageModule,
        HttpClientModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: true}),
        ErLocalStorageModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        NativeStorage,
        Facebook,
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        File,
        FileChooser
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
