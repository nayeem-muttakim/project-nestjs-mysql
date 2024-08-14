import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(data:Partial<Product>):Promise<Product> {
    const product = this.productRepository.create(data);
    return await this.productRepository.save(product);
  }

  findMany() {
    return this.productRepository.find();
  }
  findById(id:number) {
    return this.productRepository.findOneBy({id});
  }

  async update(id: number, data:Partial<Product>):Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    Object.assign(product, data);

    return this.productRepository.save(product);
  }

  async delete(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });

    return this.productRepository.remove(product);
  }
}
