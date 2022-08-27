import { Request } from "hapi";

export interface getAllUsers extends Request{
    authId:{
        userId: string;
    }

    params:{
        status?: string;
    }
}

export interface BlockUserRequest extends Request{
    authId:{
        userId: string;
    }

    payload: {
        id?: string;
        cpf?: string;
        email?: string;
    }
}

export interface UnblockUserRequest extends Request{
    authId:{
        userId: string;
    }

    payload: {
        id?: string;
        cpf?: string;
        email?: string;
    }
}
