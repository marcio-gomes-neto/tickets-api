import { Request } from "hapi";

export interface AddTicketInOrderRequest extends Request {
    authId: {
        userId: string;
    }

    payload: {
        id: string;
        quantity: number;
    }
}

export interface RemoveTicketInOrderRequest extends Request {
    authId: {
        userId: string;
    }

    payload: {
        id: string;
        quantity: number;
    }
}