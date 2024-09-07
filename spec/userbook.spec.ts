import { describe, it, expect } from 'vitest';
import { type FastifyInstance } from 'fastify';
import { createdUserId, authToken, createdBookId, randomUsername, userPassword } from './main.spec';

export async function runUserBookTests(app: FastifyInstance) {
  describe('User Book API', () => {
    describe('POST /users/:userId/books/:bookId', () => {
      it('should attach a book to a user', async () => {
        const response = await app.inject({
          method: 'POST',
          url: `/users/${createdUserId}/books/${createdBookId}`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.payload)).toHaveProperty('success', true);
      });

      it('should return 401 if not authenticated', async () => {
        const response = await app.inject({
          method: 'POST',
          url: `/users/${createdUserId}/books/${createdBookId}`,
        });

        expect(response.statusCode).toBe(401);
      });

      it('should return 403 if trying to attach book to another user', async () => {
        const userResponse = await app.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: randomUsername + 'duplicate',
            password: userPassword,
          },
        });

        const user = JSON.parse(userResponse.payload);

        const response = await app.inject({
          method: 'POST',
          url: `/users/${user.id}/books/${createdBookId}`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        expect(response.statusCode).toBe(403);
      });

      it('should return 400 if userId is not a valid UUID', async () => {
        const response = await app.inject({
          method: 'POST',
          url: `/users/not-a-uuid/books/${createdBookId}`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        expect(response.statusCode).toBe(400);
      });

      it('should return 400 if bookId is not a valid UUID', async () => {
        const response = await app.inject({
          method: 'POST',
          url: `/users/${createdUserId}/books/uuid`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        expect(response.statusCode).toBe(400);
      });

      it('should return 400 if book does not exist', async () => {
        const nonExistentBookId = '11111111-1111-1111-1111-111111111111';

        const response = await app.inject({
          method: 'POST',
          url: `/users/${createdUserId}/books/${nonExistentBookId}`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.payload)).toHaveProperty('error', 'Invalid book ID');
      });

      it('should return 409 if book is already attached to user', async () => {
        await app.inject({
          method: 'POST',
          url: `/users/${createdUserId}/books/${createdBookId}`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const response = await app.inject({
          method: 'POST',
          url: `/users/${createdUserId}/books/${createdBookId}`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        expect(response.statusCode).toBe(409);
        expect(JSON.parse(response.payload)).toHaveProperty('error', 'Book already attached to user');
      });
    });
  });
}
