import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Storage} from "@ionic/storage";
import {ParseService} from "./services/parse.service";
import {BookDTO} from "./ebook-reader/dto/bookDTO";
import {HttpParseService} from "./services/http-parse.service";
import {AppStorageService} from "./services/app-storage.service";
import {UserDTO} from "./models/UserDTO";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private nativeStorage: NativeStorage,
        private router: Router,
        public storage: Storage,
        public parseService: ParseService,
        private appStorageService: AppStorageService) {
        this.initializeApp();
    }

    initializeApp() {
        this.parseService.initializeParse();
        this.statusBar.styleDefault();

        this.platform.ready().then(() => {
            this.appStorageService.getUserDTO().then(
                (userDTO: UserDTO) => {
                    if (userDTO != null && userDTO.sessionToken != null) {
                        this.router.navigate(["/shelf"]);
                    } else {
                        this.router.navigate(["/auth"]);
                    }
                }
            );
        });
    }
}
