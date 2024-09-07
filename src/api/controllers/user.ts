import bcrypt from 'bcrypt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createUserInDb, getUserByUsername, attachBookToUserInDb } from '../../dal/user';
import type { CreateUserBody, AuthenticateUserBody, AttachBookParams } from '../schemas/user';
import type { User, JWTPayload } from '../../types';
import { DatabaseError } from 'pg';

export async function createUser(request: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) {
  const { username, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await createUserInDb(username, hashedPassword);
    reply.code(201).send(user);
  } catch (error) {
    if (error instanceof DatabaseError) {
      if (error.constraint === 'users_username_key') {
        reply.code(409).send({ error: 'Username already exists' });
      } else {
        reply.code(500).send({ error: 'Internal Server Error' });
      }
    } else {
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  }
}

export async function authenticateUser(request: FastifyRequest<{ Body: AuthenticateUserBody }>, reply: FastifyReply) {
  const { username, password } = request.body;
  try {
    const user = await getUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      reply.code(401).send({ error: 'Invalid username or password' });
      return;
    }
    const id = user.id;
    const token = await reply.jwtSign({ userId: id } as JWTPayload);
    reply.send({ token, id });
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function attachBookToUser(request: FastifyRequest<{ Params: AttachBookParams }>, reply: FastifyReply) {
  const { userId, bookId } = request.params;
  try {
    await attachBookToUserInDb(userId, bookId);
    reply.code(200).send({ success: true });
  } catch (error) {
    if (error instanceof DatabaseError) {
      if (error.constraint === 'user_books_user_id_fkey') {
        reply.code(400).send({ error: 'Invalid user ID' });
      } else if (error.constraint === 'user_books_book_id_fkey') {
        reply.code(400).send({ error: 'Invalid book ID' });
      } else if (error.constraint === 'user_books_pkey') {
        reply.code(409).send({ error: 'Book already attached to user' });
      } else {
        reply.code(500).send({ error: 'Internal Server Error' });
      }
    } else {
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  }
}
