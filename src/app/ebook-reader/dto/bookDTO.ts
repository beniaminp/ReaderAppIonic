import {BookmarkDTO} from "./bookmarkDTO";

export class BookDTO {
    title: string;
    uniqueIdentifier: string;
    bookmarks: BookmarkDTO[] = [];
    fileUrl;
    userId;
    // file infos
    fileId: string
    fileName: string;
    bookContent;
    fileUrlName: any;
    objectId: any;
}