import { OrderItem, IOrderItem } from 'global-database';

export class ItemService{
    private itemRepository = OrderItem;

    async findItemsFromOrderId(id: string){
        const item = await this.itemRepository.find({where: {orderId: id}});
        return item;
    }

    async removeItemsFromOrder(item: IOrderItem[]){
        const removeItems = await this.itemRepository.remove(item);
        return removeItems;
    }

    async addNewOrderItem(item: IOrderItem[]){
        const newOrderItem = await this.itemRepository.save(item);
        return newOrderItem;
    }

    async findItemsFromTicketAndOrderId(ticketId:string, orderId:string){
        const item = await this.itemRepository.find({where: `ticket_id='${ticketId}' AND order_id='${orderId}'`});
        return item;
    }
}