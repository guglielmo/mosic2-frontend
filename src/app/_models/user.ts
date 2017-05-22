export class User {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    eMail: string;
    registrationDate: string;
    password: string;
    repeatPassword: string;
    capabilities: string[]; // ['manageusers']
    id_groups: number;
}