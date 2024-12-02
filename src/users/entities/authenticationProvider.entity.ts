import { Entity, Column, PrimaryGeneratedColumn, OneToOne, Unique } from 'typeorm';
import { User } from './user.entity'

@Entity()
@Unique(['idProvider', 'siteProvider'])
export class AuthenticationProvider {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    idProvider: string;

    @Column()
    siteProvider: string

    @OneToOne(() => User, user => user.authenticationProvider)
    user: User;
}
