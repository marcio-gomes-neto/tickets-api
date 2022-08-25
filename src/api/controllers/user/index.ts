// import * as Joi from 'joi;'
import * as Hapi from 'hapi';
import * as UserValidator from './user-validator';

import { UserController } from './user-controller';

const routePrefix = '/user';

export function startRoute (server: Hapi.Server) {
    const userController = new UserController();
    server.bind(userController);

    server.route({
        method: "POST",
        path: `${routePrefix}/create`,
        options:{
            handler: userController.createUser,
            auth: false,
            tags: ['api', 'user'],
            description: 'Route to create a regular user',
            validate: {
                payload: UserValidator.createUserValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            description: 'Success'
                        },
                        '401': {
                            description: 'Unauthorized'
                        },
                        '422': {
                            description: 'Missing or invalid data'
                        },
                    }
                }
            }
        }
    });
}