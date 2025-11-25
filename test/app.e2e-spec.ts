import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const express = require('express');
    const path = require('path');

    app.use('/', express.static(path.join(process.cwd(), 'client')));

    await app.init();
  });

  it('/ (GET) - Should serve Frontend HTML', async () => {
    const response = await request(app.getHttpServer())
      .get('/index.html')
      .expect(200)
      .expect('Content-Type', /html/);

    expect(response.text).toContain('Acorta-T');
  });

  it('/fake-code/stats (GET) - Should return 404', () => {
    return request(app.getHttpServer())
      .get('/codigo-inventado-123/stats')
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});