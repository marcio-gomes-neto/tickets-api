import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IOrderItem } from "../../../interfaces/entities/order/IOrderItem";
@Entity()
export class OrderItem extends BaseEntity implements IOrderItem{
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    id?: string;

    @Column('uuid', {nullable: false, name:'order_id'})
    orderId: string;

    @Column('uuid', {nullable: false, name:'ticket_id'})
    ticketId: string;

    @Column('integer', {nullable: false, name:'value'})
    value: number;
    
    @Column('integer', {nullable: false, name:'quantity'})
    quantity: number;
}