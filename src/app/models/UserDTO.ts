export class UserDTO {
    objectId;
    username;
    email;
    password;
    sessionToken;
    lastReadBook;
    favoritesBook: string;
    goToLastRead: boolean;
}