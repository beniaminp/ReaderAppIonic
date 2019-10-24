import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap, startWith, retry} from "rxjs/operators";
import {of} from 'rxjs';
import {RequestCache} from './request-cache';

@Injectable({
    providedIn: 'root'
})
export class CachingInterceptor implements HttpInterceptor {
    public toBeCachedUrls = ['book-controller/downloadFile'];

    constructor(private cache: RequestCache) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (this.shouldBeCached(req.url)) {
            const cachedResponse = this.cache.get(req);
            return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next, this.cache);
        } else {
            return next.handle(req);
        }
    }

    sendRequest(
        req: HttpRequest<any>,
        next: HttpHandler,
        cache: RequestCache): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    cache.put(req, event);
                }
            })
        );
    }

    shouldBeCached(url: string): boolean {
        for (const urlString of this.toBeCachedUrls) {
            if (url.toLowerCase().indexOf(urlString.toLowerCase()) >= 0) {
                return true;
            }
        }
        return false;
    }
}