import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { PrismaService } from '../prisma.service';
import { nanoid } from 'nanoid';
import { Prisma } from '@prisma/client';

@Injectable()
export class UrlsService {

  constructor(private prisma: PrismaService) { }

  // Crear entrada de URL junto con código corto
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

  // Devuelve URL según su código, pero sin añadir un click
  async getUrlStats(code: string) {
    const url = await this.prisma.url.findUnique({
      where: { shortCode: code },
    });

    if (!url) {
      throw new NotFoundException('URL no encontrada');
    }

    return url; 
  }

  // Devuelve el URL según su codigo corto
  async getUrlByCode(code: string) {
    const url = await this.prisma.url.findUnique({
      where: {
        shortCode: code,
      },
    });

    if (!url) {
      throw new NotFoundException('URL no encontrada');
    }

    this.prisma.url.update({
      where: { id: url.id },
      data: { clicks: { increment: 1 } },
    }).catch(err => console.error('Error actualizando clicks', err));

    return url;
  }

  findAll() {
    return this.prisma.url.findMany();
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
