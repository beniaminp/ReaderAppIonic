import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BookDTO} from "../ebook-reader/dto/BookDTO";
import {Subject} from "rxjs";
import {UserDTO} from "../models/UserDTO";
import {AppStorageService} from "./app-storage.service";
import {BookmarkDTO} from "../ebook-reader/dto/BookmarkDTO";
import {ConnectionDTO} from "../models/ConnectionDTO";

@Injectable({
    providedIn: 'root'
})
export class HttpParseService {
    public parseURL = 'https://parseapi.back4app.com/';

    constructor(private httpClient: HttpClient,
                public appStorageService: AppStorageService) {

    }

    public loginUser(userDTO: UserDTO) {
        return this.httpClient.get(this.parseURL + 'login?username=' + userDTO.email + '&password=' + userDTO.password,
            {headers: this.createHeaders()});
    }

    public signUpUser(userDTO: UserDTO) {
        let user: any = {};
        user.username = userDTO.email;
        user.name = userDTO.username;
        user.email = userDTO.email;
        user.password = userDTO.password;

        return this.httpClient.post(this.parseURL + ParseClasses.USER, user,
            {headers: this.createHeaders()});
    }

    public uploadFile(byteArrayFile, fileName) {
        let headers: HttpHeaders = this.createHeaders();
        headers = headers.append('Content-Type', 'application/epub+zip ');
        return this.httpClient.post(this.parseURL + 'files/' + fileName, byteArrayFile, {headers: headers});
    }

