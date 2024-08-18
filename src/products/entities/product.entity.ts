import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Image } from './image.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  description: string;

  @OneToMany(() => Image, (image) => image.product, { cascade: true })
  images: Image[];
}
