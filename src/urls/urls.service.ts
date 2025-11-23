import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { PrismaService } from '../prisma.service';
import { nanoid } from 'nanoid';
import { Prisma } from '@prisma/client';

@Injectable()
export class UrlsService {

  constructor(private prisma: PrismaService) { }

  async create(createUrlDto: CreateUrlDto) {
    const { originalUrl } = createUrlDto;

    let retries = 5;

    while (retries > 0) {
      const shortCode = nanoid(6);

      try {
        const newUrl = await this.prisma.url.create({
          data: {
            originalUrl,
            shortCode,
          },
        });

        return newUrl;

      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          console.log(`Colisión detectada con ${shortCode}, reintentando...`);
          retries--;
        } else {
          throw new InternalServerErrorException();
        }
      }
    }

    throw new InternalServerErrorException('No se pudo generar un código único');
  }

  findAll() {
    return `This action returns all urls`;
  }

  findOne(id: number) {
    return `This action returns a #${id} url`;
  }

  update(id: number, updateUrlDto: UpdateUrlDto) {
    return `This action updates a #${id} url`;
  }

  remove(id: number) {
    return `This action removes a #${id} url`;
  }
}
