import * as Hapi from 'hapi';
import { IServerConfiguration } from 'global-database';
import Boom from 'boom';

import { TicketService } from '../../services/TicketService';
import { UserService } from '../../services/UserService';
import { OrderService } from '../../services/OrderService';
import { ItemService } from '../../services/ItemService';

import { CancelOpenOrderRequest, CreateNewOrderRequest, FindUserOpenOrderRequest, FindUserOrdersRequest, PayOpenOrderRequest } from '../../../interfaces/order/request';

export class OrderController {
    private ticketService = new TicketService();
    private itemService = new ItemService();
    private userService = new UserService();
    private orderService = new OrderService();

    constructor(private config:IServerConfiguration){}

    async createNewOrder(request: CreateNewOrderRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        let orderOpen;
        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.notFound('User not found.');
            if (findUser.status !== 'active') return Boom.unauthorized('User needs to be active create a order.');
           
            
            const findUserOrder = await this.orderService.findOrderByUserId(userId);
            findUserOrder.forEach(order => {
                if( order.status === 'open' ) orderOpen = true;
            });
            if(orderOpen) return Boom.badRequest('Already have a open order');
            //Wolfenstein:
            const theNewOrder = {
                userId: userId,
                value: 0,
                quantity: 0,
            };    

            const createNewOrder = await this.orderService.createNewOrder(theNewOrder);
            const response = {
                success: true,
                payload: createNewOrder
            };

            return h.response(response).code(201);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error'); 
        }
    }

    async findAllUserOrders(request: FindUserOrdersRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.notFound('User not found.');

            const findUserOrder = await this.orderService.findOrderByUserId(userId);
            if (!findUserOrder) return h.response({success: true, message:'No orders found for this customer'}).code(202);

            const response = {
                success: true,
                payload: findUserOrder
            };

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error'); 
        }
    }

    async findOrderItems(request: FindUserOrdersRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        const { id } = request.params;
        
        if (!userId) return Boom.unauthorized('Missing user ID');
        try {
            const findOrder = await this.orderService.findOrderById(id);
            if (!findOrder) return Boom.notFound('Order not found');
            if (findOrder.userId !== userId) return Boom.unauthorized('This order belongs to another user');

            const orderItems = await this.itemService.findItemsFromOrderId(id);
            const response = {
                success: true,
                payload: {
                    order: findOrder,
                    orderItems: orderItems
                }
            };

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error'); 
        }
    }

    async findUserOpenOrder(request: FindUserOpenOrderRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUserOpenOrder = await this.orderService.findOpenOrderByUserId(userId);
            if (!findUserOpenOrder) return h.response({success: true, message:'No open order found.'}).code(202);

            const findOpenOrderItems = await this.itemService.findItemsFromOrderId(findUserOpenOrder.id);
            const response = {
                success: true,
                payload: {
                    order: findUserOpenOrder,
                    item: findOpenOrderItems ? findOpenOrderItems : 'No items yet.'
                }
            };

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error'); 
        }
    }

    async cancelOpenOrder(request: CancelOpenOrderRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        if (!userId) return Boom.unauthorized('Missing user ID');
        
        try {
            const findUserOpenOrder = await this.orderService.findOpenOrderByUserId(userId);
            if (!findUserOpenOrder) return h.response({success: true, message:'No open order found for this customer'}).code(202);

            await this.orderService.cancelOrder(findUserOpenOrder);
            const response = {
                success: true,
                message: 'Order Canceled.'
            };

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error'); 
        }
    }

    async payOpenOrder(request: PayOpenOrderRequest, h: Hapi.ResponseToolkit){
        const { userId } = request.authId;
        const { type, paymentOptions } = request.payload;
        if (!userId) return Boom.unauthorized('Missing user ID');

        try {
            const findUser = await this.userService.findUserById(userId);
            if (!findUser) return Boom.unauthorized('User not found.');
            if (findUser.status !== 'active') return Boom.unauthorized('User needs to be active to finish a purchase.');
            
            const findUserOpenOrder = await this.orderService.findOpenOrderByUserId(userId);
            if (!findUserOpenOrder) return h.response({success: true, message:'No open order found for this customer'}).code(202);

            if (findUserOpenOrder.quantity === 0) return Boom.notAcceptable('Order is empty.');
            
            //Here we should do the payment validations
            console.log(paymentOptions);
            //..

            findUserOpenOrder.paymentType = type;
            findUserOpenOrder.status = 'paid';
            await this.orderService.saveOrderChanges(findUserOpenOrder);
            
            const orderItems = await this.itemService.findItemsFromOrderId(findUserOpenOrder.id);
            let quantityCounter = {};

            orderItems.forEach(item => {
                quantityCounter[item.ticketId] ? quantityCounter[item.ticketId] += 1 : quantityCounter[item.ticketId] = 1;
            });

            Object.keys(quantityCounter).forEach(async (item) => {
                const findPurchasedTicket = await this.ticketService.getEventById(item);
                if(!findPurchasedTicket) throw 'Unexpected Error.';

                findPurchasedTicket.quantity = findPurchasedTicket.quantity - quantityCounter[item];

                await this.ticketService.saveEventData(findPurchasedTicket);
            });

            const response = {
                success: true,
                order: findUserOpenOrder,
                orderItems: orderItems
            };

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.badRequest('Unexpected Error.'); 
        }
    }
}