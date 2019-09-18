import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BookDTO} from "../ebook-reader/dto/bookDTO";
import {BookFileDTO} from "../ebook-reader/dto/BookFileDTO";
import {Observable, Observer, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HttpParseService {
    public parseURL = 'https://parseapi.back4app.com/files/';

    constructor(private httpClient: HttpClient) {

    }

    private createHeaders() {
        let httpHeaders: HttpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.append('X-Parse-Application-Id', 'lkECc2ZtoxfhBlTTY7Flq2iCSFDZs4H608qmoOSV');
        httpHeaders = httpHeaders.append('X-Parse-REST-API-Key', 'luoPAzqoXsd88o1wtKkYo6qyGnTy2kDFhzOGM7Mv');
        return httpHeaders;
    }

    public uploadFile(byteArrayFile, fileName) {
        let headers: HttpHeaders = this.createHeaders();
        headers = headers.append('Content-Type', 'application/epub+zip ');
        return this.httpClient.post(this.parseURL + fileName, byteArrayFile, {headers: headers});
    }

    public addBook(bookDTO: BookDTO) {
        var subject = new Subject<BookDTO>();
        this.uploadFile(bookDTO.bookContent, bookDTO.fileName).subscribe(
            (res: any) => {
                let bookFileDTO = new BookFileDTO();
                bookDTO.fileUrl = res.url;
                bookDTO.fileUrlName = res.name;

                this.httpClient.post(this.parseURL + ParseClasses.BOOK, bookDTO, {headers: this.createHeaders()})
                    .subscribe((book) => {
                        subject.next(bookDTO);
                    });
            }
        );
        return subject.asObservable();
    }
}


export enum ParseClasses {
    BOOK = 'Book'
}