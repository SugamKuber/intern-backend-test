import type { FastifyInstance } from 'fastify';
import { createUser, authenticateUser, attachBookToUser } from '../controllers/user';
import { CreateUserSchema, AuthenticateUserSchema, AttachBookSchema } from '../schemas/user';
import { authenticate, authorizeUser } from '../../middlewares/auth';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/users', { schema: CreateUserSchema }, createUser);

  fastify.post('/users/authenticate', { schema: AuthenticateUserSchema }, authenticateUser);

  fastify.post(
    '/users/:userId/books/:bookId',
    {
      schema: AttachBookSchema,
      preHandler: [authenticate, (request, reply) => authorizeUser(request.params.userId)(request, reply)],
    },
    attachBookToUser,
  );
}
