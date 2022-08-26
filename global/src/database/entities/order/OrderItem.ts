import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { IOrderItem } from "../../../interfaces/entities/order/IOrderItem";
import { Ticket } from "../ticket/Ticket";
import { Order } from "./Order";

@Entity()
export class OrderItem extends BaseEntity implements IOrderItem{
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    id?: string;

    @ManyToOne(type => Order, Order => Order.id)
    orderId: string;

    @ManyToOne(type => Ticket, Ticket => Ticket.id)
    ticketId: string;

    @Column('integer', {nullable: false, name:'value'})
    value: number;
    
    @Column('integer', {nullable: false, name:'quantity'})
    quantity: number;
}