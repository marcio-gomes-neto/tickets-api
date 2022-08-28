import { Request } from "hapi";

export interface CreateUserRequest extends Request {
    authId?:{
        userId: string;
    }

    payload: {
        cpf: string;
        name: string;
        email: string;
        admin: boolean;
        password: string;
        confirmPassword: string;
        phone: string;
    }
} 

export interface LoginUserRequest extends Request{
    payload: {
        cpf?: string;
        email?: string;
        password: string;
    }
}

export interface ValidateUser extends Request{
    params: {
        emailVerification: string;
    }
}

export interface UpdateUser extends Request{
    authId:{
        userId: string;
    }

    payload:{
        name: string;
        phone: string;
    }
}

export interface GetUserData extends Request {
    authId:{
        userId: string;
    }
}

export interface ChangePassword extends Request {
    authId:{
        userId: string;
    }

    payload: {
        password: string;
        newPassword: string;
        confirmNewPassword: string;
    }
}

export interface DeactivateAccount extends Request {
    authId:{
        userId: string;
    }
}
export interface ReactivateAccount extends Request {
    authId:{
        userId: string;
    }
}