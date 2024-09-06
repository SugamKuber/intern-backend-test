import type { FastifyInstance } from 'fastify';
import { createBook } from '../controllers/book';
import { CreateBookSchema } from '../schemas/book';
import { authenticate } from '../../middlewares/auth';

export async function bookRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/books',
    {
      schema: CreateBookSchema,
      preHandler: [authenticate],
    },
    createBook,
  );
}
