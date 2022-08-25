import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "../../../interfaces/database/entities/IUser";
@Entity()
export class User extends BaseEntity implements IUser{
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    id?: string;

    @Column('varchar', {nullable: false, length: 11, name:'cpf'})
    cpf: string;

    @Column('varchar', {nullable: false, length: 100, name:'name'})
    name: string;

    @Column('varchar', {nullable: false, length: 255, name:'email'})
    email: string;

    @Column('boolean', {nullable: false, default: false, name:'admin'})
    admin: boolean;

    @Column('boolean', {nullable: false, default: true, name:'active'})
    active: boolean;
}