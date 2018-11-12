export interface User {
    uid: string;
    email: string;
    isAdmin: boolean;
    firstName?: string;
    lastName?: string;
    displayName?: string;
}