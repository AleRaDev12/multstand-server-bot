import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Master {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  paymentCoefficient: number;

  @Column()
  role: string;
}
