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
    public parseURL = 'http://localhost:8080/';

    constructor(private httpClient: HttpClient,
                public appStorageService: AppStorageService) {

    }

    public loginUser(userDTO: UserDTO) {
        var subject = new Subject<UserDTO>();

        this.httpClient.post(this.parseURL + ParseClasses.AUTH + '/authenticate', {
            username: userDTO.email,
            password: userDTO.password
        }).subscribe(
            (res: any) => {
                this.appStorageService.setToken(res.token);
                this.httpClient.get(this.parseURL + ParseClasses.USER + '/getUser', this.createHttpOptions()).subscribe(
                    (userDTO: UserDTO) => {
                        subject.next(userDTO);
                    }
                )
            }
        );

        return subject.asObservable();
    }

    public signUpUser(userDTO: UserDTO) {
        var subject = new Subject<UserDTO>();

        let user: any = {};
        user.username = userDTO.email;
        user.name = userDTO.username;
        user.email = userDTO.email;
        user.password = userDTO.password;

        this.httpClient.post(this.parseURL + ParseClasses.AUTH + '/signup', user).subscribe(
            (res: any) => {
                this.appStorageService.setToken(res.token);
                this.httpClient.get(this.parseURL + ParseClasses.USER + '/getUser').subscribe(
                    (userDTO: UserDTO) => {
                        subject.next(userDTO);
                    }
                )
            }
        );
        return subject.asObservable();
    }

    public uploadFile(byteArrayFile, fileName) {
        return this.httpClient.post(this.parseURL + ParseClasses.BOOK + '/uploadFile/' + fileName, byteArrayFile, this.createHttpOptionsEpub());
    }

    public addBook(bookDTO: BookDTO) {
        var subject = new Subject<BookDTO>();
        let userDTO = this.appStorageService.getUserDTO();
        this.uploadFile(bookDTO.bookContent, bookDTO.fileName).subscribe(
            (res: any) => {
                console.error('res', res);
                bookDTO.fileUrl = res;
                bookDTO.fileUrlName = bookDTO.fileName;
                bookDTO.userId = userDTO.objectId;
                console.error('bookDTO', bookDTO);

                this.httpClient.post(this.parseURL + ParseClasses.BOOK + '/addBook', bookDTO, this.createHttpOptions())
                    .subscribe((book: any) => {
                        bookDTO.objectId = book.objectId;
                        subject.next(bookDTO);
                    });
            }
        );
        return subject.asObservable();
    }

    public getBooksForUser() {
        var subject = new Subject<BookDTO[]>();

        this.httpClient.get(this.parseURL + ParseClasses.BOOK + '/getBooks', this.createHttpOptions())
            .subscribe((books: any) => {
                let booksDTO: BookDTO[] = [];
                books.forEach(book => {
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
        return this.httpClient.get(this.parseURL + '/classes/' + ParseClasses.BOOK + '?where=' + query, this.createHttpOptions());
    }

    public getBookContent(bookUrl: string) {
        return this.httpClient.get(bookUrl, {responseType: 'blob'});
    }

    public deleteBook(bookDTO: BookDTO) {
        return this.httpClient.delete(this.parseURL + ParseClasses.BOOK + '/deleteBook/' + bookDTO.objectId);

    }

    public updateLastReadBook(bookDTO: BookDTO) {
        let userDTO = this.appStorageService.getUserDTO();

        userDTO.lastReadBook = bookDTO.objectId;
        this.appStorageService.setUserDTO(userDTO);

        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/updateLastReadBook/' + userDTO.objectId + '?lastReadBook=' + bookDTO.objectId, null, {headers: this.createFullHeaders()});
    }

    public updateFontSize(fontSize) {
        this.appStorageService.setFontSize(fontSize);
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/updateFontSize/' + this.appStorageService.getUserDTO().objectId + '?fontSize=' + fontSize, null, {headers: this.createFullHeaders()});
    }

    public updateTextColor(textColor) {
        this.appStorageService.setTextColor(textColor);
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/updateTextColor/' + this.appStorageService.getUserDTO().objectId + '?textColor=' + textColor, null, {headers: this.createFullHeaders()})
    }

    public updateBackgroundColor(backgroundColor) {
        this.appStorageService.setBackgroundColor(backgroundColor);

        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/updateBackgroundColor/' + this.appStorageService.getUserDTO().objectId + '?backgroundColor=' + backgroundColor, null, {headers: this.createFullHeaders()})
    }

    public updateTextBold(isBold: boolean) {
        this.appStorageService.setTextBold(isBold);
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/updateTextBold/' + this.appStorageService.getUserDTO().objectId + '?isBold=' + isBold, null, {headers: this.createFullHeaders()});
    }

    public updateTextItalic(isItalic: boolean) {
        this.appStorageService.setTextItalic(isItalic);
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/updateTextItalic/' + this.appStorageService.getUserDTO().objectId + '?isItalic=' + isItalic, null, {headers: this.createFullHeaders()});
    }

    public updateNavigationControl(showNavigationControl: boolean) {
        this.appStorageService.setNavigationControl(showNavigationControl);
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/updateNavigationControl/' + this.appStorageService.getUserDTO().objectId + '?showNavigationControl=' + showNavigationControl, null, {headers: this.createFullHeaders()});
    }

    public updateTheme(theme: string) {
        this.appStorageService.setTheme(theme);
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/updateTheme/' + this.appStorageService.getUserDTO().objectId + '?theme=' + theme, null, {headers: this.createFullHeaders()});
    }

    public updateFavoritesBooks(favoriteBooks: string[], userDTO: UserDTO) {
        this.appStorageService.setUserDTO(userDTO);
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/updateFavoritesBooks/' + userDTO.objectId, favoriteBooks, {headers: this.createFullHeaders()});
    }

    public updateOpenLastRead(userDTO: UserDTO) {
        this.appStorageService.setUserDTO(userDTO);
        return this.httpClient.put(this.parseURL + ParseClasses.USER + '/updateOpenLastRead/' + userDTO.objectId + '?goToLastRead=' + userDTO.goToLastRead, null, {headers: this.createFullHeaders()});
    }

    public getBookmarks(bookDTO: BookDTO) {
        let query = encodeURI('{"userId": "' + this.appStorageService.getUserDTO().objectId + '", "isDeleted": false, "bookId": "' + bookDTO.objectId + '"}');
        return this.httpClient.get(this.parseURL + '/classes/' + ParseClasses.BOOKMARKS + '?where=' + query, this.createHttpOptions());
    }

    public deleteBookMark(bookMarkDTO: BookmarkDTO) {
        let updateParams = '{"isDeleted": true}';
        return this.httpClient
            .put(this.parseURL + 'classes/' + ParseClasses.BOOKMARKS + '/' + bookMarkDTO.objectId, updateParams, {headers: this.createFullHeaders()});
    }

    public addBookmark(bookMarkDTO: BookmarkDTO) {
        bookMarkDTO.userId = this.appStorageService.getUserDTO().objectId;
        return this.httpClient.post(this.parseURL + 'classes/' + ParseClasses.BOOKMARKS, bookMarkDTO, this.createHttpOptions());
    }

    // start social
    public getAllUsers() {
        var subject = new Subject<UserDTO[]>();
        let query = encodeURI('{"email": {"$ne":"' + this.appStorageService.getUserDTO().email + '"}}');
        this.httpClient.get(this.parseURL + ParseClasses.USER + '?where=' + query, this.createHttpOptions())
            .subscribe((res: any) => {
                let usersDTO: UserDTO[] = [];
                res.forEach(user => {
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
        return this.httpClient.get(this.parseURL + ParseClasses.USER + '/getUnconnectedUsers', this.createHttpOptions());
    }

    public getMyConnectedUsers() {
        return this.httpClient.get(this.parseURL + ParseClasses.USER + '/getMyConnections', this.createHttpOptions())
    }

    public addConenction(reuqestedUserDTO: UserDTO) {
        let connectionDTO: ConnectionDTO = new ConnectionDTO();
        connectionDTO.firstUserId = this.appStorageService.getUserDTO().objectId;
        connectionDTO.secondUserId = reuqestedUserDTO.objectId;
        connectionDTO.firstUserAccepted = true;
        connectionDTO.secondUserAccepted = false;
        return this.httpClient.post(this.parseURL + ParseClasses.CONNECTIONS + '/addConnection', connectionDTO, this.createHttpOptions());
    }

    public getMyPendingConnection() {
        return this.httpClient.get(this.parseURL + ParseClasses.CONNECTIONS + '/getPendingConnections', this.createHttpOptions());
    }

    public getReceivedConnections() {
        return this.httpClient.get(this.parseURL + ParseClasses.CONNECTIONS + '/getReceivedConnections', this.createHttpOptions());
    }

    public getMyConnections() {
        return this.httpClient.get(this.parseURL + ParseClasses.CONNECTIONS + '/getMyConnections', this.createHttpOptions());
    }

    public getUsersByIds(userIds: any[]) {
        return this.httpClient.post(this.parseURL + ParseClasses.USER + '/getUsersByIds', userIds, this.createHttpOptions());
    }

    public acceptConnection(connectionDTO: ConnectionDTO) {
        return this.httpClient.put(this.parseURL + ParseClasses.CONNECTIONS + '/acceptConnection/' + connectionDTO.objectId, null, this.createHttpOptions())
    }

    // end social
    /*
        private createHttpOptions() {
            let httpHeaders: HttpHeaders = new HttpHeaders();
            httpHeaders = httpHeaders.append('X-Parse-Application-Id', 'sublime-reader-appId');
            httpHeaders = httpHeaders.append('X-Parse-REST-API-Key', 'sublime-reader-restApiKey');
            return httpHeaders;
        }*/


    private createHttpOptions() {
        let httpHeaders: HttpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + this.appStorageService.getToken());
        let options = {
            headers: httpHeaders,
            // withCredentials: true
        };
        return options;
    }

    private createHttpOptionsBlob() {
        let httpHeaders: HttpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + this.appStorageService.getToken());
        let options = {
            headers: httpHeaders,
            // withCredentials: true,
            responseType: 'blob'
        };
        return options;
    }

    private createHttpOptionsEpub(): any {
        let httpHeaders: HttpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.append('Content-Type', 'application/epub+zip');
        let options = {
            headers: httpHeaders,
            // withCredentials: true
            responseType: 'text'
        };
        return options;
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
                    this.appStorageService.setConnections(res as ConnectionDTO[]);
                }
            );
        }

        if (this.appStorageService.getUserConnections() == null) {
            this.getMyConnectedUsers().subscribe(
                (res: any) => {
                    this.appStorageService.setUserConnections(res as UserDTO[]);
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
    AUTH = 'jwt-controller',
    BOOK = 'book-controller',
    USER = 'user-controller',
    BOOKMARKS = 'Bookmarks',
    CONNECTIONS = 'connection-controller'
}