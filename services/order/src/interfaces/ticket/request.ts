import { Request } from "hapi";

export interface CreateNewEventRequest extends Request {
    authId:{
        userId: string;
    }
    payload: {
        name: string;
        description: string;
        genre: string;
        type: string;
        quantity: number;
        price: number;
        eventDate: string;
      }
}

export interface FindAllRawEventsRequest extends Request {
    authId:{
        userId: string;
    }
}

export interface FindEventRequest extends Request {
    authId: {
        userId: string;
    }

    params: {
        id: string;
    }
}

export interface DeactivateEventRequest extends Request {
    authId: {
        userId: string;
    }

    params: {
        id: string;
    }
}

export interface ReactivateEventRequest extends Request {
    authId: {
        userId: string;
    }

    params: {
        id: string;
    }
}

export interface UpdateEventRequest extends Request {
    authId:{
        userId: string;
    }

    params: {
        id: string;
    }

    payload: {
        name?: string;
        description?: string;
        genre?: string;
        type?: string;
        quantity?: number;
        price?: number;
        eventDate?: string;
    }
}