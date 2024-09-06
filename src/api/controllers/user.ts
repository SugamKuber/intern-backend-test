import bcrypt from 'bcrypt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createUserInDb, getUserByUsername, attachBookToUserInDb } from '../../dal/user';
import type { CreateUserBody, AuthenticateUserBody, AttachBookParams } from '../schemas/user';
import type { User, JWTPayload } from '../../types';

export async function createUser(request: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) {
  const { username, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await createUserInDb(username, hashedPassword);
    reply.code(201).send(user);
  } catch (error: any) {
    if (error.constraint === 'users_username_key') {
      reply.code(409).send({ error: 'Username already exists' });
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
    const token = await reply.jwtSign({ userId: user.id } as JWTPayload);
    reply.send({ token });
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
    reply.code(500).send({ error: 'Internal Server Error' });
  }
}
