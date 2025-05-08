import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassThrough } from 'stream';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthorService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateAuthorDto) {
    try {
      let newAuthor = await this.prisma.author.create({ data });
      return newAuthor;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(
    search?: string,
    sortBy: 'id' | 'name' | 'createdAt' = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const validPage = Number(page) || 1;
      const validLimit = Number(limit) || 10;
      const skip = (validPage - 1) * validLimit;
  
      const where = search
        ? {
            name: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {};
  
      const authors = await this.prisma.author.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: validLimit,
      });
  
      const total = await this.prisma.author.count({
        where,
      });
  
      return {
        data: authors,
        total,
        page: validPage,
        lastPage: Math.ceil(total / validLimit),
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      let author = await this.prisma.author.findFirst({ where: { id } });
      if (!author) {
        throw new NotFoundException('Auhtor not found!');
      }
      return author;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, data: UpdateAuthorDto) {
   try {
    await this.findOne(id)
    let author = await this.prisma.author.update({where:{id},data})
    return author
   } catch (error) {
    throw new BadRequestException(error.message)
   }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      let author = await this.prisma.author.delete({where:{id}})
      return author
     } catch (error) {
      throw new BadRequestException(error.message)
     }
  }
}
