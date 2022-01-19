import { Column, Entity, PrimaryColumn } from "typeorm";

// table for chat instances

@Entity()
export class ChatEntity {
	@PrimaryColumn({ nullable: false })
	chat_id: number;

	@Column()
	type: number;
	//1: public room
	//2: private room
	//3: protected room

	@Column({ nullable: true })
	password: string;
	//hashed password

	@Column({ nullable: true })
	owner: number; //42 id of the user who created the channel
}
