import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { ITicket } from "../../../interfaces/entities/ticket/ITicket";

@Entity()
export class Ticket extends BaseEntity implements ITicket{
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    id?: string;
    
    @Column('varchar', {nullable: false, length: 100, name:'name'})
    name: string;

    @Column('varchar', {nullable: false, length: 255, name:'description'})
    description: string;

    @Column('varchar', {nullable: false, length: 100, name:'genre'})
    genre: string;

    @Column('varchar', {nullable: false, length: 100, name:'type'})
    type: string;
    
    @Column('integer', {nullable: false, name:'quantity'})
    quantity: number;

    @Column('integer', {nullable: false, name:'price'})
    price: number;

    @Column('time with time zone', {nullable: false, name:'event_date',})
    eventDate: Timestamp;

    @Column('boolean', {nullable: false, default: false, name:'active'})
    active: boolean;

    @Column('time with time zone', {nullable: false, default:"CURRENT_TIMESTAMP" ,name:'created_at'})
    createdAt: Timestamp;
}