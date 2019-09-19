import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {UserDTO} from "../../models/UserDTO";
import {HttpParseService} from "../../services/http-parse.service";
import {AppStorageService} from "../../services/app-storage.service";
import {LoadingController} from "@ionic/angular";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    constructor(private router: Router,
                public httpParseService: HttpParseService,
                public appStorageService: AppStorageService,
                public loadingController: LoadingController) {
    }

    ngOnInit() {
    }

    public login(form: NgForm) {
        let userDTO: UserDTO = new UserDTO();
        userDTO.email = form.controls.email.value;
        userDTO.password = form.controls.password.value;
        this.httpParseService.loginUser(userDTO).subscribe(
            (res: any) => {
                userDTO.sessionToken = res.sessionToken;
                userDTO.objectId = res.objectId;
                this.appStorageService.setUserDTO(userDTO).then(
                    (res) => {
                        this.goToShelf();
                    }
                );
            }, (e) => {
                console.error(e);
            }
        );
    }

    public goToRegister() {
        this.router.navigate(['auth/sign-up']);
    }

    public goToShelf() {
        this.router.navigate(['shelf']);
    }

    async presentLoading() {
        const loading = await this.loadingController.create({});
        await loading.present();
    }
}
