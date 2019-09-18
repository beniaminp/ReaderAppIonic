import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Storage} from "@ionic/storage";
import {ParseService} from "./services/parse.service";
import {BookDTO} from "./ebook-reader/dto/bookDTO";

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
        public parseService: ParseService) {
        this.initializeApp();
    }

    initializeApp() {
        this.parseService.initializeParse();
        this.statusBar.styleDefault();

        this.platform.ready().then(() => {
            if (this.parseService.getCurrentUser() != null) {
                this.storage.get("my-books").then(
                    (books: any[]) => {
                        if (!books) {
                            books = [];
                        }
                        this.parseService.getBooksForUser()
                            .then((parseBooks) => {
                                if (parseBooks) {
                                    parseBooks.forEach(book => {
                                        let bookDTO = new BookDTO();
                                        bookDTO.fileName = book.attributes.fileName;
                                        books.push(bookDTO);
                                        this.storage.set("my-books", books).then();
                                    });
                                }
                                this.router.navigate(["/shelf"]);
                            })
                            .catch((e) => console.error(e));
                    }
                );
            } else {
                this.router.navigate(["/auth"]);
            }
        });
    }
}
