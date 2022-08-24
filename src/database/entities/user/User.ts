import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "../../../interfaces/database/entities/IUser";

export class User extends BaseEntity implements IUser{
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    id?: string;

    @Column('varying character', {nullable: false, length: 11, name:'cpf'})
    cpf: string;

    @Column('varying character', {nullable: false, length: 100, name:'name'})
    name: string;

    @Column('varying character', {nullable: false, length: 255, name:'email'})
    email: string;

    @Column('boolean', {nullable: false, default: false, name:'admin'})
    admin: boolean;
}