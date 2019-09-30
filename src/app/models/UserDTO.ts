export class UserDTO {
    objectId;
    username;
    email;
    password;
    sessionToken;
    lastReadBook;
    favoritesBook: string;
    goToLastRead: boolean;
    fontSize: any;
    textColor: string;
    backgroundColor: string;
    isBold: boolean;
    isItalic: boolean;
    showNavigationControl: boolean;
}