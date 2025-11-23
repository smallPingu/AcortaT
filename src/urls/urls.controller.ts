import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import type { Response } from 'express';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post() 
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(createUrlDto);
  }

  @Get()
  findAll() {
    return this.urlsService.findAll();
  }

  @Get('view/:id')
  findOne(@Param('id') id: string) {
    return this.urlsService.findOne(+id);
  }

  @Get(':code/stats')
  async getUrlStats(@Param('code') code: string) {
    return this.urlsService.getUrlStats(code);
  }

  @Get(':code') 
  async redirect(
    @Param('code') code: string, 
    @Res() res: Response
  ) {
    const url = await this.urlsService.getUrlByCode(code);

    return res.redirect(url.originalUrl);
  }
}