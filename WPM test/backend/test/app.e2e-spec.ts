import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('WPM API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /paragraphs/random', () => {
    return request(app.getHttpServer())
      .get('/paragraphs/random')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('text');
        expect(typeof res.body.text).toBe('string');
        expect(res.body.text.length).toBeGreaterThan(0);
      });
  });

  it('POST /results then GET /results', async () => {
    const payload = {
      wpm: 42,
      accuracy: 97.5,
      charactersTyped: 210,
      durationSeconds: 60,
      completedAt: new Date().toISOString(),
    };
    await request(app.getHttpServer())
      .post('/results')
      .send(payload)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.wpm).toBe(42);
      });

    const list = await request(app.getHttpServer()).get('/results').expect(200);
    expect(Array.isArray(list.body.results)).toBe(true);
    expect(list.body.results.length).toBeGreaterThanOrEqual(1);
    expect(list.body.results[0].wpm).toBe(42);
  });
});
