import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class GenericHttpService {
    private GUTENBERG_URL = "http://www.gutenberg.org/robot/harvest?filetypes[]=epub.images";

    constructor(private httpClient: HttpClient) {
    }

    public getGuttenbergFiles() {
        return this.httpClient.get(this.GUTENBERG_URL, {headers: this.createHeaders()});
    }


    private createHeaders() {
        let httpHeaders: HttpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.append('Access-Control-Allow-Origin', '*');
        return httpHeaders;
    }
}
