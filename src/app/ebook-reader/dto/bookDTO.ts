import {BookmarkDTO} from "./bookmarkDTO";

export class BookDTO {
    title: string;
    uniqueIdentifier: string;
    bookmarks: BookmarkDTO[] = [];
    // file infos
    fileId: string
    fileName: string;
    bookContent;
    bookCover: string;
}