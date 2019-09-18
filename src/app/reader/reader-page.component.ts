import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {LoadingController, MenuController} from '@ionic/angular';
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
        private route: ActivatedRoute,
        public menuController: MenuController) {
    }

    user: any;
    userReady: boolean = false;


    async ngOnInit() {
        this.enableMenu();
        this.route.params.subscribe(params => {
            this.enableMenu();
            if (this.router.getCurrentNavigation().extras.state) {
                this.ebookSource = this.router.getCurrentNavigation().extras.state.book.bookContent;
            }
        });
    }

    private enableMenu() {
        this.menuController.enable(true, 'ebook-menu');
    }

    ngAfterViewInit(): void {
    }
}
