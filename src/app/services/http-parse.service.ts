import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BookDTO} from "../ebook-reader/dto/bookDTO";
import {BookFileDTO} from "../ebook-reader/dto/BookFileDTO";
import {Subject} from "rxjs";
import {UserDTO} from "../models/UserDTO";
import {AppStorageService} from "./app-storage.service";

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

    public uploadFile(byteArrayFile, fileName) {
        let headers: HttpHeaders = this.createHeaders();
        headers = headers.append('Content-Type', 'application/epub+zip ');
        return this.httpClient.post(this.parseURL + 'files/' + fileName, byteArrayFile, {headers: headers});
    }

    public addBook(bookDTO: BookDTO) {
        var subject = new Subject<BookDTO>();
        this.uploadFile(bookDTO.bookContent, bookDTO.fileName).subscribe(
            (res: any) => {
                bookDTO.fileUrl = res.url;
                bookDTO.fileUrlName = res.name;

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
        this.appStorageService.getUserDTO().then(
            (userDTO: UserDTO) => {
                let query = encodeURI('{"userId": "' + userDTO.objectId + '"}');
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

    private createHeaders() {
        let httpHeaders: HttpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.append('X-Parse-Application-Id', 'lkECc2ZtoxfhBlTTY7Flq2iCSFDZs4H608qmoOSV');
        httpHeaders = httpHeaders.append('X-Parse-REST-API-Key', 'luoPAzqoXsd88o1wtKkYo6qyGnTy2kDFhzOGM7Mv');
        return httpHeaders;
    }
}


export enum ParseClasses {
    BOOK = 'Book'
}