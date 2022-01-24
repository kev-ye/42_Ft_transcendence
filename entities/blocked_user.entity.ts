import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

// table for blocked user

@Entity()
export class BlockedUserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string; //Auto-generated ID

	@Column({ nullable: false })
	first: number; // user (identified by his 42 id) who blocked the second user

	@Column({ nullable: false })
	second: number; // user (identified by his 42 id) who got blocked by the first user
}