import * as Hapi from 'hapi';
import * as TicketValidator from './ticket-validator';
import { IServerConfiguration } from 'global-database';

import { TicketController } from './ticket-controller';

export function startRoute (server: Hapi.Server, configs: IServerConfiguration) {
    const ticketController = new TicketController(configs);
    server.bind(ticketController);

    server.route({
        method: "post",
        path: `/create-event`,
        options:{
            handler: ticketController.createNewEvent,
            auth: "jwt",
            tags: ['api', 'ticket'],
            description: 'Route to create a new event',
            validate: {
                headers: TicketValidator.jwtValidator,
                payload: TicketValidator.createNewEventValidator
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
                            description: 'Admin level necessary.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "get",
        path: `/getAllEvents`,
        options:{
            handler: ticketController.findAllPossibleEvents,
            auth: false,
            tags: ['api', 'ticket'],
            description: 'Route to soft get all events that not happened yet',
            validate: {
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'All events.'
                        },
                        '202': {
                            description: 'No events found.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "get",
        path: `/getAllActiveEvents`,
        options:{
            handler: ticketController.softFindAllEvents,
            auth: false,
            tags: ['api', 'ticket'],
            description: 'Route to soft get all events',
            validate: {
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'All active events.'
                        },
                        '202': {
                            description: 'No events found.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "get",
        path: `/getAllRawTickets`,
        options:{
            handler: ticketController.findAllRawEvents,
            auth: "jwt",
            tags: ['api', 'ticket'],
            description: 'Route to get all events',
            validate: {
                headers: TicketValidator.jwtValidator,
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'All active events.'
                        },
                        '202': {
                            description: 'No events found.'
                        },
                        '401':{
                            description: 'Admin level necessary.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "post",
        path: `/deactivate-event/{id}`,
        options:{
            handler: ticketController.deactivateEvent,
            auth: "jwt",
            tags: ['api', 'ticket'],
            description: 'Route to deactivate event',
            validate: {
                headers: TicketValidator.jwtValidator,
                params: TicketValidator.deactivateEventValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'All active events.'
                        },
                        '401':{
                            description: 'Admin level necessary.'
                        },
                        '404':{
                            description: 'Event not found'
                        },
                        '406':{
                            description: 'Event already inactive.'
                        }
                        
                    }
                }
            }
        }
    });

    server.route({
        method: "post",
        path: `/reactivate-event/{id}`,
        options:{
            handler: ticketController.reactivateEvent,
            auth: "jwt",
            tags: ['api', 'ticket'],
            description: 'Route to reactivate a previoulsy deactivated event',
            validate: {
                headers: TicketValidator.jwtValidator,
                params: TicketValidator.reactivateEventValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'All active events.'
                        },
                        '401':{
                            description: 'Admin level necessary.'
                        },
                        '404':{
                            description: 'Event not found.'
                        },
                        '406':{
                            description: 'Event already active.'
                        }
                        
                    }
                }
            }
        }
    });

    server.route({
        method: "get",
        path: `/get-event/{id}`,
        options:{
            handler: ticketController.findEventById,
            auth: "jwt",
            tags: ['api', 'ticket'],
            description: 'Route to return a specific event to the user.',
            validate: {
                headers: TicketValidator.jwtValidator,
                params: TicketValidator.findEventValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Return Event.'
                        },
                        '401':{
                            description: 'Missing authorization'
                        },
                        '404':{
                            description: 'Event not found'
                        },
                    }
                }
            }
        }
    });

    server.route({
        method: "patch",
        path: `/update-event/{id}`,
        options:{
            handler: ticketController.updateEvent,
            auth: "jwt",
            tags: ['api', 'ticket'],
            description: 'Route to update an event.',
            validate: {
                headers: TicketValidator.jwtValidator,
                params: TicketValidator.updateEventParamsValidator,
                payload: TicketValidator.updateEventPayloadValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Return Event.'
                        },
                        '401':{
                            description: 'Missing authorization'
                        },
                        '404':{
                            description: 'Event not found'
                        },
                    }
                }
            }
        }
    });
}