import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Component {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  comment: string;
}
