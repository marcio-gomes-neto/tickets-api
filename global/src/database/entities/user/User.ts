import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { IUser } from "../../../interfaces/entities/user/IUser";
@Entity()
export class User extends BaseEntity implements IUser{
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    id?: string;

    @Column('varchar', {nullable: false, length: 11, name:'cpf'})
    cpf: string;

    @Column('varchar', {nullable: true, length: 255, name:'email'})
    email: string;

    @Column('varchar', {nullable: false, length: 255, name:'email_verification'})
    emailVerification: string;
    
    @Column('varchar', {nullable: false, length: 512, name:'password'})
    password: string;

    @Column('varchar', {nullable: false, length: 100, name:'name'})
    name: string;

    @Column('varchar', {nullable: false, length: 50, name:'phone'})
    phone: string;

    @Column('varchar', {nullable: false, default: 'waiting-verification', name:'status'})
    status: string;

    @Column('boolean', {nullable: false, default: false, name:'admin'})
    admin: boolean;

    @Column('time with time zone', {nullable: false, default:"CURRENT_TIMESTAMP", name:'created_at'})
    createdAt: Timestamp;
}