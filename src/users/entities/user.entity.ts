import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity'
import { AuthenticationProvider } from './authenticationProvider.entity'
import { Coin } from 'src/transactions/entities/coin.entity';
import { Category } from 'src/transactions/entities/category.entity';



@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'boolean', default: false})
    isStaff: boolean;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'boolean', default: false })
    modeDark: boolean;

    @ManyToOne(() => Coin, coin => coin.user)
    coin: Coin; // Relación muchos a uno

    @OneToOne(() => AuthenticationProvider, authenticationProvider => authenticationProvider.user, { cascade: true })
    @JoinColumn()
    authenticationProvider: AuthenticationProvider;

    @OneToMany(() => Transaction, transaction => transaction.user)
    transaction: Transaction[]; // Relación inversa

    @OneToMany(() => Category, category => category.user)
    category: Category[]; // Relación inversa

    constructor() {
        this.coin = { id: 1 } as Coin; // Asignar la moneda por defecto
    }
  
}

