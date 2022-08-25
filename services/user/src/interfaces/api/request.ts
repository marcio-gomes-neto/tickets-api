export interface CreateUserRequest extends Request {
    payload: {
        cpf: string;
        name: string;
        email: string;
        admin: boolean;
    }
} 