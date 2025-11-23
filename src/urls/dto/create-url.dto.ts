import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty({ message: 'La URL no puede estar vacía' })
  @IsUrl({}, { message: 'Debes proporcionar una URL válida (ej: https://google.com)' })
  originalUrl: string;
}