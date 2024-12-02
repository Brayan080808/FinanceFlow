import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity'; 
import { Transaction } from './transaction.entity';

@Entity()
export class Coin {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string;
    
    @Column()
    currency: string;

    @Column({ type: 'decimal' })
    value: number;

    @OneToMany(() => User, user => user.coin)
    user: User[]; // Relación inversa

    @OneToMany(() => Transaction, transaction => transaction.coin)
    transaction: User[]; // Relación inversa
}