import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {LoadingController} from '@ionic/angular';
import {Facebook} from '@ionic-native/facebook/ngx';
import {BookService} from "../services/book.service";
import {Storage} from "@ionic/storage";

@Component({
    selector: 'app-user',
    templateUrl: './reader-page.component.html',
    styleUrls: ['./reader-page.component.scss'],
})
export class ReaderPage implements OnInit, AfterViewInit {
    ebookSource;

    constructor(
        private fb: Facebook,
        private nativeStorage: NativeStorage,
        public loadingController: LoadingController,
        private router: Router,
        public bookService: BookService,
        public storage: Storage,
        private route: ActivatedRoute) {
    }

    user: any;
    userReady: boolean = false;


    async ngOnInit() {
        this.route.params.subscribe(params => {
            console.error(params);
            if (this.router.getCurrentNavigation().extras.state) {
                this.ebookSource = this.router.getCurrentNavigation().extras.state.book.bookContent;
            }
        });
        /*
                this.storage.get("bookUri").then(
                    (res) => {
                        this.ebookSource = res;
                        console.error('this.ebookSource', this.ebookSource);
                    }
                );

        const loading = await this.loadingController.create({
            message: 'Please wait...'
        });
        await loading.present();
        this.nativeStorage.getItem('facebook_user')
            .then(data => {
                this.reader = {
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
                //reader logged out so we will remove him from the NativeStorage
                this.nativeStorage.remove('facebook_user');
                this.router.navigate(["/shelf"]);
            }, err => {
                console.log(err);
            });*/
    }

    ngAfterViewInit(): void {
    }
}
