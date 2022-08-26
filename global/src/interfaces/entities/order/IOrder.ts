import { Timestamp } from "typeorm";

export interface IOrder {
    id?: string;
    userId: string;
    value: number;
    paymentType: string;
    quantity: number;
    status: string;
    createdAt: Timestamp;
}