import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface ICreateProduct {
  title: string;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  listAll() {
    return this.prisma.product.findMany();
  }

  async create({ title }: ICreateProduct) {
    const slug = slugify(title);

    const productWithSameSlug = await this.prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (productWithSameSlug) {
      throw new Error('Slug already in use');
    }

    return await this.prisma.product.create({
      data: {
        title,
        slug,
      },
    });
  }
}
