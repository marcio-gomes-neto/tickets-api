import { Timestamp } from "typeorm";

export interface ITicket {
    id?: string;
    name: string;
    description: string;
    genre: string;
    type: string;
    quantity: number;
    price: number;
    eventDate: Timestamp;
    active: boolean;
    createdAt: Timestamp;
}