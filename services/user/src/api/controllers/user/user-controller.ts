import * as Hapi from 'hapi';
import * as documentValidator from 'cpf-cnpj-validator'; 
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'
import { sign } from 'jsonwebtoken';
import { IServerConfiguration, IUser } from 'global-database';
import Boom from 'boom';

import { ChangePassword, CreateUserRequest, DeactivateAccount, GetUserData, LoginUserRequest, ReactivateAccount, UpdateUser, ValidateUser } from "../../../interfaces/user/request";
import { UserService } from '../../services/UserService';

export class UserController {
    private userService = new UserService();

    constructor(private config:IServerConfiguration){}

    private generateJwtToken(user:IUser){
        const signInRequest = {id: user.id}
        const token = sign(signInRequest, this.config.jwt.privateKey, {
            expiresIn: this.config.jwt.expiration,
            algorithm: this.config.jwt.algorithm
        })
        return token;
    }

    private async validateUserPassword(payloadPassword: string, userPassword: string){
        return await bcrypt.compare(payloadPassword, userPassword);
    }

    async loginUser(request: LoginUserRequest, h: Hapi.ResponseToolkit){
        const { cpf, email, password } = request.payload;

        if(cpf && !documentValidator.cpf.isValid(cpf)) return Boom.badRequest('Invalid CPF.');
        try {
            const findUser = cpf ? await this.userService.findUserByCpf(cpf) : 
            await this.userService.findUserByEmail(email);
            if(!findUser){
                return Boom.notFound(`User not found to given ${cpf ? 'cpf' : 'email'}.`);
            }

            if(findUser.status === 'blocked') return Boom.unauthorized('User blocked.');

            const checkPassword = await this.validateUserPassword(password, findUser.password);
            if(!checkPassword){
                return Boom.unauthorized(`Invalid password.`);
            }

            const token = await this.generateJwtToken(findUser)
            const response = {
                success: true,
                login: cpf? cpf : email,
                userStatus: findUser.status,
                token: token,
            }

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');  
        }
    }

    async verifyUser( request: ValidateUser, h: Hapi.ResponseToolkit){
        const { emailVerification } = request.params;
        
        try {
            const findUser = await this.userService.findUserByEmailVerification(emailVerification);
            if (!findUser) return Boom.notFound('User not found.')
            if (findUser.status !== 'waiting-verification') return Boom.conflict('User already verified.');

            const activatedUser = await this.userService.activateUser(findUser);
            const response = {
                success: true,
                payload: {
                    id: activatedUser.id,
                    cpf: activatedUser.cpf,
                    email: activatedUser.email,
                    status: activatedUser.status,
                }
            };

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');  
        }
    }

    async createUser(request: CreateUserRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        const { cpf, password, confirmPassword, name, email, admin, phone } = request.payload;
        const salt = await bcrypt.genSalt(10);
        const userPayload:IUser = {
            cpf,
            name,
            email,
            emailVerification: uuidv4(),
            admin,
            password: await bcrypt.hash(password, salt),
            phone,
            status: 'waiting-verification'
        };

        if(admin){
            if(!userId) return Boom.unauthorized('Requires authorization to create admin user');
            try {
                const findAdmin = await this.userService.findUserById(userId);
                if (!findAdmin) return Boom.notFound('User not found.');
                if (!findAdmin.admin) return Boom.unauthorized('Admin level necessary.');
            } catch (error) {
                console.log(error);
                return Boom.badRequest('Unexpected Error');  
            }
        }

        if(password !== confirmPassword) return Boom.badRequest('Password do not match.')
        if(!documentValidator.cpf.isValid(cpf)) return Boom.badRequest('Invalid CPF.');
        
        try {
            const checkForCpf = await this.userService.findUserByCpf(cpf);
            if(checkForCpf) return Boom.badRequest('This user already exists.');

            const checkForEmail = await this.userService.findUserByEmail(email);
            if(checkForEmail) return Boom.badRequest('This email already taken.');

            const userCreated = await this.userService.createNewUser(userPayload);
            const response = {
                success: true,
                payload: {
                    id: userCreated.id,
                    cpf: userCreated.cpf,
                    email: userCreated.email,
                    admin: userCreated.admin
                }
            } 

            return h.response(response).code(201);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');   
        }
    }

    async updateUser(request: UpdateUser, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        const { name, phone } = request.payload;
        
        if (!userId) return Boom.unauthorized('Missing user ID');
        if (!name && !phone) return h.response('No change.').code(202);

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.notFound('User not found.');
            if (findUser.status !== 'active') return Boom.unauthorized('User needs to be active.');

            name ? findUser.name = name : undefined;
            phone ? findUser.phone = phone : undefined;
            
            await this.userService.saveUserUpdates(findUser);
            const response = {
                success: true,
                payload: {
                    id: findUser.id,
                    name: findUser.name,
                    phone: findUser.phone
                }
            }

            return h.response(response).code(200)
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');   
        }
    }

    async getUserData(request: GetUserData, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.notFound('User not found.');

            const response = {
                success: true,
                payload: {
                    cpf: findUser.cpf,
                    email: findUser.email,
                    name: findUser.name,
                    phone: findUser.phone,
                    status: findUser.status
                }
            };
            
            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error'); 
        }
    }

    async changePassword(request: ChangePassword, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        const { password, newPassword, confirmNewPassword } = request.payload
        const salt = await bcrypt.genSalt(10);

        if (!userId) return Boom.unauthorized('Missing user ID');
        if (newPassword !== confirmNewPassword) return Boom.unauthorized('New password do not match.');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.notFound('User not found.');
            if (findUser.status !== 'active') return Boom.unauthorized('User needs to be active.');

            const checkPassword = await this.validateUserPassword(password, findUser.password);
            if(!checkPassword){
                return Boom.unauthorized(`Invalid password.`);
            }

            findUser.password = await bcrypt.hash(newPassword, salt);
            await this.userService.saveUserUpdates(findUser);

            return h.response({success: true, message: 'Password changed.'}).code(200)
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error'); 
        }
    }

    async deactivateAccount(request:DeactivateAccount, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.notFound('User not found.');

            if (findUser.status !== 'active') return Boom.unauthorized('Cannot deactivate this account');
            const deactivateUser = await this.userService.deactivateUser(findUser);
            const response = {
                success: true,
                payload: {
                    cpf: deactivateUser.cpf,
                    email: deactivateUser.email,
                    status: deactivateUser.status
                }
            }

            return h.response(response).code(200)

        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error'); 
        }
    }

    async reactivateAccount(request:ReactivateAccount, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.notFound('User not found.');

            if (findUser.status !== 'inactive') return Boom.unauthorized('Cannot activate this account');
            const reactivateUser = await this.userService.activateUser(findUser);
            const response = {
                success: true,
                payload: {
                    cpf: reactivateUser.cpf,
                    email: reactivateUser.email,
                    status: reactivateUser.status
                }
            }

            return h.response(response).code(200)
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');
        }
    }
}