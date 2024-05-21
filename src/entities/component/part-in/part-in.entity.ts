import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Component } from '../component/component.entity';

@Entity()
export class PartIn {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Component)
  component: Component;

  @Column({
    type: 'date',
  })
  dateOrder: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  dateArrival: Date;

  @Column({
    type: 'decimal',
  })
  amount: number;

  @Column({
    type: 'int',
  })
  count: number;
}
