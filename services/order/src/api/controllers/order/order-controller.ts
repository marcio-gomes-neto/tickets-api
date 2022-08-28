import * as Hapi from 'hapi';
import { IServerConfiguration } from 'global-database';
import Boom from 'boom';

import { TicketService } from '../../services/TicketService';
import { UserService } from '../../services/UserService';
import { OrderService } from '../../services/OrderService';

export class OrderController {
    private ticketService = new TicketService();
    private userService = new UserService();
    private OrderService = new OrderService();

    constructor(private config:IServerConfiguration){};
}