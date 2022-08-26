import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { IOrder } from "../../../interfaces/entities/order/IOrder";
import { User } from "../user/User";

@Entity()
export class Order extends BaseEntity implements IOrder{
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    id?: string;

    @ManyToOne(type => User, User => User.id)
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