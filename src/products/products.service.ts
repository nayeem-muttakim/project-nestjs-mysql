import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
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
    const product = this.productRepository.create({
      title: data.title,
      category: data.category,
      description: data.description,
    });

    const savedProduct = await this.productRepository.save(product);
    if (data.images && data.images.length > 0) {
      const images = data.images.map((imageData) => {
        return this.imageRepository.create({
          url: imageData.url,
          product: savedProduct,
        });
      });

      const savedImages = await this.imageRepository.save(images);
      savedProduct.images = savedImages;
    }
    return savedProduct;
  }

  findMany() {
    return this.productRepository.find({ relations: ['images'] });
  }
  findById(id: number) {
    return this.productRepository.findOne({
      where: { id },
      relations: ['images'],
    });
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Perform the update
    if (data.title || data.category || data.description) {
      await this.productRepository
        .createQueryBuilder()
        .update(Product)
        .set({
          ...(data.title && { title: data.title }),
          ...(data.category && { category: data.category }),
          ...(data.description && { description: data.description }),
        })
        .where('id = :id', { id })
        .execute();
    }

    // Handle image updates
    if (data.images) {
      // Delete existing images
      await this.imageRepository.delete({ product: { id } });

      // Add new images
      const images = data.images.map((imageData) => {
        return this.imageRepository.create({
          url: imageData.url,
          product,
        });
      });

      product.images = await this.imageRepository.save(images);
    }

    // Return the updated product with relations
    return await this.productRepository.findOne({
      where: { id },
      relations: ['images'],
    });
  }

  async delete(id: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (product.images && product.images.length > 0) {
      await this.imageRepository.remove(product.images);
    }
    await this.productRepository.remove(product);
  }

  async deleteImage(productId: number, imageId: number): Promise<void> {
    console.log(`Searching for product with id ${productId}`);
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['images'],
    });

    if (!product) {
      console.log('Product not found');
      throw new NotFoundException('Product not found');
    }

    // console.log(`Searching for image with id ${imageId}`);

    const image = product.images.find((img) => img.id == imageId);

    if (!image) {
      console.log('Image not found');
      throw new NotFoundException('Image not found');
    }


    await this.imageRepository.remove(image);

    product.images = product.images.filter((img) => img.id !== imageId);
    await this.productRepository.save(product);
  }
}
