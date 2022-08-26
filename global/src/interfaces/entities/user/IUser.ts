import { Timestamp } from "typeorm";

export interface IUser {
    id?: string;
    cpf: string;
    email: string;
    emailVerification: string;
    password: string;
    name: string;
    phone: string;
    status: string;
    admin: boolean;
    createdAt: Timestamp;
}