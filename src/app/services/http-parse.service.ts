import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BookDTO} from "../ebook-reader/dto/BookDTO";
import {Subject} from "rxjs";
import {UserDTO} from "../models/UserDTO";
import {AppStorageService} from "../er-local-storage/app-storage.service";
import {BookmarkDTO} from "../ebook-reader/dto/BookmarkDTO";
import {ConnectionDTO} from "../models/ConnectionDTO";

@Injectable({
    providedIn: 'root'
})
export class HttpParseService {
    public parseURL = 'https://vps658548.ovh.net/parse-server/parse/';

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
        let userDTO = this.appStorageService.getUserDTO();
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
        return subject.asObservable();
    }

    public getBooksForUser() {
        var subject = new Subject<BookDTO[]>();
        let userDTO = this.appStorageService.getUserDTO();

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
        return subject.asObservable();
    }

    public getBookById(bookId) {
        let query = encodeURI('{"objectId": "' + bookId + '"}');
        return this.httpClient.get(this.parseURL + '/classes/' + ParseClasses.BOOK + '?where=' + query, {headers: this.createHeaders()});
    }

    public deleteBook(bookDTO: BookDTO) {
        var subject = new Subject<void>();
        let updateParams = '{"isDeleted": true}';
        this.httpClient.delete(this.parseURL + 'classes/' + ParseClasses.BOOK + '/' + bookDTO.objectId, /*updateParams,*/ {headers: this.createHeaders()}).subscribe(
            (res) => {
                this.httpClient.delete(this.parseURL + 'files/' + bookDTO.fileUrlName, {headers: this.createFullHeaders()}).subscribe(
                    (res) => {
                        subject.next();
                    }, (e) => console.error(e)
                )
            }, (e) => console.error(e)
        );
        return subject.asObservable();
    }

    public updateLastReadBook(bookDTO: BookDTO) {
        let userDTO = this.appStorageService.getUserDTO();

        userDTO.lastReadBook = bookDTO.objectId;
        this.appStorageService.setUserDTO(userDTO);

        let updateParams = '{"lastReadBook": "' + bookDTO.objectId + '"}';
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + userDTO.objectId, updateParams, {headers: this.createFullHeaders()});
    }

    public updateFontSize(fontSize) {
        this.appStorageService.setFontSize(fontSize);

        let updateParams = '{"fontSize": "' + fontSize + '"}';
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + this.appStorageService.getUserDTO().objectId, updateParams, {headers: this.createFullHeaders()});
    }

    public updateTextColor(textColor) {
        this.appStorageService.setTextColor(textColor);

        let updateParams = '{"textColor": "' + textColor + '"}';
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + this.appStorageService.getUserDTO().objectId, updateParams, {headers: this.createFullHeaders()})
    }

    public updateBackgroundColor(backgroundColor) {
        this.appStorageService.setBackgroundColor(backgroundColor);

        let updateParams = '{"backgroundColor": "' + backgroundColor + '"}';
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + this.appStorageService.getUserDTO().objectId, updateParams, {headers: this.createFullHeaders()})
    }

    public updateTextBold(isBold: boolean) {
        this.appStorageService.setTextBold(isBold);

        let updateParams = '{"isBold": "' + isBold + '"}';
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + this.appStorageService.getUserDTO().objectId, updateParams, {headers: this.createFullHeaders()});
    }

    public updateTextItalic(isItalic: boolean) {
        this.appStorageService.setTextItalic(isItalic);

        let updateParams = '{"isItalic": "' + isItalic + '"}';
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + this.appStorageService.getUserDTO().objectId, updateParams, {headers: this.createFullHeaders()});
    }

    public updateNavigationControl(showNavigationControl: boolean) {
        this.appStorageService.setNavigationControl(showNavigationControl);

        let updateParams = '{"showNavigationControl": "' + showNavigationControl + '"}';
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + this.appStorageService.getUserDTO().objectId, updateParams, {headers: this.createFullHeaders()});
    }

    public updateTheme(theme: string) {
        this.appStorageService.setTheme(theme);

        let updateParams = '{"theme": "' + theme + '"}';
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + this.appStorageService.getUserDTO().objectId, updateParams, {headers: this.createFullHeaders()});
    }

    public updateFavoritesBooks(favoriteBooks: string[], userDTO: UserDTO) {
        this.appStorageService.setUserDTO(userDTO);
        let updateParams = '{"favoriteBooks": "' + favoriteBooks + '"}';
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + userDTO.objectId, updateParams, {headers: this.createFullHeaders()});
    }

    public updateOpenLastRead(userDTO: UserDTO) {
        this.appStorageService.setUserDTO(userDTO);

        let updateParams = '{"goToLastRead": "' + userDTO.goToLastRead + '"}';
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/' + userDTO.objectId, updateParams, {headers: this.createFullHeaders()});
    }

    public getBookmarks(bookDTO: BookDTO) {
        let query = encodeURI('{"userId": "' + this.appStorageService.getUserDTO().objectId + '", "isDeleted": false, "bookId": "' + bookDTO.objectId + '"}');
        return this.httpClient.get(this.parseURL + '/classes/' + ParseClasses.BOOKMARKS + '?where=' + query, {headers: this.createHeaders()});
    }

    public deleteBookMark(bookMarkDTO: BookmarkDTO) {
        let updateParams = '{"isDeleted": true}';
        return this.httpClient
            .put(this.parseURL + 'classes/' + ParseClasses.BOOKMARKS + '/' + bookMarkDTO.objectId, updateParams, {headers: this.createFullHeaders()});
    }

    public addBookmark(bookMarkDTO: BookmarkDTO) {
        bookMarkDTO.userId = this.appStorageService.getUserDTO().objectId;
        return this.httpClient.post(this.parseURL + 'classes/' + ParseClasses.BOOKMARKS, bookMarkDTO, {headers: this.createHeaders()});
    }

    // start social
    public getAllUsers() {
        var subject = new Subject<UserDTO[]>();
        let query = encodeURI('{"email": {"$ne":"' + this.appStorageService.getUserDTO().email + '"}}');
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
        return subject.asObservable();
    }

    public getUnconnectedUsers() {
        var subject = new Subject<UserDTO[]>();

        let userIdString = '["' + this.appStorageService.getUserDTO().objectId + '"';
        this.appStorageService.getConnections().filter(conn => conn.secondUserAccepted == true && conn.firstUserAccepted == true).forEach(
            connection => {
                userIdString += ',"' + connection.secondUserId + '",';
                userIdString += '"' + connection.firstUserId + '"';
            }
        );
        userIdString += ']';
        let query = '{"objectId": {"$nin":' + userIdString + '}}';

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
        return subject.asObservable();
    }

    public getMyConnectedUsers() {
        var subject = new Subject<UserDTO[]>();

        let query = '{"objectId":' +
            '{"$inQuery":' +
            '{"where":{"secondUserAccepted":true, "firstUserAccepted":true, ' +
            '"$or": [{"secondUserId": "' + this.appStorageService.getUserDTO().objectId + '"}, ' +
            '{"firstUserId": "' + this.appStorageService.getUserDTO().objectId + '"}],"className":"Connections"}}}';
        /*
                let userIdString = '["' + this.appStorageService.getUserDTO().objectId + '"';
                this.appStorageService.getConnections().filter(conn => conn.secondUserAccepted == true && conn.firstUserAccepted == true).forEach(
                    connection => {
                        userIdString += ',"' + connection.secondUserId + '",';
                        userIdString += '"' + connection.firstUserId + '"';
                    }
                );
                userIdString += ']';
                let query = '{"objectId": {"$in":' + userIdString + '}}';*/

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
        return subject.asObservable();
    }

    public addConenction(reuqestedUserDTO: UserDTO) {
        var subject = new Subject<any>();
        let connectionDTO: ConnectionDTO = new ConnectionDTO();
        connectionDTO.firstUserId = this.appStorageService.getUserDTO().objectId;
        connectionDTO.secondUserId = reuqestedUserDTO.objectId;
        connectionDTO.firstUserAccepted = true;
        connectionDTO.secondUserAccepted = false;
        return this.httpClient.post(this.parseURL + '/classes/' + ParseClasses.CONNECTIONS, connectionDTO, {headers: this.createHeaders()});
    }

    public getMyPendingConnection() {
        var subject = new Subject<ConnectionDTO[]>();
        let query = encodeURI('{"firstUserId":"' + this.appStorageService.getUserDTO().objectId + '", "secondUserAccepted": false}');
        this.httpClient.get(this.parseURL + '/classes/' + ParseClasses.CONNECTIONS + '?where=' + query, {headers: this.createHeaders()})
            .subscribe((connectionsDTO: any) => {
                subject.next(connectionsDTO.results);
            });
        return subject.asObservable();
    }

    public getReceivedConnections() {
        let query = encodeURI('{"secondUserId":"' + this.appStorageService.getUserDTO().objectId + '", "secondUserAccepted": false}');
        return this.httpClient.get(this.parseURL + '/classes/' + ParseClasses.CONNECTIONS + '?where=' + query, {headers: this.createHeaders()});
    }

    public getMyConnections() {
        let query = encodeURI('{"$or": [{"secondUserId": "' + this.appStorageService.getUserDTO().objectId + '"}, ' +
            '{"firstUserId": "' + this.appStorageService.getUserDTO().objectId + '"}], "secondUserAccepted": true, "firstUserAccepted": true}');
        return this.httpClient.get(this.parseURL + 'classes/' + ParseClasses.CONNECTIONS + '?where=' + query, {headers: this.createHeaders()});
    }

    public getUsersByIds(userIds: any[]) {
        var subject = new Subject<UserDTO[]>();
        let userIdString = '[';
        userIds.forEach(
            id => userIdString += '"' + id + '"'
        );
        userIdString += ']';
        let query = '{"objectId": {"$in":' + userIdString + '}}';
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
        return subject.asObservable();
    }

    public acceptConnection(connectionDTO: ConnectionDTO) {
        let updateParams = '{"secondUserAccepted": true}';
        return this.httpClient.put(this.parseURL + '/classes/' + ParseClasses.CONNECTIONS + '/' + connectionDTO.objectId, updateParams, {headers: this.createHeaders()})
    }

    // end social

    private createHeaders() {
        let httpHeaders: HttpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.append('X-Parse-Application-Id', 'sublime-reader-appId');
        httpHeaders = httpHeaders.append('X-Parse-REST-API-Key', 'sublime-reader-restApiKey');
        return httpHeaders;
    }

    private createFullHeaders() {
        let httpHeaders: HttpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.append('X-Parse-Application-Id', 'sublime-reader-appId');
        httpHeaders = httpHeaders.append('X-Parse-REST-API-Key', 'sublime-reader-restApiKey');
        httpHeaders = httpHeaders.append('X-Parse-Master-Key', 'sublime-reader-masterKey');
        return httpHeaders;
    }

    public initApp() {
        if (this.appStorageService.getConnections() == null) {
            this.getMyConnections().subscribe(
                (res: any) => {
                    this.appStorageService.setConnections(res.results as ConnectionDTO[]);
                }
            );
        }

        if (this.appStorageService.getUserConnections() == null) {
            this.getMyConnectedUsers().subscribe(
                (res: any) => {
                    this.appStorageService.setUserConnections(res.results as UserDTO[]);
                }
            );
        }
        if (this.appStorageService.getBooks() == null) {
            this.getBooksForUser().subscribe(
                (books) => {
                    this.appStorageService.setBooks(books);
                }
            )
        }
    }
}


export enum ParseClasses {
    BOOK = 'Book',
    USER = 'users',
    BOOKMARKS = 'Bookmarks',
    CONNECTIONS = 'Connections'
}