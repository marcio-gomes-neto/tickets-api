import * as Hapi from 'hapi';
import * as UserValidator from './user-validator';
import { IServerConfiguration } from 'global-database';

import { UserController } from './user-controller';

export function startRoute (server: Hapi.Server, configs: IServerConfiguration) {
    const userController = new UserController(configs);
    server.bind(userController);

    server.route({
        method: "POST",
        path: `/create`,
        options:{
            handler: userController.createUser,
            auth: "jwt",
            tags: ['api', 'user'],
            description: 'Route to create a regular user',
            validate: {
                headers: UserValidator.optionalJwtValidator,
                payload: UserValidator.createUserValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            description: 'Success.'
                        },
                        '401': {
                            description: 'Unauthorized.'
                        },
                        '422': {
                            description: 'Missing or invalid data.'
                        },
                    }
                }
            }
        }
    });

    server.route({
        method: "POST",
        path: `/login`,
        options:{
            handler: userController.loginUser,
            auth: false,
            tags: ['api', 'user'],
            description: 'Route to login users',
            validate: {
                payload: UserValidator.loginUserValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'User logged in.'
                        },
                        '401':{
                            description: 'Wrong password.'
                        },
                        '404': {
                            description: 'User not found.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "post",
        path: `/verify-user/{emailVerification}`,
        options:{
            handler: userController.verifyUser,
            auth: false,
            tags: ['api', 'user'],
            description: 'Route to activate user account',
            validate: {
                params: UserValidator.validateUserValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'User activated.'
                        },
                        '404': {
                            description: 'User not found.'
                        },
                        '409': {
                            description: 'User already activated.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "patch",
        path: `/update-user`,
        options:{
            handler: userController.updateUser,
            auth: "jwt",
            tags: ['api', 'user'],
            description: 'Route to update user info',
            validate: {
                headers: UserValidator.jwtValidator,
                payload: UserValidator.updateUserValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'User updated.'
                        },
                        '202':{
                            description: 'No change.'
                        },
                        '404': {
                            description: 'User not found.'
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
        method: "get",
        path: `/get-user`,
        options:{
            handler: userController.getUserData,
            auth: "jwt",
            tags: ['api', 'user'],
            description: 'Route to get connected user data',
            validate: {
                headers: UserValidator.jwtValidator,
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Get user data.'
                        },
                        '404': {
                            description: 'User not found.'
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
        method: "patch",
        path: `/change-password`,
        options:{
            handler: userController.changePassword,
            auth: "jwt",
            tags: ['api', 'user'],
            description: 'Route to change user password',
            validate: {
                headers: UserValidator.jwtValidator,
                payload: UserValidator.changePassword
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Get user data.'
                        },
                        '404': {
                            description: 'User not found.'
                        },
                        '401':{
                            description: 'Missing authorization or Password do not match.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "post",
        path: `/deactivate-account`,
        options:{
            handler: userController.deactivateAccount,
            auth: "jwt",
            tags: ['api', 'user'],
            description: 'Route deactivate a user',
            validate: {
                headers: UserValidator.jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Get user data.'
                        },
                        '404': {
                            description: 'User not found.'
                        },
                        '401':{
                            description: 'Missing authorization or Password do not match.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "post",
        path: `/reactivate-account`,
        options:{
            handler: userController.reactivateAccount,
            auth: "jwt",
            tags: ['api', 'user'],
            description: 'Route to reactivate a user that as been previously deactivated',
            validate: {
                headers: UserValidator.jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Get user data.'
                        },
                        '404': {
                            description: 'User not found.'
                        },
                        '401':{
                            description: 'Missing authorization or Password do not match.'
                        }
                    }
                }
            }
        }
    });
}