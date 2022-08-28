import * as Hapi from 'hapi';
import * as OrderValidator from './order-validator';
import { IServerConfiguration } from 'global-database';

import { OrderController } from './order-controller';

export function startRoute (server: Hapi.Server, configs: IServerConfiguration) {
    const orderController = new OrderController(configs);
    server.bind(orderController);


}