import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ApiQuery } from '@nestjs/swagger';


export enum AuthorSortBy {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  ID = 'id'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}


@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', enum: AuthorSortBy, required: false })
  @ApiQuery({ name: 'sortOrder', enum: SortOrder, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: AuthorSortBy,
    @Query('sortOrder') sortOrder?: SortOrder,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.authorService.findAll(search,sortBy,sortOrder,Number(page),Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorService.remove(id);
  }
}
