import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNumber: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  organization: string;
}
