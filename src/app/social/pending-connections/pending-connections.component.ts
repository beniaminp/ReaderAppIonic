import {Component, OnInit} from '@angular/core';
import {ConnectionDTO} from "../../models/ConnectionDTO";
import {HttpParseService} from "../../services/http-parse.service";
import {UserDTO} from "../../models/UserDTO";

@Component({
    selector: 'app-pending-connections',
    templateUrl: './pending-connections.component.html',
    styleUrls: ['./pending-connections.component.scss'],
})
export class PendingConnectionsComponent implements OnInit {
    public receivedConnections: ConnectionDTO[];
    public usersMap: Map<string, UserDTO> = new Map();

    constructor(public httpParseService: HttpParseService) {
    }

    ngOnInit() {
        this.refreshPendingConnections();
    }

    private refreshPendingConnections() {
        this.httpParseService.getReceivedConnections().subscribe(
            (connections) => {
                this.receivedConnections = connections == null ? [] : connections;
                let usersIdArray = [];

                this.receivedConnections.forEach(connection => {
                    usersIdArray.push(connection.firstUserId);
                });
                this.httpParseService.getUsersByIds(usersIdArray).subscribe(
                    (usersDTO: UserDTO[]) => {
                        usersDTO.forEach(userDTO => this.usersMap.set(userDTO.objectId, userDTO));
                    }
                ), e1 => console.error(e1)
            }, e => console.error(e)
        )
    }

    public acceptInvite(connection: ConnectionDTO) {
        this.httpParseService.acceptConnection(connection).subscribe(
            (res) => {
                this.refreshPendingConnections();
            }
        )
    }
}
