import { Entity, Column, ObjectIdColumn, CreateDateColumn } from 'typeorm';

@Entity('business_comments')
export class BusinessComment {
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
  content: string;

  @Column({ nullable: true })
  parentCommentId?: string; // For reply functionality

  @Column({ default: true })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}