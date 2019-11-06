import {BookDTO} from "./BookDTO";

export class SharedBookDTO {
    public objectId: string;

    public fromUser: string;

    public toUser: string;

    public bookId: string;

    public daysToShare: string;

    public startDate: number;

    public bookDTO: BookDTO;
}