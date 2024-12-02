import { Entity, Unique, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Transaction } from './transaction.entity';

@Entity()
@Unique(['name', 'user']) 
export class Category {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @Column()
    name: string;

    @Column()
    income: boolean;

    @ManyToOne(() => User, user => user.category, { cascade: true })
    user: User; // Relación uno a muchos

    @OneToMany(() => Transaction, transaction => transaction.category, { cascade: true })
    transaction: Transaction[]; // Relación inversa
}
