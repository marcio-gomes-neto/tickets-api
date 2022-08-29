import { Request } from "hapi";

export interface CreateNewOrderRequest extends Request {
    authId:{
        userId: string;
    }
}

export interface FindUserOrdersRequest extends Request {
    authId:{
        userId: string;
    }
}

export interface FindUserOpenOrderRequest extends Request {
    authId:{
        userId: string;
    }
}

export interface CancelOpenOrderRequest extends Request {
    authId:{
        userId: string;
    }
}

export interface FindOrderItemsRequest extends Request {
    authId: {
        userId: string;
    }

    params: {
        id: string;
    }
}

export interface PayOpenOrderRequest extends Request {
    authId: {
        userId: string;
    }

    payload: {
        type: string;
        paymentOptions: string;
    }
}

