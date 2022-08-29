import * as Hapi from 'hapi';
import { IServerConfiguration } from 'global-database';
import Boom from 'boom';

import { AdminUserService } from '../../services/AdminUserService';
import { BlockUserRequest, getAllUsers, UnblockUserRequest } from '../../../interfaces/admin/request';
import { UserService } from '../../services/UserService';

export class AdminController {
    private adminUserService = new AdminUserService();
    private userService = new UserService();

    constructor(private config:IServerConfiguration){}

    async getAllUsers(request: getAllUsers, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        const { status } = request.params;
        let response;

        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.notFound('User not found.');
            if (!findUser.admin) return Boom.unauthorized('Admin level necessary.');
            
            if (!status){
                const allUsers = await this.adminUserService.getAllUsers();
                if(!allUsers) return h.response({success: true, message: 'No users found'}).code(202);

                response = {
                    success: true,
                    users: allUsers
                };
            } else {
                const allUsersByStatus = await this.adminUserService.getAllUsersByStatus(status);
                if(!allUsersByStatus) return h.response({success: true, message: 'No users found'}).code(202);

                response = {
                    success: true,
                    users: allUsersByStatus
                };
            }
            
            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');   
        }
    }

    async blockUser(request: BlockUserRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        const { id, cpf, email } = request.payload;

        if (!userId) return Boom.unauthorized('Missing user ID.');
        if (!cpf && !email && !id) return Boom.badRequest('No identifier sent.');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.notFound('User not found.');
            if (!findUser.admin) return Boom.unauthorized('Admin level necessary.');

            const findEvilUser = id ? await this.userService.findUserById(id) : 
            cpf ? await this.userService.findUserByCpf(cpf) :
            await this.userService.findUserByEmail(email);
            
            if (!findEvilUser) return Boom.notFound('User not found.');
            if (findEvilUser.status === 'blocked') return Boom.notAcceptable('User already blocked');

            findEvilUser.status = 'blocked';
            await this.userService.saveUserUpdates(findEvilUser);

            const response = {
                success: true,
                message: 'User blocked',
                user: id? id : cpf ? cpf : email
            };
            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');   
        }
    }

    async unblockUser(request: UnblockUserRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        const { id, cpf, email } = request.payload;

        if (!userId) return Boom.unauthorized('Missing user ID.');
        if (!cpf && !email && !id) return Boom.badRequest('No identifier sent.');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.notFound('User not found.');
            if (!findUser.admin) return Boom.unauthorized('Admin level necessary.');

            const findForgivenUser = id ? await this.userService.findUserById(id) : 
            cpf ? await this.userService.findUserByCpf(cpf) :
            await this.userService.findUserByEmail(email);

            if (!findForgivenUser) return Boom.notFound('User not found.');
            if (findForgivenUser.status !== 'blocked') return Boom.notAcceptable('User is not blocked.');

            findForgivenUser.status = 'active';
            await this.userService.saveUserUpdates(findForgivenUser);

            const response = {
                success: true,
                message: 'User unblocked',
                user: id? id : cpf ? cpf : email
            };
            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');   
        }
    }
}