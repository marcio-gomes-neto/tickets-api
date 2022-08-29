import * as Hapi from 'hapi';
import { IServerConfiguration } from 'global-database';
import Boom from 'boom';

import { TicketService } from '../../services/TicketService';
import { UserService } from '../../services/UserService';
import { CreateNewEventRequest, DeactivateEventRequest, FindAllRawEventsRequest, FindEventRequest, ReactivateEventRequest, UpdateEventRequest } from '../../../interfaces/ticket/request';

export class TicketController {
    private ticketService = new TicketService();
    private userService = new UserService();

    constructor(private config:IServerConfiguration){}

    async createNewEvent(request: CreateNewEventRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        const { name, description, genre, type, quantity, price, eventDate } = request.payload;
        let eventExists;

        const newEvent = {
            name,
            description,
            genre,
            type,
            quantity,
            price: price*100,
            eventDate: new Date(eventDate),
        };

        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.unauthorized('Invalid id.');
            if (!findUser.admin) return Boom.unauthorized('Admin level necessary.');
            if (findUser.status !== 'active') return Boom.unauthorized('User needs to be active.');
            
            const findEvents = await this.ticketService.getEventByName(name);
            findEvents.forEach(event => { if (event.price === newEvent.price) eventExists = true; });
            if (eventExists) return Boom.badRequest('This event already registered with this price.');

            const createNewEvent = await this.ticketService.createNewTicket(newEvent);
            const response = {
                success: true,
                payload: {
                    id: createNewEvent.id,
                    name: createNewEvent.name,
                    quantity: createNewEvent.quantity,
                    eventDate: createNewEvent.eventDate
                }
            };

            return h.response(response).code(201);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');   
        }
    }

    async findAllPossibleEvents(request, h: Hapi.ResponseToolkit){
        try {
            const getAllEvents = await this.ticketService.softGetAllPossibleTickets();
            if (!getAllEvents) return h.response({success: true, message: 'No Events Found'}).code(202);
            
            const response = {
                success:true,
                payload: getAllEvents
            };

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');   
        }
    }

    async softFindAllEvents(request, h: Hapi.ResponseToolkit){
        try {
            const getAllActiveEvents = await this.ticketService.softGetAllTickets();
            if (!getAllActiveEvents) return h.response({success: true, message: 'No Events Found'}).code(202);
            
            const response = {
                success:true,
                payload: getAllActiveEvents
            };

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');   
        }
    }

    async findAllRawEvents(request: FindAllRawEventsRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.unauthorized('Invalid id.');
            if (!findUser.admin) return Boom.unauthorized('Admin level necessary.');
            if (findUser.status !== 'active') return Boom.unauthorized('User needs to be active.');

            const allRawEvents = await this.ticketService.getAllTickets();
            const response = {
                success:true,
                payload: allRawEvents
            };

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');  
        }
    }

    async deactivateEvent(request: DeactivateEventRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        const { id } = request.params;
        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.unauthorized('Invalid id.');
            if (!findUser.admin) return Boom.unauthorized('Admin level necessary.');
            if (findUser.status !== 'active') return Boom.unauthorized('User needs to be active.');

            const findEvent = await this.ticketService.getEventById(id);
            if (!findEvent) return Boom.notFound('Event not found.');
            if (!findEvent.active) return Boom.notAcceptable('Event already deactivated.');

            await this.ticketService.deactivateEvent(findEvent);
            const response = {
                success: true,
                payload: {
                    id: findEvent.id,
                    name: findEvent.name,
                    active: false
                }
            };

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');  
        }
    }

    async reactivateEvent(request: ReactivateEventRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        const { id } = request.params;
        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.unauthorized('Invalid id.');
            if (!findUser.admin) return Boom.unauthorized('Admin level necessary.');
            if (findUser.status !== 'active') return Boom.unauthorized('User needs to be active.');

            const findEvent = await this.ticketService.getEventById(id);
            if (!findEvent) return Boom.notFound('Event not found');
            console.log(findEvent);
            if (findEvent.active) return Boom.notAcceptable('Event already active');

            await this.ticketService.activateEvent(findEvent);
            const response = {
                success: true,
                payload: {
                    id: findEvent.id,
                    name: findEvent.name,
                    active: true
                }
            };

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');  
        }
    }

    async findEventById(request: FindEventRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        const { id } = request.params;
        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.unauthorized('Invalid id.');

            const findEvent = await this.ticketService.getEventById(id);
            if (!findEvent) return Boom.notFound('Event not found');
            if (!findEvent.active) return Boom.badRequest('This event is inactive.');

            const response = {
                success: true,
                payload: findEvent
            };

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');  
        }
    }

    async updateEvent(request: UpdateEventRequest, h: Hapi.ResponseToolkit ){
        const { userId } = request.authId;
        const { id } = request.params;
        const { name, description, genre, type, quantity, price, eventDate } = request.payload;

        if (!userId) return Boom.unauthorized('Missing user ID');
        if (Object.keys(request.payload).length === 0) return h.response({success: true, message:'No Changes.'}).code(202); 
        
        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.unauthorized('Invalid id.');
            if (!findUser.admin) return Boom.unauthorized('Admin level necessary.');
            if (findUser.status !== 'active') return Boom.unauthorized('User needs to be active.');

            const findEvent = await this.ticketService.getEventById(id);
            if (!findEvent) return Boom.notFound('Event not found');

            name ? findEvent.name = name : undefined;
            description ? findEvent.description = description : undefined;
            genre ? findEvent.genre = genre : undefined;
            type ? findEvent.type = type : undefined;
            quantity ? findEvent.quantity = quantity : undefined;
            price ? findEvent.price = price*100 : undefined;
            eventDate ? findEvent.eventDate = eventDate :undefined;

            await this.ticketService.saveEventData(findEvent);
            const response = {
                success: true,
                payload: findEvent
            };

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error');  
        }
    }
}