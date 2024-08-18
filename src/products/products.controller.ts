import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';

import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() data: Partial<Product>): Promise<Product> {
    return this.productsService.create(data);
  }
  @Get()
  findMany() {
    return this.productsService.findMany();
  }
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.productsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: Partial<Product>,
  ): Promise<Product> {
    return this.productsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productsService.delete(id);
  }
  @Delete(':id/image/:imageId')
 async deleteImage(@Param('id') id: number, @Param('imageId') imageId: string) {
    const updatedProduct = await this.productsService.deleteImage(id, imageId);
    
    return updatedProduct;
  }
}
