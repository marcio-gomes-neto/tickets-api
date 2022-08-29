import { Order, IOrder } from 'global-database';

export class OrderService{
    private orderRepository = Order;

    async findOrderByUserId(userId: string){
        const order = await this.orderRepository.find({where: `user_id = '${userId}'`});
        return order;
    }

    async findOpenOrderByUserId(userId: string){
        const order = await this.orderRepository.findOne({where: `user_id = '${userId}' AND status='open'`});
        return order;
    }

    async findOrderById(id: string){
        const order = await this.orderRepository.findOne({id: id});
        return order;
    }

    async createNewOrder(order: IOrder){
        const newOrder = await this.orderRepository.save(order);
        return newOrder;
    }

    async cancelOrder(order: IOrder){
        order.status = 'canceled';
        console.log(order);
        await this.orderRepository.save(order);
    }

    async saveOrderChanges(order: IOrder){
        await this.orderRepository.save(order);
    }
}