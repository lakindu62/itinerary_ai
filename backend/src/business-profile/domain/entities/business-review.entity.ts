import { Entity, Column, ObjectIdColumn, CreateDateColumn } from 'typeorm';

@Entity('business_reviews')
export class BusinessReview {
  @ObjectIdColumn()
  id: string;

  @Column()
  businessProfileId: string;

  @Column()
  userId: string;

  @Column()
  userName: string;

  @Column()
  userEmail: string;

  @Column()
  rating: number; // 1-5 stars

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: true })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}