import {
  AfterInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Category {
  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn({ name: 'category_id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'title', type: 'varchar', unique: true })
  title: string;

  @ManyToOne(() => Category)
  parent: Category;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: null })
  categoryPhoto: string;

  @AfterInsert()
  afterInsert() {
    this.categoryPhoto = this.categoryPhoto.replace(
      process.env.TEMP_FOLDER,
      this.id.toString(),
    );
  }
}
