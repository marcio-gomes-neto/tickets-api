import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { IOrder } from "../../../interfaces/entities/order/IOrder";

@Entity()
export class Order extends BaseEntity implements IOrder{
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    id?: string;

    @Column('uuid', {nullable: false, name:'user_id'})
    userId: string;

    @Column('integer', {nullable: false, name:'value'})
    value: number;

    @Column('varchar', {nullable: false, length: 50, name:'payment_type'})
    paymentType: string;
    
    @Column('integer', {nullable: false, name:'quantity'})
    quantity: number;

    @Column('varchar', {nullable: false, length: 50, default:'open', name:'status'})
    status: string;
    
    @Column('time with time zone', {nullable: false, default:"CURRENT_TIMESTAMP", name:'created_at'})
    createdAt: Timestamp;
}