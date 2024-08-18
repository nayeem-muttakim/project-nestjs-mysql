import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Image } from './entities/image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(data);
    return await this.productRepository.save(product);
  }

  findMany() {
    return this.productRepository.find();
  }
  findById(id: number) {
    return this.productRepository.findOneBy({ id });
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    Object.assign(product, data);

    return this.productRepository.save(product);
  }

  async delete(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });

    return this.productRepository.remove(product);
  }

  async deleteImage(productId: number, imageId: number): Promise<Product> {
    const image = await this.imageRepository.findOne({
      where: { id: imageId, product: { id: productId } },
    });

    if (image) {
      await this.imageRepository.remove(image);
    }
    return this.productRepository.findOne({
      where: { id: productId },
      relations: ['images'],
    });
  }
}
