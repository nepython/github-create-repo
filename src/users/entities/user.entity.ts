import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn() // auto increments integer
    id: number;

    @Column()
    code: string;

    @Column()
    access_token: string;

    @Column({unique: true})
    username: string;

    @Column({default: ''})
    avatar_url: string;
}
