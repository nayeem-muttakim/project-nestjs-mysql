import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productRepository.create(dto);
    return await this.productRepository.save(product);
  }

  findMany() {
    return this.productRepository.find();
  }

  async update(id: number, dto: CreateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });

    Object.assign(product, dto);

    return this.productRepository.save(product);
  }

  async delete(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });

    return this.productRepository.remove(product);
  }
}
