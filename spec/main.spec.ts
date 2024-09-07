import { describe, beforeAll, it, expect, afterAll } from 'vitest';
import Fastify, { type  FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { config } from 'dotenv';
import { userRoutes } from '../src/api/router/user';
import { bookRoutes } from '../src/api/router/book';
import { initDB } from '../src/init/db';

let app: FastifyInstance = Fastify();
app.register(fastifyJwt, {
  secret: 'sample_test_jwt_token',
});

let createdUserId: string;
let authToken: string;
let createdBookId: string;
const userPassword: string = 'samplePassword';
const randomUsername: string = `user_${Math.random().toString(36).substring(7)}`;

beforeAll(async () => {
  config();
  await app.register(userRoutes);
  await app.register(bookRoutes);
  await app.ready();
  await initDB();
});

afterAll(async () => {
  await app.close();
});

describe('API Tests', () => {
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

        authToken = result.token;
        createdUserId = result.id;
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

  describe('Book API', () => {
    describe('POST /books', () => {
      it('should create a new Book with valid data', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/books',
          payload: {
            title: 'The guide to dev',
            author: 'Dev from earth',
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const body: { id: string; title: string; author: string } = JSON.parse(response.payload);

        expect(body).toHaveProperty('id');
        expect(body.title).toBe('The guide to dev');
        expect(body.author).toBe('Dev from earth');
        expect(response.statusCode).toBe(201);
        createdBookId = body.id;
      });
    });
  });

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
        const anotherUserId: string = '888b5fa4-2db4-4bdf-8924-ebf0aa5389d8';

        const response = await app.inject({
          method: 'POST',
          url: `/users/${anotherUserId}/books/${createdBookId}`,
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
          url: `/users/${createdUserId}/books/not-a-uuid`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        expect(response.statusCode).toBe(400);
      });
    });
  });
});