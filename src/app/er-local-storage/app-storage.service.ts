import {Injectable} from '@angular/core';
import {UserDTO} from "../models/UserDTO";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable({
    providedIn: 'root'
})
export class AppStorageService {

    constructor(private localStorageService: LocalStorageService) {
    }

    public setUserDTO(userDTO: UserDTO) {
        this.localStorageService.set('userDTO', userDTO);
    }

    public getUserDTO(): UserDTO {
        return this.localStorageService.get('userDTO');
    }

    public clearUser() {
        this.localStorageService.remove('userDTO');
    }

    public setFontSize(fontSize) {
        let userDTO = this.getUserDTO();
        userDTO.fontSize = fontSize;
        this.setUserDTO(userDTO);
    }

    public setTextColor(textColor) {
        let userDTO = this.getUserDTO();
        userDTO.textColor = textColor;
        this.setUserDTO(userDTO);
    }

    public setBackgroundColor(backgroundColor) {
        let userDTO = this.getUserDTO();
        userDTO.backgroundColor = backgroundColor;
        this.setUserDTO(userDTO);
    }

    public setTextBold(isTextBold) {
        let userDTO: UserDTO = this.getUserDTO();
        userDTO.isBold = isTextBold;
        this.setUserDTO(userDTO);
    }

    public setTextItalic(isItalic) {
        let userDTO: UserDTO = this.getUserDTO();
        userDTO.isItalic = isItalic;
        this.setUserDTO(userDTO);
    }
}

export enum STDATA {
    USER = 'userDTO'
}
