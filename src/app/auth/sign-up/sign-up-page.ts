import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ParseService} from "../../services/parse.service";
import {UserDTO} from "../../models/UserDTO";
import {Router} from "@angular/router";

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up-page.html',
    styleUrls: ['./sign-up-page.scss'],
})
export class SignUpPage implements OnInit {

    constructor(public parseService: ParseService,
                private router: Router) {
    }

    ngOnInit() {
    }

    public register(form: NgForm) {
        let userDTO: UserDTO = new UserDTO();
        userDTO.username = form.controls.name.value;
        userDTO.email = form.controls.email.value;
        userDTO.password = form.controls.password.value;

        this.parseService.signUp(userDTO).then(
            (user) => {
                this.goToShelf();
            }
        ).catch(error => {
            console.error(error);
        })

    }

    public goToShelf() {
        this.router.navigate(['shelf']);
    }
}