    public addBook(bookDTO: BookDTO) {
        var subject = new Subject<BookDTO>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                this.uploadFile(bookDTO.bookContent, bookDTO.fileName).subscribe(
                    (res: any) => {
                        bookDTO.fileUrl = res.url;
                        bookDTO.fileUrlName = res.name;
                        bookDTO.userId = userDTO.objectId;

                        this.httpClient.post(this.parseURL + '/classes/' + ParseClasses.BOOK, bookDTO, {headers: this.createHeaders()})
                            .subscribe((book) => {
                                subject.next(bookDTO);
                            });
                    }
                );
            }
        );
        return subject.asObservable();
    }

    public getBooksForUser() {
        var subject = new Subject<BookDTO[]>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                let query = encodeURI('{"userId": "' + userDTO.objectId + '", "isDeleted": false}');
                this.httpClient.get(this.parseURL + '/classes/' + ParseClasses.BOOK + '?where=' + query, {headers: this.createHeaders()})
                    .subscribe((books: any) => {
                        let booksDTO: BookDTO[] = [];
                        books.results.forEach(book => {
                            let bookDTO: BookDTO = new BookDTO();
                            bookDTO.fileName = book.fileName;
                            bookDTO.userId = book.userId;
                            bookDTO.fileUrl = book.fileUrl;
                            bookDTO.objectId = book.objectId;
                            booksDTO.push(bookDTO);
                        });
                        subject.next(booksDTO);
                    });
            }
        );
        return subject.asObservable();
    }

    public getBookById(bookId) {
        let query = encodeURI('{"objectId": "' + bookId + '"}');
        return this.httpClient.get(this.parseURL + '/classes/' + ParseClasses.BOOK + '?where=' + query, {headers: this.createHeaders()});
    }

    public deleteBook(bookDTO: BookDTO) {
        var subject = new Subject<void>();
        let updateParams = '{"isDeleted": true}';
        this.httpClient.put(this.parseURL + 'classes/' + ParseClasses.BOOK + '/' + bookDTO.objectId, updateParams, {headers: this.createHeaders()}).subscribe(
            (res) => {
                /*this.httpClient.delete(this.parseURL + 'files/' + bookDTO.fileUrlName, {headers: this.createFullHeaders()}).subscribe(
                    (res) => {
                        subject.next();
                    }, (e) => console.error(e)
                )*/

                subject.next();
            }, (e) => console.error(e)
        );
        return subject.asObservable();
    }

    public updateLastReadBook(bookDTO: BookDTO) {
        var subject = new Subject<void>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                let user = userDTO;
                user.lastReadBook = bookDTO.objectId;
                this.appStorageService.setUserDTO(user).then(
                    (res) => {
                        let updateParams = '{"lastReadBook": "' + bookDTO.objectId + '"}';
                        this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + userDTO.objectId, updateParams, {headers: this.createFullHeaders()}).subscribe(
                            () => {
                                subject.next();
                            }
                        )
                    }
                ).catch(e => console.error(e));
            }
        );
        return subject.asObservable();
    }

    public updateFontSize(fontSize) {
        var subject = new Subject<void>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                let user = userDTO;
                user.fontSize = fontSize;
                this.appStorageService.setUserDTO(user).then(
                    (res) => {
                        let updateParams = '{"fontSize": "' + fontSize + '"}';
                        this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + userDTO.objectId, updateParams, {headers: this.createFullHeaders()}).subscribe(
                            () => {
                                subject.next();
                            }
                        )
                    }
                ).catch(e => console.error(e));
            }
        );
        return subject.asObservable();
    }

    public updateTextColor(textColor) {
        var subject = new Subject<void>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                let user = userDTO;
                user.textColor = textColor;
                this.appStorageService.setUserDTO(user).then(
                    (res) => {
                        let updateParams = '{"textColor": "' + textColor + '"}';
                        this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + userDTO.objectId, updateParams, {headers: this.createFullHeaders()}).subscribe(
                            () => {
                                subject.next();
                            }
                        )
                    }
                ).catch(e => console.error(e));
            }
        );
        return subject.asObservable();
    }

    public updateBackgroundColor(backgroundColor) {
        var subject = new Subject<void>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                let user = userDTO;
                user.backgroundColor = backgroundColor;
                this.appStorageService.setUserDTO(user).then(
                    (res) => {
                        let updateParams = '{"backgroundColor": "' + backgroundColor + '"}';
                        this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + userDTO.objectId, updateParams, {headers: this.createFullHeaders()}).subscribe(
                            () => {
                                subject.next();
                            }
                        )
                    }
                ).catch(e => console.error(e));
            }
        );
        return subject.asObservable();
    }

    public updateTextBold(isBold: boolean) {
        var subject = new Subject<void>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                let user = userDTO;
                user.isBold = isBold;
                this.appStorageService.setUserDTO(user).then(
                    (res) => {
                        let updateParams = '{"isBold": "' + isBold + '"}';
                        this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + userDTO.objectId, updateParams, {headers: this.createFullHeaders()}).subscribe(
                            () => {
                                subject.next();
                            }
                        )
                    }
                ).catch(e => console.error(e));
            }
        );
        return subject.asObservable();
    }

    public updateTextItalic(isItalic: boolean) {
        var subject = new Subject<void>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                let user = userDTO;
                user.isItalic = isItalic;
                this.appStorageService.setUserDTO(user).then(
                    (res) => {
                        let updateParams = '{"isItalic": "' + isItalic + '"}';
                        this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + userDTO.objectId, updateParams, {headers: this.createFullHeaders()}).subscribe(
                            () => {
                                subject.next();
                            }
                        )
                    }
                ).catch(e => console.error(e));
            }
        );
        return subject.asObservable();
    }

    public updateFavoritesBooks(favoriteBooks: string[], userDTO: UserDTO) {
        var subject = new Subject<void>();

        this.appStorageService.setUserDTO(userDTO).then(
            (res) => {
                let updateParams = '{"favoriteBooks": "' + favoriteBooks + '"}';
                this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + userDTO.objectId, updateParams, {headers: this.createFullHeaders()}).subscribe(
                    () => {
                        subject.next();
                    }
                )
            }
        );
        return subject.asObservable();
    }

    public updateOpenLastRead(userDTO: UserDTO) {
        var subject = new Subject<void>();

        this.appStorageService.setUserDTO(userDTO).then(
            (res) => {
                let updateParams = '{"goToLastRead": "' + userDTO.goToLastRead + '"}';
                this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + userDTO.objectId, updateParams, {headers: this.createFullHeaders()}).subscribe(
                    () => {
                        subject.next();
                    }
                )
            }
        );
        return subject.asObservable();
    }

    public getBookmarks(bookDTO: BookDTO) {
        var subject = new Subject<BookmarkDTO[]>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                let query = encodeURI('{"userId": "' + userDTO.objectId + '", "isDeleted": false, "bookId": "' + bookDTO.objectId + '"}');
                this.httpClient.get(this.parseURL + '/classes/' + ParseClasses.BOOKMARKS + '?where=' + query, {headers: this.createHeaders()})
                    .subscribe((bookMarksDTO: BookmarkDTO[]) => {
                        subject.next(bookMarksDTO);
                    });
            }
        );
        return subject.asObservable();
    }

    public deleteBookMark(bookMarkDTO: BookmarkDTO) {
        let updateParams = '{"isDeleted": true}';
        return this.httpClient
            .put(this.parseURL + 'classes/' + ParseClasses.BOOKMARKS + '/' + bookMarkDTO.objectId, updateParams, {headers: this.createFullHeaders()});
    }

    public addBookmark(bookMarkDTO: BookmarkDTO) {

        var subject = new Subject<any>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                bookMarkDTO.userId = userDTO.objectId;
                this.httpClient.post(this.parseURL + 'classes/' + ParseClasses.BOOKMARKS, bookMarkDTO, {headers: this.createHeaders()})
                    .subscribe((res: any) => {
                        subject.next(res);
                    });
            }
        );
        return subject.asObservable();
    }

    // start social
    public getAllUsers() {
        var subject = new Subject<UserDTO[]>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                let query = encodeURI('{"email": {"$ne":"' + userDTO.email + '"}}');
                this.httpClient.get(this.parseURL + ParseClasses.USER + '?where=' + query, {headers: this.createHeaders()})
                    .subscribe((res: any) => {
                        let usersDTO: UserDTO[] = [];
                        res.results.forEach(user => {
                            let userDTO: UserDTO = new UserDTO();
                            userDTO.username = user.name;
                            userDTO.objectId = user.objectId;
                            userDTO.email = user.email;
                            usersDTO.push(userDTO);
                        });
                        subject.next(usersDTO);
                    });
            }
        );
        return subject.asObservable();
    }

    public addConenction(reuqestedUserDTO: UserDTO) {
        var subject = new Subject<any>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                let connectionDTO: ConnectionDTO = new ConnectionDTO();
                connectionDTO.firstUserId = userDTO.objectId;
                connectionDTO.secondUserId = reuqestedUserDTO.objectId;
                connectionDTO.firstUserAccepted = true;
                connectionDTO.secondUserAccepted = false;
                this.httpClient.post(this.parseURL + '/classes/' + ParseClasses.CONNECTIONS, connectionDTO, {headers: this.createHeaders()})
                    .subscribe((connection) => {
                        subject.next(connection);
                    });
            }
        );
        return subject.asObservable();
    }

    public getMyPendingConnection() {
        var subject = new Subject<ConnectionDTO[]>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                let query = encodeURI('{"firstUserId":"' + userDTO.objectId + '", "secondUserAccepted": false}');
                this.httpClient.get(this.parseURL + '/classes/' + ParseClasses.CONNECTIONS + '?where=' + query, {headers: this.createHeaders()})
                    .subscribe((connectionsDTO: any) => {
                        subject.next(connectionsDTO.results);
                    });
            }
        );
        return subject.asObservable();
    }

    public getReceivedConnections() {
        var subject = new Subject<ConnectionDTO[]>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                let query = encodeURI('{"secondUserId":"' + userDTO.objectId + '", "secondUserAccepted": false}');
                this.httpClient.get(this.parseURL + '/classes/' + ParseClasses.CONNECTIONS + '?where=' + query, {headers: this.createHeaders()})
                    .subscribe((connectionsDTO: any) => {
                        subject.next(connectionsDTO.results);
                    });
            }
        );
        return subject.asObservable();
    }

    public getUsersByIds(userIds: any[]) {
        var subject = new Subject<UserDTO[]>();
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                let userIdString = '[';
                userIds.forEach(
                    id => userIdString += '"' + id + '"'
                );
                userIdString += ']';
                let query = '{"objectId": {"$in":{' + userIdString + '}}';
                this.httpClient.get(this.parseURL + ParseClasses.USER + '?where=' + query, {headers: this.createHeaders()})
                    .subscribe((res: any) => {
                        let usersDTO: UserDTO[] = [];
                        res.results.forEach(user => {
                            let userDTO: UserDTO = new UserDTO();
                            userDTO.username = user.name;
                            userDTO.objectId = user.objectId;
                            userDTO.email = user.email;
                            usersDTO.push(userDTO);
                        });
                        subject.next(usersDTO);
                    });
            }
        );
        return subject.asObservable();
    }

    public acceptConnection(connectionDTO: ConnectionDTO) {
        connectionDTO.secondUserAccepted = true;
        return this.httpClient.put(this.parseURL + '/classes/' + ParseClasses.CONNECTIONS + '/' + connectionDTO.objectId, connectionDTO, {headers: this.createHeaders()})
    }

    // end social

    private createHeaders() {
        let httpHeaders: HttpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.append('X-Parse-Application-Id', 'lkECc2ZtoxfhBlTTY7Flq2iCSFDZs4H608qmoOSV');
        httpHeaders = httpHeaders.append('X-Parse-REST-API-Key', 'luoPAzqoXsd88o1wtKkYo6qyGnTy2kDFhzOGM7Mv');
        return httpHeaders;
    }

    private createFullHeaders() {
        let httpHeaders: HttpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.append('X-Parse-Application-Id', 'lkECc2ZtoxfhBlTTY7Flq2iCSFDZs4H608qmoOSV');
        httpHeaders = httpHeaders.append('X-Parse-REST-API-Key', 'luoPAzqoXsd88o1wtKkYo6qyGnTy2kDFhzOGM7Mv');
        httpHeaders = httpHeaders.append('X-Parse-Master-Key', 'dudc1cQQLmdxL4BWz8ajM0Tu4Bxw8KWvzvefQPDt');
        return httpHeaders;
    }

}


export enum ParseClasses {
    BOOK = 'Book',
    USER = 'users',
    BOOKMARKS = 'Bookmarks',
    CONNECTIONS = 'Connections'
}