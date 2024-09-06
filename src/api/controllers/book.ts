import type { FastifyReply, FastifyRequest } from 'fastify';
import { createBookInDb } from '../../dal/book';
import type { CreateBookBody } from '../schemas/book';

export async function createBook(request: FastifyRequest<{ Body: CreateBookBody }>, reply: FastifyReply) {
  const { title, author } = request.body;
  try {
    const book = await createBookInDb(title, author);
    reply.code(201).send(book);
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
}
