import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Kitoblarni ro‘yxatini olish' })
  @ApiOkResponse({ description: 'Kitoblar muvaffaqiyatli olindi' })
  @ApiQuery({ name: 'search', required: false, description: 'Kitob nomi bo‘yicha qidiruv' })
  @ApiQuery({ name: 'authorId', required: false, description: 'Muallif ID bo‘yicha filter' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['title', 'year', 'price', 'createdAt'], description: 'Saralash ustuni' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Saralash yo‘nalishi' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Sahifa raqami (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementlar soni (default: 10)' })
  findAll(
    @Query('search') search?: string,
    @Query('authorId') authorId?: string,
    @Query('sortBy') sortBy: 'title' | 'year' | 'price' | 'createdAt' = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.bookService.findAll({
      search,
      authorId,
      sortBy,
      sortOrder,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
