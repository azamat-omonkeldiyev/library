import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { title } from 'process';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateBookDto) {
    try {
      let newbook = await this.prisma.book.create({ data });
      return newbook;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll({
    search,
    authorId,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  }: {
    search?: string;
    authorId?: string;
    sortBy?: 'title' | 'year' | 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const skip = (page - 1) * limit;
        const where = {
          ...(search && {
            title: {
              contains: search,
              mode: Prisma.QueryMode.insensitive, 
            },
          }),
          ...(authorId && { authorId }),
        };

      const books = await this.prisma.book.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
        include:{author: true}
      });

      const total = await this.prisma.book.count({
        where,
      });

      return {
        data: books,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      let book = await this.prisma.book.findFirst({ where: { id } });
      if (!book) {
        throw new NotFoundException('Auhtor not found!');
      }
      return book;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, data: UpdateBookDto) {
    try {
      await this.findOne(id);
      let book = await this.prisma.book.update({ where: { id }, data });
      return book;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      let book = await this.prisma.book.delete({ where: { id } });
      return book;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
