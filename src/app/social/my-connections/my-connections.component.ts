import {Component, OnInit} from '@angular/core';
import {HttpParseService} from "../../services/http-parse.service";
import {ModalController} from "@ionic/angular";
import {AppStorageService} from "../../er-local-storage/app-storage.service";
import {UserDTO} from "../../models/UserDTO";
import {ConnectionDTO} from "../../models/ConnectionDTO";

@Component({
    selector: 'app-my-connections',
    templateUrl: './my-connections.component.html',
    styleUrls: ['./my-connections.component.scss'],
})
export class MyConnectionsComponent implements OnInit {
    public myConnections: ConnectionDTO[];
    public usersMap: Map<string, UserDTO> = new Map();
    public isOkToRender = false;
    public userDTO: UserDTO;

    constructor(public httpParseService: HttpParseService,
                public modalController: ModalController,
                public appStorageService: AppStorageService) {
    }

    ngOnInit() {
        this.userDTO = this.appStorageService.getUserDTO();
        this.myConnections = this.appStorageService.getConnections();
        let usersIdArray = [];
        this.myConnections.forEach(connection => {
            if (connection.firstUserId != this.userDTO.objectId) {
                usersIdArray.push(connection.firstUserId);
            } else {
                usersIdArray.push(connection.secondUserId);
            }

        });
        this.httpParseService.getUsersByIds(usersIdArray).subscribe(
            (usersDTO: UserDTO[]) => {
                usersDTO.forEach(userDTO => this.usersMap.set(userDTO.objectId, userDTO));
                this.isOkToRender = true;
            }
        )
    }

    public dismissModal() {
        this.modalController.dismiss();
    }
}
