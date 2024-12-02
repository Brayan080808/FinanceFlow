import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn,ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity'
import { Coin } from './coin.entity';
import { Category } from './category.entity';


@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @Column({ type: 'decimal'})
    value: number;

    @Column({ type: 'varchar'})
    name: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @ManyToOne(() => Coin, coin => coin.transaction, { cascade: true })
    coin: Coin; // Relación uno a muchos

    @ManyToOne(() => Category, category => category.transaction, { onDelete: 'CASCADE' })
    category: Category; // Relación uno a muchos
  
    @ManyToOne(() => User, user => user.transaction, { cascade: true })
    user: User; // Relación uno a muchos

}





// INSERT INTO "transaction" ("value", "name", "coinId", "categoryId","userId") VALUES
// (100.50, 'Compra de libros', 1, 188, 13),
// (200.75, 'Venta de productos electrónicos', 1, 189, 13),
// (150.00, 'Pago de suscripción', 1, 190, 13),
// (300.25, 'Factura de servicios', 1, 191, 13),
// (50.50, 'Compra de alimentos', 1, 192, 13),
// (75.00, 'Gastos de transporte', 1, 193, 13),
// (120.99, 'Compra de ropa', 1, 194, 13),
// (250.00, 'Pago de alquiler', 1, 195, 13),
// (80.00, 'Compra de higiene personal', 1, 196, 13),
// (90.00, 'Donación a ONG', 1, 197, 13),
// (110.10, 'Compra de entradas para el cine', 1, 188, 13),
// (140.20, 'Gastos médicos', 1, 189, 13),
// (160.30, 'Compra de regalos', 1, 190, 13),
// (180.40, 'Suscripción a servicio de streaming', 1, 191, 13),
// (200.50, 'Compra de productos de limpieza', 1, 192, 13),
// (220.60, 'Pago de impuestos', 1, 193, 13),
// (240.70, 'Compra de muebles', 1, 194, 13),
// (260.80, 'Gastos de educación', 1, 195, 13),
// (280.90, 'Compra de electrodomésticos', 1, 196, 13),
// (300.00, 'Pago de tarjeta de crédito', 1, 197, 13),
// (320.10, 'Viaje de negocios', 1, 188, 13),
// (340.20, 'Reparación de vehículo', 1, 189, 13),
// (360.30, 'Gastos de vacaciones', 1, 190, 13),
// (380.40, 'Compra de software', 1, 191, 13),
// (400.50, 'Mantenimiento del hogar', 1, 192, 13),
// (420.60, 'Gastos de telefonía', 1, 193, 13),
// (440.70, 'Inversión en acciones', 1, 194, 13),
// (460.80, 'Compra de artículos de jardinería', 1, 195, 13),
// (480.90, 'Curso en línea', 1, 196, 13),
// (500.00, 'Pago de servicios de internet', 1, 197, 13);