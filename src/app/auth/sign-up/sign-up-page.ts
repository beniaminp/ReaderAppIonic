import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {UserDTO} from "../../models/UserDTO";
import {Router} from "@angular/router";
import {HttpParseService} from "../../services/http-parse.service";
import {AppStorageService} from "../../services/app-storage.service";
import {LoadingService} from "../../services/loading.service";

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up-page.html',
    styleUrls: ['./sign-up-page.scss'],
})
export class SignUpPage implements OnInit {

    constructor(private router: Router,
                private httpParseService: HttpParseService,
                private appStorageService: AppStorageService,
                private loadingService: LoadingService) {
    }

    ngOnInit() {
    }

    public register(form: NgForm) {
        this.loadingService.showLoader();
        let userDTO: UserDTO = new UserDTO();
        userDTO.username = form.controls.name.value;
        userDTO.email = form.controls.email.value;
        userDTO.password = form.controls.password.value;

        this.httpParseService.signUpUser(userDTO).subscribe(
            (res: any) => {
                userDTO.sessionToken = res.sessionToken;
                userDTO.objectId = res.objectId;
                userDTO.lastReadBook = res.lastReadBook;
                this.appStorageService.setUserDTO(userDTO).then(
                    (res) => {
                        this.loadingService.dismissLoader();
                        this.goToShelf();
                    }
                );
            }, (e) => {
                console.error(e);
                this.loadingService.dismissLoader()
            }
        );
    }

    public goToShelf() {
        this.router.navigate(['shelf']);
    }
}
