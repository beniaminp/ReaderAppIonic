import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";
import {UserDTO} from "../models/UserDTO";

@Injectable({
    providedIn: 'root'
})
export class AppStorageService {

    constructor(private storage: Storage) {
    }

    public setSessionToken(sessionToken: string) {
        return this.storage.set("sessionToken", sessionToken);
    }

    public setUserDTO(userDTO: UserDTO) {
        return this.storage.set("userDTO", userDTO);
    }

    public getUserDTO() {
        return this.storage.get('userDTO');
    }
}

export enum STDATA {
    USER = 'userDTO'
}
