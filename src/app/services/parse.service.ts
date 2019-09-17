import {Injectable} from '@angular/core';
import {UserDTO} from "../models/UserDTO";

declare var require: any;

@Injectable({
    providedIn: 'root'
})
export class ParseService {
    private Parse;

    constructor() {
    }

    public initializeParse() {
        this.Parse = require('parse');

        this.Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
        this.Parse.initialize(
            'lkECc2ZtoxfhBlTTY7Flq2iCSFDZs4H608qmoOSV', // This is your Application ID
            'Di4uiecGVPx6SQ9onbU40cr4WCVeJc3tpQzbBjN8' // This is your Javascript key
        );
    }

    public signUp(userDTO: UserDTO) {
        let user = new this.Parse.User();
        user.set('username', userDTO.email);
        user.set('name', userDTO.username);
        user.set('email', userDTO.email);
        user.set('password', userDTO.password);

        return user.signUp();
    }

    public login(userDTO: UserDTO) {
        return this.Parse.User.logIn(userDTO.email, userDTO.password);
    }

    public getCurrentUser() {
        return this.Parse.User.current();
    }
}
