import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string; // This will store the email

  @Column()
  password: string; // Hashed password

  @Column({ default: 'user' })
  role: string;
}