import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//table for friend relationships between users

@Entity('friends_table')
export class FriendEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string; //auto-generated id

    @Column()
    first: number; //user (identified by his 42 id) who invited first

    @Column()
    second: number; //user (identified by his 42 id) who got invited

    @Column()
    status: number;
    //1 - invite pending
    //2 - friends
    
}