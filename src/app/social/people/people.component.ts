import {Component, OnInit} from '@angular/core';
import {UserDTO} from "../../models/UserDTO";
import {HttpParseService} from "../../services/http-parse.service";
import {ConnectionDTO} from "../../models/ConnectionDTO";
import {ModalController} from "@ionic/angular";

@Component({
    selector: 'app-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {

    public usersDTO: UserDTO[];
    public myPendingConnections: ConnectionDTO[];

    constructor(public httpParseService: HttpParseService,
                public modalController: ModalController) {
    }

    ngOnInit() {
        this.refreshPendingConnections();
        this.getAllUsers();
    }

    private getAllUsers() {
        this.httpParseService.getAllUsers().subscribe(
            (res: UserDTO[]) => {
                this.usersDTO = res;
            }, e => console.error(e)
        );
    }

    public sendInvite(userDTO: UserDTO) {
        this.httpParseService.addConenction(userDTO).subscribe(
            (res) => {
                this.refreshPendingConnections();
            }
        )
    }

    public checkInvitationSent(user: UserDTO) {
        return this.myPendingConnections.find(conn => conn.secondUserId == user.objectId) != null;
    }

    public dismissModal() {
        this.modalController.dismiss();
    }

    private refreshPendingConnections() {
        this.httpParseService.getMyPendingConnection().subscribe(
            (connections) => {
                this.myPendingConnections = connections == null ? [] : connections;
            }, e => console.error(e)
        )
    }
}
