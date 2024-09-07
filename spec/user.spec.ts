import { describe, it, expect } from 'vitest';
import { type FastifyInstance } from 'fastify';
import { randomUsername, userPassword, setAuthToken, setCreatedUserId } from './main.spec';

export async function runUserTests(app: FastifyInstance) {
  describe('User API', () => {
    describe('POST /users', () => {
      it('should create a new user with valid data', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: randomUsername,
            password: userPassword,
          },
        });

        expect(response.statusCode).toBe(201);
        const user: { id: string; username: string } = JSON.parse(response.payload);
        expect(user).toHaveProperty('id');
        expect(user.username).toBe(randomUsername);
      });

      it('should return 409 if username already exists', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: randomUsername,
            password: 'anotherpassword',
          },
        });

        expect(response.statusCode).toBe(409);
        expect(JSON.parse(response.payload)).toHaveProperty('error', 'Username already exists');
      });

      it('should return 400 if username is too short', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'abc',
            password: userPassword,
          },
        });

        expect(response.statusCode).toBe(400);
      });

      it('should return 400 if password is too short', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: randomUsername,
            password: 'short',
          },
        });

        expect(response.statusCode).toBe(400);
      });
    });

    describe('POST /users/authenticate', () => {
      it('should authenticate a user with correct credentials', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/users/authenticate',
          payload: {
            username: randomUsername,
            password: userPassword,
          },
        });

        expect(response.statusCode).toBe(200);
        const result: { token: string; id: string } = JSON.parse(response.payload);
        expect(result).toHaveProperty('token');

        setAuthToken(result.token);
        setCreatedUserId(result.id);
      });

      it('should return 401 with incorrect password', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/users/authenticate',
          payload: {
            username: randomUsername,
            password: 'wrongpassword',
          },
        });

        expect(response.statusCode).toBe(401);
        expect(JSON.parse(response.payload)).toHaveProperty('error', 'Invalid username or password');
      });

      it('should return 401 with non-existent username', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/users/authenticate',
          payload: {
            username: 'nonexistentuser',
            password: 'password123',
          },
        });

        expect(response.statusCode).toBe(401);
        expect(JSON.parse(response.payload)).toHaveProperty('error', 'Invalid username or password');
      });
    });
  });
}
