import {Component, OnInit} from '@angular/core';
import {HttpParseService} from "../../services/http-parse.service";
import {AppStorageService} from "../../services/app-storage.service";
import {PopoverController} from "@ionic/angular";
import {UserDTO} from "../../models/UserDTO";
import {Router} from "@angular/router";

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent implements OnInit {
    public userDTO: UserDTO;

    constructor(private httpParseService: HttpParseService,
                private appStorageService: AppStorageService,
                private popoverController: PopoverController,
                private router: Router) {
    }

    ngOnInit() {
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                this.userDTO = userDTO;
                if (this.userDTO.goToLastRead == null) {
                    this.userDTO.goToLastRead = false;
                }
            }
        )
    }

    async setOpenLastRead() {
        this.userDTO.goToLastRead = !this.userDTO.goToLastRead;
        this.httpParseService.updateOpenLastRead(this.userDTO);
        await this.popoverController.dismiss();
    }

    async logOut() {
        await this.popoverController.dismiss();
        this.appStorageService.setUserDTO(null).then();
        this.router.navigate(['/auth/login']).then();
    }
}
