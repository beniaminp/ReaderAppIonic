import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {MenuController} from '@ionic/angular';
import {Facebook} from '@ionic-native/facebook/ngx';
import {Storage} from "@ionic/storage";
import {BookDTO} from "../ebook-reader/dto/bookDTO";

@Component({
    selector: 'app-user',
    templateUrl: './reader-page.component.html',
    styleUrls: ['./reader-page.component.scss'],
})
export class ReaderPage implements OnInit, AfterViewInit {
    ebookSource;
    private bookDTO: BookDTO;

    constructor(
        private fb: Facebook,
        private nativeStorage: NativeStorage,
        private router: Router,
        public storage: Storage,
        private route: ActivatedRoute,
        public menuController: MenuController) {
    }

    async ngOnInit() {
        this.enableMenu();
        this.route.params.subscribe(params => {
            this.enableMenu();
            if (this.router.getCurrentNavigation().extras.state) {
                this.bookDTO = this.router.getCurrentNavigation().extras.state.book;
                this.ebookSource = this.bookDTO.fileUrl;
            }
        });
    }

    private enableMenu() {
        this.menuController.enable(true, 'ebook-menu');
    }

    ngAfterViewInit(): void {
    }
}
