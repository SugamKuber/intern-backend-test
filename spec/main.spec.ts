import { describe, beforeAll, afterAll } from 'vitest';
import Fastify, { type FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { config } from 'dotenv';
import { userRoutes } from '../src/api/router/user';
import { bookRoutes } from '../src/api/router/book';
import { initDB } from '../src/init/db';
import { runUserTests } from './user.spec';
import { runBookTests } from './book.spec';
import { runUserBookTests } from './userbook.spec';

let app: FastifyInstance = Fastify();
app.register(fastifyJwt, {
  secret: 'sample_test_jwt_token',
});

export let createdUserId: string;
export let authToken: string;
export let createdBookId: string;
export const userPassword: string = 'samplePassword';
export const randomUsername: string = `user_${Math.random().toString(36).substring(7)}`;
export const randomBookTitle: string = `book_${Math.random().toString(36).substring(7)}`;

export function setCreatedBookId(id: string) {
  createdBookId = id;
}
export function setAuthToken(token: string) {
  authToken = token;
}
export function setCreatedUserId(id: string) {
  createdUserId = id;
}

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

describe('API Tests', async () => {
  await runUserTests(app);
  await runBookTests(app);
  await runUserBookTests(app);
});
