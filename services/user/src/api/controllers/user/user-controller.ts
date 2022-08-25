import * as Hapi from 'hapi';
import Boom from 'boom';
import * as documentValidator from 'cpf-cnpj-validator'; 

import { CreateUserRequest } from "../../../interfaces/api/request";
import { UserService } from '../../services/UserService';
import { IUser } from 'global-database';

export class UserController {
    private userService = new UserService();

    async createUser(request: CreateUserRequest, h: Hapi.ResponseToolkit){
        const {cpf, name, email, admin} = request.payload;
        const userPayload:IUser = {
            cpf,
            name,
            email,
            admin
        };

        if(admin){
            //when creating an admin, it need an authorization to do so.
            return Boom.unauthorized('Requires authorization to create admin user');
        }

        if(!documentValidator.cpf.isValid(cpf)) return Boom.badRequest('Invalid CPF.')
        
        try {
            const checkIfUserExists = await this.userService.findUserByCpf(cpf);
            if(checkIfUserExists) return Boom.badRequest('This User Already Exists.')

            const userCreated = await this.userService.createNewUser(userPayload);
            return h.response(userCreated).code(201);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');   
        }
    }
}