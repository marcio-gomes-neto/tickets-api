import * as Hapi from 'hapi';
import * as ItemValidator from './item-validator';
import { IServerConfiguration } from 'global-database';

import { ItemController } from './item-controller';

export function startRoute (server: Hapi.Server, configs: IServerConfiguration) {
    const itemController = new ItemController(configs);
    server.bind(itemController);

    server.route({
        method: "post",
        path: `/add-ticket`,
        options:{
            handler: itemController.addTicketInOpenOrder,
            auth: "jwt",
            tags: ['api', 'item'],
            description: 'Route to add an item in the open order',
            validate: {
                headers: ItemValidator.jwtValidator,
                payload: ItemValidator.AddItemValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Order paid.'
                        },
                        '400': {
                            description: 'Order is empty.'
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
        path: `/remove-ticket`,
        options:{
            handler: itemController.removeItemInOpenOrder,
            auth: "jwt",
            tags: ['api', 'item'],
            description: 'Route to add an item in the open order',
            validate: {
                headers: ItemValidator.jwtValidator,
                payload: ItemValidator.RemoveItemValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Order paid.'
                        },
                        '400': {
                            description: 'Order is empty.'
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