import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('mute')
export class MuteEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    first: string;

    @Column()
    second: string;
}
