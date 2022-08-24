// import * as Joi from 'joi;'
import * as Hapi from 'hapi';
import { UserController } from './user-controller';

const routePrefix = '/user';

export function startRoute (server: Hapi.Server) {
    const userController = new UserController();
    server.bind(userController);

    server.route({
        method: "GET",
        path: `${routePrefix}/create`,
        options:{
            handler: userController.createUser,
            auth: false,
            tags: ['api', 'user'],
            description: 'Route to create a regular user',
            validate: {
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