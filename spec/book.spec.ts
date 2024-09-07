import { describe, it, expect } from 'vitest';
import { type FastifyInstance } from 'fastify';
import { authToken, setCreatedBookId, randomBookTitle } from './main.spec';

export async function runBookTests(app: FastifyInstance) {
  describe('Book API', () => {
    describe('POST /books', () => {
      it('should create a new Book with valid data', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/books',
          payload: {
            title: randomBookTitle,
            author: 'Dev from earth',
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const body: { id: string; title: string; author: string } = JSON.parse(response.payload);

        expect(body).toHaveProperty('id');
        expect(body.title).toBe(randomBookTitle);
        expect(body.author).toBe('Dev from earth');
        expect(response.statusCode).toBe(201);
        setCreatedBookId(body.id);
      });

      it('should return 400 if title is too short', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/books',
          payload: {
            title: 'The',
            author: 'Dev from earth',
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.payload);
        expect(body.error).toBeDefined();
      });

      it('should return 400 if author is too long', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/books',
          payload: {
            title: 'The guide to dev',
            author: 'a'.repeat(200),
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.payload);
        expect(body.error).toBeDefined();
      });

      it('should return 409 if book title already exists', async () => {
        await app.inject({
          method: 'POST',
          url: '/books',
          payload: {
            title: 'The guide to code',
            author: 'Dev from earth',
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const response = await app.inject({
          method: 'POST',
          url: '/books',
          payload: {
            title: 'The guide to code',
            author: 'Dev from mars',
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        expect(response.statusCode).toBe(409);
        const body = JSON.parse(response.payload);
        expect(body.error).toBe('Book Title already exists');
      });

      it('should return 401 if no authorization token is provided', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/books',
          payload: {
            title: randomBookTitle,
            author: 'Dev from earth',
          },
        });

        expect(response.statusCode).toBe(401);
      });
    });
  });
}
