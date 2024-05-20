import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../client/client.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client)
  client: Client;

  @Column()
  amount: number;

  @Column()
  contractDate: Date;

  @Column()
  daysToComplete: number;
}
