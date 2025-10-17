import { Entity, Column, ObjectIdColumn, CreateDateColumn } from 'typeorm';

@Entity('menu_items')
export class MenuItem {
  @ObjectIdColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  image: string;

  @Column()
  category: string;

  @Column()
  businessProfileId: string;

  @CreateDateColumn()
  createdAt: Date;
}