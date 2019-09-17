import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {ParseService} from "../../services/parse.service";
import {UserDTO} from "../../models/UserDTO";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    constructor(private router: Router,
                public parseService: ParseService) {
    }

    ngOnInit() {
    }

    public login(form: NgForm) {
        let userDTO: UserDTO = new UserDTO();
        userDTO.email = form.controls.email.value;
        userDTO.password = form.controls.password.value;
        this.parseService.login(userDTO).then(
            (res) => {
                this.goToShelf();
            }
        ).catch(error => {
            console.error(error);
        });

    }

    public goToRegister() {
        this.router.navigate(['auth/sign-up']);
    }

    public goToShelf() {
        this.router.navigate(['shelf']);
    }
}
