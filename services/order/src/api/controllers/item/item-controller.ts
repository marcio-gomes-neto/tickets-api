import * as Hapi from 'hapi';
import Boom from 'boom';
import { IServerConfiguration } from 'global-database';

import { TicketService } from '../../services/TicketService';
import { UserService } from '../../services/UserService';
import { OrderService } from '../../services/OrderService';
import { AddTicketInOrderRequest, RemoveTicketInOrderRequest } from '../../../interfaces/item/request';
import { ItemService } from '../../services/ItemService';

export class ItemController {
    private ticketService = new TicketService();
    private userService = new UserService();
    private orderService = new OrderService();
    private itemService = new ItemService();

    constructor(private config:IServerConfiguration){}

    async addTicketInOpenOrder(request: AddTicketInOrderRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        const { id, quantity } = request.payload;
        let response;
        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.unauthorized('User not found.');
            if (findUser.status !== 'active') return Boom.unauthorized('User needs to be active to add an item.');
           
            const findTicket = await this.ticketService.getEventById(id);
            if(!findTicket) return Boom.notFound('Event not found.');
            if((findTicket.quantity - quantity) < 0) return Boom.badRequest(`There is only ${findTicket.quantity} available tickets for this event.`);

            const findOpenOrder = await this.orderService.findOpenOrderByUserId(userId);
            if (!findOpenOrder) {
                //Wolfenstein:
                const theNewOrder = {
                    userId: userId,
                    value: findTicket.price * quantity,
                    quantity: quantity,
                }; 

                const newOpenOrder = await this.orderService.createNewOrder(theNewOrder);

                const newOrderItem = {
                    orderId: newOpenOrder.id,
                    ticketId: findTicket.id,
                    value: findTicket.price,
                    quantity: 1
                };

                const newItems = [];
                for (let i = 0; i < quantity; i++) {
                    newItems.push(newOrderItem);
                }

                await this.itemService.addNewOrderItem(newItems);

                response = {
                    success: true,
                    payload: {
                        order: newOpenOrder,
                        items: newItems
                    }
                };
            } else {
                findOpenOrder.value += findTicket.price * quantity;
                findOpenOrder.quantity += quantity;
                await this.orderService.saveOrderChanges(findOpenOrder);

                const newOrderItem = {
                    orderId: findOpenOrder.id,
                    ticketId: findTicket.id,
                    value: findTicket.price,
                    quantity: 1
                };

                const newItems = [];
                for (let i = 0; i < quantity; i++) {
                    newItems.push(newOrderItem);
                }

                await this.itemService.addNewOrderItem(newItems);
                response = {
                    success: true,
                    payload: {
                        order: findOpenOrder,
                        items: newOrderItem
                    }
                };
            }

            return h.response(response).code(201);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error'); 
        }
    }

    async removeItemInOpenOrder(request: RemoveTicketInOrderRequest, h: Hapi.ResponseToolkit ){
        const { userId } = request.authId;
        const { id, quantity } = request.payload;
        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.unauthorized('User not found.');
           
            const findOpenOrder = await this.orderService.findOpenOrderByUserId(userId);
            if (!findOpenOrder) return Boom.notFound('There are no open order at the moment.');

            const findItems = await this.itemService.findItemsFromTicketAndOrderId(id, findOpenOrder.id);
            if(!findItems) return Boom.notFound('There are no items in the open order.');
            if(findItems.length < quantity) return Boom.notAcceptable(`There are not ${quantity} itens in your order`);
            
            findOpenOrder.value -= findItems[0].value * quantity;
            findOpenOrder.quantity -= quantity;

            await this.orderService.saveOrderChanges(findOpenOrder);

            const removeItems = [];
            for (let i = 0; i < quantity; i++) {
                removeItems.push(findItems[i]);
            }

            const itemsRemoved = await this.itemService.removeItemsFromOrder(removeItems);

            const response = {
                success: true,
                payload: {
                    order: findOpenOrder,
                    itemsRemoved: itemsRemoved
                }
                
            };

            return h.response(response).code(201);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error'); 
        }
    }
}