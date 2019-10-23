import {Injectable} from '@angular/core';
import {AppStorageService} from "../er-local-storage/app-storage.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(public appStorageService: AppStorageService) {
    }

    public getToken() {
        return this.appStorageService.getToken();
    }

    public isAuthenticated(): boolean {
        // get the token
        const token = this.getToken();
        // return a boolean reflecting
        // whether or not the token is expired
        return token != null;
    }
}
