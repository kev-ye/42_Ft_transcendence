import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SpectatorEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    chat_id: string;

    @Column()
    user_id: string;
}