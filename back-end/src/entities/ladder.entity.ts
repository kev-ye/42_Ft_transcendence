import { Column, Entity, PrimaryColumn } from "typeorm";

// table for ladder level

@Entity()
export class LadderEntity {
	@PrimaryColumn({ unique: true })
	id: string; //user (identified by his 42 id) 

	@Column({ nullable: false })
	gamesPlayed: number;

	@Column({ nullable: false })
	points: number; //start at 100 ? 500 ?
}
