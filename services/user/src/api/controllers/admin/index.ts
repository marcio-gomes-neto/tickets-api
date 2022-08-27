// import * as Joi from 'joi;'
import * as Hapi from 'hapi';
import * as AdminValidator from './admin-validator';
import { IServerConfiguration } from 'global-database';

import { AdminController } from './admin-controller';

export function startRoute (server: Hapi.Server, configs: IServerConfiguration) {
    const adminController = new AdminController(configs);
    server.bind(adminController);

    server.route({
        method: "get",
        path: `/admin/getAllUsers/{status?}`,
        options:{
            handler: adminController.getAllUsers,
            auth: "jwt",
            tags: ['api', 'user', 'admin'],
            description: 'Route to get all users, can find by status',
            validate: {
                headers: AdminValidator.jwtValidator,
                params: AdminValidator.getAllUsersValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Get user data.'
                        },
                        '401':{
                            description: 'Missing authorization.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "post",
        path: `/admin/blockUser`,
        options:{
            handler: adminController.blockUser,
            auth: "jwt",
            tags: ['api', 'user', 'admin'],
            description: 'Route to block a user',
            validate: {
                headers: AdminValidator.jwtValidator,
                payload: AdminValidator.blockUserValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Get user data.'
                        },
                        '406': {
                            description: 'User Already Blocked.'
                        },
                        '401':{
                            description: 'Missing authorization.'
                        }
                    }
                }
            }
        }
    });
    
    server.route({
        method: "post",
        path: `/admin/unblockUser`,
        options:{
            handler: adminController.unblockUser,
            auth: "jwt",
            tags: ['api', 'user', 'admin'],
            description: 'Route to unblock a user',
            validate: {
                headers: AdminValidator.jwtValidator,
                payload: AdminValidator.unblockUserValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'User unblocked.'
                        },
                        '406': {
                            description: 'User is not blocked.'
                        },
                        '401':{
                            description: 'Missing authorization.'
                        }
                    }
                }
            }
        }
    });
}