import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BookDTO} from "../ebook-reader/dto/BookDTO";
import {Subject} from "rxjs";
import {UserDTO} from "../models/UserDTO";
import {AppStorageService} from "../er-local-storage/app-storage.service";
import {BookmarkDTO} from "../ebook-reader/dto/BookmarkDTO";
import {ConnectionDTO} from "../models/ConnectionDTO";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class HttpParseService {
    public parseURL = 'http://' + window.location.hostname + ':8080/';

    // public parseURL = 'http://vps658548.ovh.net:8080/';

    constructor(private httpClient: HttpClient,
                public appStorageService: AppStorageService) {

    }

    public loginUser(userDTO: UserDTO) {
        var subject = new Subject<UserDTO>();

        this.httpClient.post(this.parseURL + RestControllers.AUTH + '/authenticate', {
            username: userDTO.email,
            password: userDTO.password
        }).subscribe(
            (res: any) => {
                this.appStorageService.setToken(res.token);
                this.httpClient.get(this.parseURL + RestControllers.USER + '/getUser', this.createHttpOptions()).subscribe(
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

        this.httpClient.post(this.parseURL + RestControllers.AUTH + '/signup', user).subscribe(
            (res: any) => {
                this.appStorageService.setToken(res.token);
                this.httpClient.get(this.parseURL + RestControllers.USER + '/getUser').subscribe(
                    (userDTO: UserDTO) => {
                        subject.next(userDTO);
                    }
                )
            }
        );
        return subject.asObservable();
    }

    // start books
    public uploadFile(byteArrayFile, fileName) {
        return this.httpClient.post(this.parseURL + RestControllers.BOOK + '/uploadFile/' + fileName, byteArrayFile, this.createHttpOptionsEpub());
    }

    public addBook(bookDTO: BookDTO) {
        var subject = new Subject<BookDTO>();
        let userDTO = this.appStorageService.getUserDTO();
        this.uploadFile(bookDTO.bookContent, bookDTO.fileName).subscribe(
            (res: any) => {
                bookDTO.fileUrl = res;
                bookDTO.fileUrlName = bookDTO.fileName;
                bookDTO.userId = userDTO.objectId;

                this.httpClient.post(this.parseURL + RestControllers.BOOK + '/addBook', bookDTO, this.createHttpOptions())
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

        this.httpClient.get(this.parseURL + RestControllers.BOOK + '/getBooks')
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

    public getSharedWithMeBooks() {
        var subject = new Subject<BookDTO[]>();

        this.httpClient.get(this.parseURL + RestControllers.BOOK + '/getSharedWithMeBooks')
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
        return this.httpClient.get(this.parseURL + RestControllers.BOOK + '/getBookById?bookId=' + bookId);
    }

    public booksCount() {
        return this.httpClient.get(this.parseURL + RestControllers.BOOK + '/booksCount');
    }

    public getBookContent(bookUrl: string) {
        return this.httpClient.get(bookUrl, {responseType: 'blob'});
    }

    public deleteBook(bookDTO: BookDTO) {
        return this.httpClient.delete(this.parseURL + RestControllers.BOOK + '/deleteBook/' + bookDTO.objectId);

    }

    public updateLastCfi(bookId: string, lastCfi: string) {
        return this.httpClient.put(this.parseURL + RestControllers.BOOK + '/updateLastCfi/' + bookId + '?lastCfi=' + encodeURI(lastCfi), null);
    }

    // end books

    public updateLastReadBook(bookDTO: BookDTO) {
        let userDTO = this.appStorageService.getUserDTO();

        userDTO.lastReadBook = bookDTO.objectId;
        this.appStorageService.setUserDTO(userDTO);

        return this.httpClient.put(this.parseURL + RestControllers.USER + '/updateLastReadBook?lastReadBook=' + bookDTO.objectId, null, {headers: this.createFullHeaders()});
    }

    public updateFontSize(fontSize) {
        this.appStorageService.setFontSize(fontSize);
        return this.httpClient.put(this.parseURL + RestControllers.USER + '/updateFontSize?fontSize=' + fontSize, null, {headers: this.createFullHeaders()});
    }

    public updateTextColor(textColor) {
        this.appStorageService.setTextColor(textColor);
        return this.httpClient.put(this.parseURL + RestControllers.USER + '/updateTextColor?textColor=' + textColor, null, {headers: this.createFullHeaders()})
    }

    public updateBackgroundColor(backgroundColor) {
        this.appStorageService.setBackgroundColor(backgroundColor);

        return this.httpClient.put(this.parseURL + RestControllers.USER + '/updateBackgroundColor?backgroundColor=' + backgroundColor, null, {headers: this.createFullHeaders()})
    }

    public updateTextBold(isBold: boolean) {
        this.appStorageService.setTextBold(isBold);
        return this.httpClient.put(this.parseURL + RestControllers.USER + '/updateTextBold?isBold=' + isBold, null, {headers: this.createFullHeaders()});
    }

    public updateTextItalic(isItalic: boolean) {
        this.appStorageService.setTextItalic(isItalic);
        return this.httpClient.put(this.parseURL + RestControllers.USER + '/updateTextItalic?isItalic=' + isItalic, null, {headers: this.createFullHeaders()});
    }

    public updateNavigationControl(showNavigationControl: boolean) {
        this.appStorageService.setNavigationControl(showNavigationControl);
        return this.httpClient.put(this.parseURL + RestControllers.USER + '/updateNavigationControl?showNavigationControl=' + showNavigationControl, null, {headers: this.createFullHeaders()});
    }

    public updateTheme(theme: string) {
        this.appStorageService.setTheme(theme);
        return this.httpClient.put(this.parseURL + RestControllers.USER + '/updateTheme?theme=' + theme, null, {headers: this.createFullHeaders()});
    }

    public updateFavoritesBooks(favoriteBooks: string[], userDTO: UserDTO) {
        this.appStorageService.setUserDTO(userDTO);
        return this.httpClient.put(this.parseURL + RestControllers.USER + '/updateFavoritesBooks', favoriteBooks, {headers: this.createFullHeaders()});
    }

    public updateOpenLastRead(userDTO: UserDTO) {
        this.appStorageService.setUserDTO(userDTO);
        return this.httpClient.put(this.parseURL + RestControllers.USER + '/updateOpenLastRead/?goToLastRead=' + userDTO.goToLastRead, null, {headers: this.createFullHeaders()});
    }

    public getBookmarks(bookDTO: BookDTO) {
        return this.httpClient.get(this.parseURL + RestControllers.BOOKMARKS + '/getBookmarks?bookId=' + bookDTO.objectId);
    }

    public deleteBookMark(bookMarkDTO: BookmarkDTO) {
        return this.httpClient
            .delete(this.parseURL + RestControllers.BOOKMARKS + '/deleteBookmark/' + bookMarkDTO.objectId);
    }

    public addBookmark(bookMarkDTO: BookmarkDTO) {
        return this.httpClient.post(this.parseURL + RestControllers.BOOKMARKS + '/addBookmark', bookMarkDTO, this.createHttpOptions());
    }

    // start social
    public getAllUsers() {
        var subject = new Subject<UserDTO[]>();
        let query = encodeURI('{"email": {"$ne":"' + this.appStorageService.getUserDTO().email + '"}}');
        this.httpClient.get(this.parseURL + RestControllers.USER + '?where=' + query, this.createHttpOptions())
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
        return this.httpClient.get(this.parseURL + RestControllers.USER + '/getUnconnectedUsers', this.createHttpOptions());
    }

    public getMyConnectedUsers() {
        return this.httpClient.get(this.parseURL + RestControllers.USER + '/getMyConnections', this.createHttpOptions())
    }

    public addConenction(reuqestedUserDTO: UserDTO) {
        let connectionDTO: ConnectionDTO = new ConnectionDTO();
        connectionDTO.firstUserId = this.appStorageService.getUserDTO().objectId;
        connectionDTO.secondUserId = reuqestedUserDTO.objectId;
        connectionDTO.firstUserAccepted = true;
        connectionDTO.secondUserAccepted = false;
        return this.httpClient.post(this.parseURL + RestControllers.CONNECTIONS + '/addConnection', connectionDTO, this.createHttpOptions());
    }

    public getMyPendingConnection() {
        return this.httpClient.get(this.parseURL + RestControllers.CONNECTIONS + '/getPendingConnections', this.createHttpOptions());
    }

    public getReceivedConnections() {
        return this.httpClient.get(this.parseURL + RestControllers.CONNECTIONS + '/getReceivedConnections', this.createHttpOptions());
    }

    public getMyConnections() {
        return this.httpClient.get(this.parseURL + RestControllers.CONNECTIONS + '/getMyConnections', this.createHttpOptions());
    }

    public getUsersByIds(userIds: any[]) {
        return this.httpClient.post(this.parseURL + RestControllers.USER + '/getUsersByIds', userIds, this.createHttpOptions());
    }

    public acceptConnection(connectionDTO: ConnectionDTO) {
        return this.httpClient.put(this.parseURL + RestControllers.CONNECTIONS + '/acceptConnection/' + connectionDTO.objectId, null, this.createHttpOptions())
    }

    public connectionsCount() {
        return this.httpClient.get(this.parseURL + RestControllers.CONNECTIONS + '/connectionsCount');
    }

    public shareWithUser(user: UserDTO, book: BookDTO) {
        return this.httpClient.put(this.parseURL + RestControllers.CONNECTIONS + '/shareBookWithUser/' + user.objectId + '/' + book.objectId + '/10', null);
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
        } else {
            this.connectionsCount().subscribe(
                (res: number) => {
                    if (this.appStorageService.getUserConnections().length != res) {
                        this.getMyConnectedUsers().subscribe(
                            (res: any) => {
                                this.appStorageService.setUserConnections(res as UserDTO[]);
                            }
                        );
                    }
                }
            )
        }

        if (this.appStorageService.getBooks() == null) {
            this.getBooksForUser().subscribe(
                (books) => {
                    this.appStorageService.setBooks(books);
                }
            )
        } else {
            this.booksCount().subscribe(
                (res: number) => {
                    if (this.appStorageService.getBooks().length != res) {
                        this.getBooksForUser().subscribe(
                            (books) => {
                                this.appStorageService.setBooks(books);
                            }
                        )
                    }
                }
            )
        }
    }
}


export enum RestControllers {
    AUTH = 'jwt-controller',
    BOOK = 'book-controller',
    USER = 'user-controller',
    BOOKMARKS = 'bookmarks-controller',
    CONNECTIONS = 'connection-controller'
}