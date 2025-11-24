import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module'; // Importar AppModule es más real

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) - Should return list of URLs', async () => {
    const response = await request(app.getHttpServer())
      .get('/')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
  
  it('/fake-code/stats (GET) - Should return 404', () => {
    return request(app.getHttpServer())
      .get('/codigo-inventado-123/stats')
      .expect(404);
  });
});