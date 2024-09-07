import type { FastifyReply, FastifyRequest } from 'fastify';
import { createBookInDb } from '../../dal/book';
import type { CreateBookBody } from '../schemas/book';
import { DatabaseError } from 'pg';

export async function createBook(request: FastifyRequest<{ Body: CreateBookBody }>, reply: FastifyReply) {
  const { title, author } = request.body;
  try {
    const book = await createBookInDb(title, author);
    reply.code(201).send(book);
  } catch (error) {
    if (error instanceof DatabaseError) {
      if (error.constraint === 'books_title_key') {
        reply.code(409).send({ error: 'Book Title already exists' });
      } else {
        reply.code(500).send({ error: 'Internal Server Error' });
      }
    } else {
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  }
}
