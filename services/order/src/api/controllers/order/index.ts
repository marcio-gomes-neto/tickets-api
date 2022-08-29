import * as Hapi from 'hapi';
import * as OrderValidator from './order-validator';
import { IServerConfiguration } from 'global-database';

import { OrderController } from './order-controller';

export function startRoute (server: Hapi.Server, configs: IServerConfiguration) {
    const orderController = new OrderController(configs);
    server.bind(orderController);

    server.route({
        method: "post",
        path: `/create-order`,
        options:{
            handler: orderController.createNewOrder,
            auth: "jwt",
            tags: ['api', 'order'],
            description: 'Route to create a new user order',
            validate: {
                headers: OrderValidator.jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            description: 'Order created.'
                        },
                        '404': {
                            description: 'User not found.'
                        },
                        '401':{
                            description: 'Missing authorization.'
                        },
                        '400':{
                            description: 'Already have a open order.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "get",
        path: `/get-all-orders`,
        options:{
            handler: orderController.findAllUserOrders,
            auth: "jwt",
            tags: ['api', 'order'],
            description: 'Route find all user orders',
            validate: {
                headers: OrderValidator.jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            description: 'Event created.'
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
        path: `/get-order/{id}`,
        options:{
            handler: orderController.findOrderItems,
            auth: "jwt",
            tags: ['api', 'order'],
            description: 'Route to find a specific order and items',
            validate: {
                headers: OrderValidator.jwtValidator,
                params: OrderValidator.findOrderValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Order and its items.'
                        },
                        '404': {
                            description: 'Order not found.'
                        },
                        '401':{
                            description: 'This order belongs to another user.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "get",
        path: `/get-open-order`,
        options:{
            handler: orderController.findUserOpenOrder,
            auth: "jwt",
            tags: ['api', 'order'],
            description: 'Route to find the user open order',
            validate: {
                headers: OrderValidator.jwtValidator,
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            description: 'Open order.'
                        },
                        '202': {
                            description: 'No open order.'
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
        path: `/cancel-order`,
        options:{
            handler: orderController.cancelOpenOrder,
            auth: "jwt",
            tags: ['api', 'order'],
            description: 'Route to cancel the open order',
            validate: {
                headers: OrderValidator.jwtValidator,
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            description: 'Order canceled.'
                        },
                        '202': {
                            description: 'No open order.'
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
        path: `/pay-order`,
        options:{
            handler: orderController.payOpenOrder,
            auth: "jwt",
            tags: ['api', 'order'],
            description: 'Route to pay the open order',
            validate: {
                headers: OrderValidator.jwtValidator,
                payload: OrderValidator.payOrderValidator
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