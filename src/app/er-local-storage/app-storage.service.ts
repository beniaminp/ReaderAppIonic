import {Injectable} from '@angular/core';
import {UserDTO} from "../models/UserDTO";
import {LocalStorageService} from "angular-2-local-storage";
import {ConnectionDTO} from "../models/ConnectionDTO";
import {BookDTO} from "../ebook-reader/dto/BookDTO";

@Injectable({
    providedIn: 'root'
})
export class AppStorageService {

    constructor(private localStorageService: LocalStorageService) {
    }

    public setUserDTO(userDTO: UserDTO) {
        this.localStorageService.set(STORAGE_DATA.USER, userDTO);
    }

    public getUserDTO(): UserDTO {
        return this.localStorageService.get(STORAGE_DATA.USER);
    }

    public clearUser() {
        this.localStorageService.remove(STORAGE_DATA.USER);
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

    public setNavigationControl(showNavigationControl) {
        let userDTO: UserDTO = this.getUserDTO();
        userDTO.showNavigationControl = showNavigationControl;
        this.setUserDTO(userDTO);
    }

    public setTheme(theme: string) {
        let userDTO: UserDTO = this.getUserDTO();
        userDTO.theme = theme;
        this.setUserDTO(userDTO);
    }

    public setConnections(connectionsDTO: ConnectionDTO[]) {
        this.localStorageService.set(STORAGE_DATA.CONNECTIONS, connectionsDTO);
    }

    public addConnection(connectionDTO: ConnectionDTO) {
        let connections = this.getConnections();
        connections.push(connectionDTO);
        this.setConnections(connections);
    }

    public getConnections(): ConnectionDTO[] {
        return this.localStorageService.get(STORAGE_DATA.CONNECTIONS);
    }

    public setBooks(booksDTO: BookDTO[]) {
        this.localStorageService.set(STORAGE_DATA.BOOKS, booksDTO);
    }

    public getBooks(): BookDTO[] {
        return this.localStorageService.get(STORAGE_DATA.BOOKS);
    }

    public addBook(bookDTO: BookDTO) {
        let books = this.getBooks();
        books.push(bookDTO);
        this.setBooks(books);
    }

    public deleteBook(bookDTO: BookDTO) {
        let books = this.getBooks().splice(this.getBooks().indexOf(bookDTO), 1);
        this.setBooks(books);
    }
}

enum STORAGE_DATA {
    USER = 'userDTO',
    CONNECTIONS = 'connections',
    BOOKS = 'booksDTO'
}
