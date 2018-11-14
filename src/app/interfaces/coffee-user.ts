export interface User {
    uid: string;
    email: string;
    isAdmin: boolean;
    emailVerified: boolean;
    providerId: any;
    firstName?: string;
    lastName?: string;
    displayName?: string;
}