import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('games')
export class GameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string; //this id is being used as room name to communicate with players

    @Column({nullable: true})
    first: string;  //first player's socket ID

    @Column({nullable: true})
    second: string; //second player's socket ID

    @Column({default: 0})
    first_score: number;

    @Column({default: 0})
    second_score: number;

    @Column({default: 5})
    limit_game: number;

    @Column({nullable: true})
    creator_id: string; //userID of game's creator
}