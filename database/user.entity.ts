import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm'

//table for users

@Entity()
export class UserEntity {
    @PrimaryColumn({ unique: true })
    id: string; //42 id

    @CreateDateColumn()
    created: Date; //auto-generated date

    @Column('text')
    login: string; //42 login

    @Column({nullable: true})
    username: string; //username

    @Column({nullable: true})
    avatar: string; //avatar

    @Column({ nullable: true})
    fortyTwoAvatar: string; //link to 42 avatar

    @Column()
    email: string; //42 email ?

}