import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {LoadingController, Platform} from '@ionic/angular';
import {Facebook} from '@ionic-native/facebook/ngx';
import {BookService} from "../services/book.service";

declare var ePub: any;

@Component({
    selector: 'app-user',
    templateUrl: './user.page.html',
    styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit, AfterViewInit {

    constructor(
        private fb: Facebook,
        private nativeStorage: NativeStorage,
        public loadingController: LoadingController,
        private router: Router,
        public bookService: BookService,
        public plt: Platform) {
    }

    user: any;
    userReady: boolean = false;
    book: any;
    rendition: any;
    bookTitle: any;


    async ngOnInit() {
        const loading = await this.loadingController.create({
            message: 'Please wait...'
        });
        await loading.present();
        this.nativeStorage.getItem('facebook_user')
            .then(data => {
                this.user = {
                    name: data.name,
                    email: data.email,
                    picture: data.picture
                };
                loading.dismiss();
                this.userReady = true;
            }, error => {
                console.log(error);
                loading.dismiss();
            });
    }

    doFbLogout() {
        this.fb.logout()
            .then(res => {
                //user logged out so we will remove him from the NativeStorage
                this.nativeStorage.remove('facebook_user');
                this.router.navigate(["/login"]);
            }, err => {
                console.log(err);
            });
    }

    ngAfterViewInit(): void {
        this.book = ePub("https://yatsa.betamo.de/ionic-epubjs/Metamorphosis-jackson.epub");
        this.rendition = this.book.renderTo("book", {
            width: "100%",
            height: this.plt.height() - 70,
            spread: "always"
        });

        this.rendition.display();

        this.book.ready.then(() => {
            console.error('this.book.package', this.book.package);
            this.bookTitle = this.bookService.getTitle(this.book);
            /*var next = document.getElementById("next");

            this.bookService.goToNextPage(next, this.rendition, this.book);

            var prev = document.getElementById("prev");

            this.bookService.goToNextPage(prev, this.rendition, this.book);

            var keyListener = function (e) {

                // Left Key
                if ((e.keyCode || e.which) == 37) {
                    book.package.metadata.direction === "rtl" ? rendition.next() : rendition.prev();
                }

                // Right Key
                if ((e.keyCode || e.which) == 39) {
                    book.package.metadata.direction === "rtl" ? rendition.prev() : rendition.next();
                }

            };

            rendition.on("keyup", keyListener);
            document.addEventListener("keyup", keyListener, false);*/
        });
    }

    public goToNextPage() {
        this.bookService.goToNextPage(this.rendition, this.book);
    }

    public goToPreviousPage() {
        this.bookService.goToPreviousPage(this.rendition, this.book);
    }

}
