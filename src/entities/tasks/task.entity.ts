import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  category: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  shownName: string;

  // *-* target stands

  @Column({
    type: 'int',
  })
  cost: number;

  @Column({
    type: 'int',
  })
  duration: number;

  // @OneToMany(() => Work, (work) => work.task)
  // works: Work[];
}
