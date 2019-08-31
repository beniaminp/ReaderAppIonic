import {BookmarkDTO} from "./bookmarkDTO";

export class BookDTO {
    title: string;
    uniqueIdentifier: string;
    bookmarks: BookmarkDTO[] = [];
}